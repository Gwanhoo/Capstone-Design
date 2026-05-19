import { Router } from 'express';
import {
  createProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  removeProjectMember,
} from '../controllers/projectController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/projects', authMiddleware, getProjects);
router.get('/projects/:projectId', authMiddleware, getProjectById);
router.post('/projects', authMiddleware, createProject);
router.get('/projects/:projectId/members', authMiddleware, getProjectMembers);
router.delete('/projects/:projectId/members/:userId', authMiddleware, removeProjectMember);

export default router;
