import Project from '../models/Project.js';

export const isProjectOwner = (project, userId) => Boolean(project && userId && String(project.createdBy) === String(userId));

export const canAccessProject = (project, userId) => {
  if (!project || !userId) return false;
  if (isProjectOwner(project, userId)) return true;
  if (project.isArchived === true) return false;
  return Array.isArray(project.members) && project.members.includes(userId);
};

export const getProjectAccessMessage = (project, userId) => {
  if (project?.isArchived === true && !isProjectOwner(project, userId)) {
    return '보관된 프로젝트는 프로젝트 생성자만 접근할 수 있습니다.';
  }
  return 'forbidden';
};

export const findAccessibleProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, allowed: false, message: 'project not found' };
  return { project, allowed: canAccessProject(project, userId), message: getProjectAccessMessage(project, userId) };
};
