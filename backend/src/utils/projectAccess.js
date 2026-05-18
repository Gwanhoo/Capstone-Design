import Project from '../models/Project.js';

export const canAccessProject = (project, userId) => {
  if (!project || !userId) return false;
  if (project.createdBy === userId) return true;
  return Array.isArray(project.members) && project.members.includes(userId);
};

export const findAccessibleProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, allowed: false };
  return { project, allowed: canAccessProject(project, userId) };
};
