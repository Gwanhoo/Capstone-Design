import { Router } from 'express';
import {
  createColumn,
  createProject,
  archiveProject,
  analyzeProjectBoard,
  deleteProject,
  getProjectDocs,
  deleteColumn,
  getProjectById,
  getProjectColumns,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateProject,
  updateProjectDocs,
  unarchiveProject,
  updateColumn,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:projectId', authMiddleware, getProjectById);
router.post('/projects', authMiddleware, createProject);
router.patch('/projects/:projectId', authMiddleware, updateProject);
router.patch('/projects/:projectId/archive', authMiddleware, archiveProject);
router.patch('/projects/:projectId/unarchive', authMiddleware, unarchiveProject);
router.delete('/projects/:projectId', authMiddleware, deleteProject);
router.get('/projects/:projectId/docs', authMiddleware, getProjectDocs);
router.patch('/projects/:projectId/docs', authMiddleware, updateProjectDocs);
router.get('/projects/:projectId/members', authMiddleware, getProjectMembers);
router.post('/projects/:projectId/ai/analyze-board', authMiddleware, analyzeProjectBoard);
router.get('/projects/:projectId/columns', authMiddleware, getProjectColumns);
router.post('/projects/:projectId/columns', authMiddleware, createColumn);
router.patch('/projects/:projectId/columns/:columnId', authMiddleware, updateColumn);
router.delete('/projects/:projectId/columns/:columnId', authMiddleware, deleteColumn);
router.delete('/projects/:projectId/members/:userId', authMiddleware, removeProjectMember);

export default router;
