import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { findAccessibleProject } from '../utils/projectAccess.js';
import { getProjectRoomName } from '../sockets/index.js';
import { DEFAULT_COLUMNS } from '../services/projectColumnService.js';


const emitTaskEvent = (req, eventName, projectId, payload) => {
  const io = req.app.get('io');
  if (!io) return;
  const originSocketId = req.headers['x-socket-id'];
  if (originSocketId) {
    io.to(getProjectRoomName(projectId)).except(String(originSocketId)).emit(eventName, payload);
    return;
  }
  io.to(getProjectRoomName(projectId)).emit(eventName, payload);
};

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

    emitTaskEvent(req, 'task:created', projectId, task);

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
  if (!task) return { task: null, project: null, allowed: false, notFound: true };
  const { project, allowed } = await findAccessibleProject(task.projectId, userId);
  if (!project) return { task: null, project: null, allowed: false, notFound: true };
  return { task, project, allowed, notFound: false };
};

const getProjectColumnIds = (project) => new Set(
  (Array.isArray(project.columns) && project.columns.length > 0 ? project.columns : DEFAULT_COLUMNS)
    .map((column) => String(column.id)),
);

const normalizeOrder = (value, fallback = 0) => {
  if (value === undefined) return fallback;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.max(0, Math.floor(numberValue));
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

    emitTaskEvent(req, 'task:updated', task.projectId, task);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};


export const updateTaskMemo = async (req, res) => {
  const { taskId } = req.params;
  const memo = String(req.body?.memo ?? '');

  try {
    const auth = await getAuthorizedTask(taskId, req.user?.userId);
    if (auth.notFound) return res.status(404).json({ success: false, message: 'task not found' });
    if (!auth.allowed) return res.status(403).json({ success: false, message: 'forbidden' });

    auth.task.memo = memo;
    await auth.task.save();

    emitTaskEvent(req, 'task:updated', auth.task.projectId, auth.task);

    return res.status(200).json({
      success: true,
      data: auth.task,
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

    emitTaskEvent(req, 'task:deleted', task.projectId, { taskId: task._id.toString(), projectId: task.projectId });

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

    const targetColumnId = columnId !== undefined ? String(columnId) : auth.task.columnId;
    if (!getProjectColumnIds(auth.project).has(targetColumnId)) {
      return res.status(400).json({ success: false, message: 'invalid column' });
    }

    const targetOrder = normalizeOrder(order, auth.task.order ?? 0);
    const allTasks = await Task.find({ projectId: auth.task.projectId }).sort({ columnId: 1, order: 1, createdAt: 1 });
    const grouped = new Map();

    allTasks.forEach((task) => {
      if (String(task._id) === String(auth.task._id)) return;
      const key = task.columnId;
      grouped.set(key, [...(grouped.get(key) || []), task]);
    });

    const targetTasks = grouped.get(targetColumnId) || [];
    targetTasks.splice(Math.min(targetOrder, targetTasks.length), 0, auth.task);
    grouped.set(targetColumnId, targetTasks);

    const columnsToNormalize = new Set([auth.task.columnId, targetColumnId]);
    const operations = [];

    columnsToNormalize.forEach((currentColumnId) => {
      (grouped.get(currentColumnId) || []).forEach((task, index) => {
        operations.push({
          updateOne: {
            filter: { _id: task._id },
            update: { $set: { columnId: currentColumnId, order: index } },
            runValidators: true,
          },
        });
      });
    });

    if (operations.length > 0) await Task.bulkWrite(operations);

    const task = await Task.findById(taskId);
    emitTaskEvent(req, 'task:moved', task.projectId, task);

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
