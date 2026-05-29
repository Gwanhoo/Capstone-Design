import { Router } from 'express';
import {
  createColumn,
  createProject,
  deleteColumn,
  getProjectById,
  getProjectColumns,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateColumn,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:projectId', authMiddleware, getProjectById);
router.post('/projects', authMiddleware, createProject);
router.get('/projects/:projectId/members', authMiddleware, getProjectMembers);
router.get('/projects/:projectId/columns', authMiddleware, getProjectColumns);
router.post('/projects/:projectId/columns', authMiddleware, createColumn);
router.patch('/projects/:projectId/columns/:columnId', authMiddleware, updateColumn);
router.delete('/projects/:projectId/columns/:columnId', authMiddleware, deleteColumn);
router.delete('/projects/:projectId/members/:userId', authMiddleware, removeProjectMember);

export default router;
