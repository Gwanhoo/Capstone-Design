import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { findAccessibleProject } from '../utils/projectAccess.js';

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'mongoose error',
  });
};

export const getTasksByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const { project, allowed } = await findAccessibleProject(projectId, req.user?.userId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    const tasks = await Task.find({ projectId }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createTask = async (req, res) => {
  const { projectId } = req.params;

  try {
    const { project, allowed } = await findAccessibleProject(projectId, req.user?.userId);
    if (!project) return res.status(404).json({ success: false, message: 'project not found' });
    if (!allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    const task = await Task.create({
      ...req.body,
      projectId,
    });

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAuthorizedTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) return { task: null, allowed: false, notFound: true };
  const { project, allowed } = await findAccessibleProject(task.projectId, userId);
  if (!project) return { task: null, allowed: false, notFound: true };
  return { task, allowed, notFound: false };
};

export const updateTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const auth = await getAuthorizedTask(taskId, req.user?.userId);
    if (auth.notFound) return res.status(404).json({ success: false, message: 'task not found' });
    if (!auth.allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    const task = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const auth = await getAuthorizedTask(taskId, req.user?.userId);
    if (auth.notFound) return res.status(404).json({ success: false, message: 'task not found' });
    if (!auth.allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    const task = await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const moveTask = async (req, res) => {
  const { taskId } = req.params;
  const { columnId, order } = req.body;

  if (columnId === undefined && order === undefined) {
    return res.status(400).json({
      success: false,
      message: 'invalid request',
    });
  }

  try {
    const auth = await getAuthorizedTask(taskId, req.user?.userId);
    if (auth.notFound) return res.status(404).json({ success: false, message: 'task not found' });
    if (!auth.allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    const payload = {};

    if (columnId !== undefined) {
      payload.columnId = columnId;
    }

    if (order !== undefined) {
      payload.order = order;
    }

    const task = await Task.findByIdAndUpdate(taskId, payload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
