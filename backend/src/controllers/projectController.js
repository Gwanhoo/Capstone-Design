import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { canAccessProject } from '../utils/projectAccess.js';

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
    const projects = await Project.find({ $or: [{ createdBy: userId }, { members: userId }] }).sort({ createdAt: -1 });
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
