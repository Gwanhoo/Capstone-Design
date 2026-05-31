import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { canAccessProject } from '../utils/projectAccess.js';
import { getProjectRoomName } from '../sockets/index.js';
import {
  createProjectColumn,
  deleteProjectColumn,
  getColumnsForProject,
  updateProjectColumn,
} from '../services/projectColumnService.js';

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  return res.status(500).json({ success: false, message: 'mongoose error' });
};

const toPublicUser = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
});

export const getProjects = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const search = String(req.query.search ?? '').trim();
    const query = { $or: [{ createdBy: userId }, { members: userId }] };
    if (search) {
      query.$and = [{ $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] }];
    }
    const projects = await Project.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!canAccessProject(project, req.user?.userId)) return res.status(403).json({ success: false, message: 'forbidden' });

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  try {
    const userId = req.user?.userId;
    const project = await Project.create({
      name: String(name).trim(),
      ...(description !== undefined ? { description } : {}),
      createdBy: userId,
      members: [userId],
      memberCount: 1,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return handleError(res, error);
  }
};


export const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!canAccessProject(project, req.user?.userId)) return res.status(403).json({ success: false, message: 'forbidden' });

    if (name !== undefined) project.name = String(name).trim();
    if (description !== undefined) project.description = String(description).trim();
    await project.save();

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProjectDocs = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!canAccessProject(project, req.user?.userId)) return res.status(403).json({ success: false, message: 'forbidden' });

    return res.status(200).json({ success: true, data: { docs: project.docs || '' } });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProjectDocs = async (req, res) => {
  const { projectId } = req.params;
  const docs = String(req.body?.docs ?? '');

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!canAccessProject(project, req.user?.userId)) return res.status(403).json({ success: false, message: 'forbidden' });

    project.docs = docs;
    await project.save();

    return res.status(200).json({ success: true, data: { docs: project.docs } });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProjectMembers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!canAccessProject(project, req.user?.userId)) return res.status(403).json({ success: false, message: 'forbidden' });

    const memberIds = Array.from(new Set([project.createdBy, ...(project.members || [])]));
    const users = await User.find({ _id: { $in: memberIds } }).select('_id name email');

    return res.status(200).json({
      success: true,
      data: {
        createdBy: project.createdBy,
        members: users.map(toPublicUser),
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const removeProjectMember = async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (project.createdBy !== req.user?.userId) return res.status(403).json({ success: false, message: 'forbidden' });
    if (project.createdBy === userId) return res.status(400).json({ success: false, message: 'owner cannot be removed' });

    const exists = project.members.includes(userId);
    if (!exists) return res.status(404).json({ success: false, message: 'member not found' });

    project.members = project.members.filter((id) => id !== userId);
    project.memberCount = project.members.length;
    await project.save();

    return res.status(200).json({ success: true, data: { userId } });
  } catch (error) {
    return handleError(res, error);
  }
};


const emitColumnEvent = (req, eventName, projectId, payload) => {
  const io = req.app.get('io');
  if (!io) return;
  io.to(getProjectRoomName(projectId)).emit(eventName, payload);
};

const handleColumnServiceResult = (res, result) => {
  if (!result.project) return res.status(404).json({ success: false, message: 'project not found' });
  if (!result.allowed) return res.status(403).json({ success: false, message: 'forbidden' });
  return null;
};

export const getProjectColumns = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await getColumnsForProject(projectId, req.user?.userId);
    const failure = handleColumnServiceResult(res, result);
    if (failure) return failure;

    return res.status(200).json({ success: true, data: result.columns });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createColumn = async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await createProjectColumn(projectId, req.user?.userId, req.body?.title);
    const failure = handleColumnServiceResult(res, result);
    if (failure) return failure;

    emitColumnEvent(req, 'column:created', projectId, result.column);
    return res.status(201).json({ success: true, data: result.column });
  } catch (error) {
    if (!error.statusCode) return handleError(res, error);
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }
};

export const updateColumn = async (req, res) => {
  const { projectId, columnId } = req.params;

  try {
    const result = await updateProjectColumn(projectId, req.user?.userId, columnId, req.body?.title);
    const failure = handleColumnServiceResult(res, result);
    if (failure) return failure;

    emitColumnEvent(req, 'column:updated', projectId, result.column);
    return res.status(200).json({ success: true, data: result.column });
  } catch (error) {
    if (!error.statusCode) return handleError(res, error);
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  const { projectId, columnId } = req.params;

  try {
    const result = await deleteProjectColumn(projectId, req.user?.userId, columnId);
    const failure = handleColumnServiceResult(res, result);
    if (failure) return failure;

    emitColumnEvent(req, 'column:deleted', projectId, { columnId });
    return res.status(200).json({ success: true, data: { columnId } });
  } catch (error) {
    if (!error.statusCode) return handleError(res, error);
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }
};
