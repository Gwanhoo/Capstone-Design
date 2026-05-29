import crypto from 'crypto';
import Task from '../models/Task.js';
import { findAccessibleProject } from '../utils/projectAccess.js';

export const DEFAULT_COLUMNS = [
  { id: 'todo', title: '할 일', order: 0 },
  { id: 'in-progress', title: '진행 중', order: 1 },
  { id: 'done', title: '완료', order: 2 },
];

const DEFAULT_COLUMN_IDS = new Set(DEFAULT_COLUMNS.map((column) => column.id));

const sanitizeColumns = (columns) => [...columns]
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((column, index) => ({
    id: String(column.id),
    title: String(column.title),
    order: index,
  }));

const ensureProjectColumns = async (project) => {
  if (Array.isArray(project.columns) && project.columns.length > 0) {
    const merged = [...project.columns.map((column) => column.toObject?.() ?? column)];
    DEFAULT_COLUMNS.forEach((defaultColumn) => {
      if (!merged.some((column) => column.id === defaultColumn.id)) {
        merged.push(defaultColumn);
      }
    });
    project.columns = sanitizeColumns(merged);
    await project.save();
    return project.columns;
  }

  project.columns = DEFAULT_COLUMNS;
  await project.save();
  return project.columns;
};

export const getColumnsForProject = async (projectId, userId) => {
  const { project, allowed } = await findAccessibleProject(projectId, userId);
  if (!project) return { project: null, allowed: false, columns: [] };
  if (!allowed) return { project, allowed: false, columns: [] };

  const columns = await ensureProjectColumns(project);
  return { project, allowed: true, columns: sanitizeColumns(columns) };
};

const createColumnId = (title, existingIds) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'column';

  let candidate = base;
  while (existingIds.has(candidate)) {
    candidate = `${base}-${crypto.randomBytes(3).toString('hex')}`;
  }
  return candidate;
};

export const createProjectColumn = async (projectId, userId, title) => {
  const trimmedTitle = String(title ?? '').trim();
  if (!trimmedTitle) {
    const error = new Error('invalid request');
    error.statusCode = 400;
    throw error;
  }

  const { project, allowed, columns } = await getColumnsForProject(projectId, userId);
  if (!project) return { project: null, allowed: false, column: null };
  if (!allowed) return { project, allowed: false, column: null };

  const existingIds = new Set(columns.map((column) => column.id));
  const column = {
    id: createColumnId(trimmedTitle, existingIds),
    title: trimmedTitle,
    order: columns.length,
  };

  project.columns = [...columns, column];
  await project.save();
  return { project, allowed: true, column, columns: sanitizeColumns(project.columns) };
};

export const updateProjectColumn = async (projectId, userId, columnId, title) => {
  const trimmedTitle = String(title ?? '').trim();
  if (!trimmedTitle) {
    const error = new Error('invalid request');
    error.statusCode = 400;
    throw error;
  }

  const { project, allowed, columns } = await getColumnsForProject(projectId, userId);
  if (!project) return { project: null, allowed: false, column: null };
  if (!allowed) return { project, allowed: false, column: null };

  const nextColumns = columns.map((column) => (column.id === columnId ? { ...column, title: trimmedTitle } : column));
  const column = nextColumns.find((item) => item.id === columnId);
  if (!column) {
    const error = new Error('column not found');
    error.statusCode = 404;
    throw error;
  }

  project.columns = sanitizeColumns(nextColumns);
  await project.save();
  return { project, allowed: true, column };
};

export const deleteProjectColumn = async (projectId, userId, columnId) => {
  if (DEFAULT_COLUMN_IDS.has(columnId)) {
    const error = new Error('default column cannot be deleted');
    error.statusCode = 400;
    throw error;
  }

  const { project, allowed, columns } = await getColumnsForProject(projectId, userId);
  if (!project) return { project: null, allowed: false, columnId: null };
  if (!allowed) return { project, allowed: false, columnId: null };

  const exists = columns.some((column) => column.id === columnId);
  if (!exists) {
    const error = new Error('column not found');
    error.statusCode = 404;
    throw error;
  }

  const taskCount = await Task.countDocuments({ projectId, columnId });
  if (taskCount > 0) {
    const error = new Error('column has tasks');
    error.statusCode = 409;
    throw error;
  }

  project.columns = sanitizeColumns(columns.filter((column) => column.id !== columnId));
  await project.save();
  return { project, allowed: true, columnId };
};
