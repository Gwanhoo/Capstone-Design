import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasksByProject,
  moveTask,
  updateTask,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/projects/:projectId/tasks', authMiddleware, getTasksByProject);
router.post('/projects/:projectId/tasks', authMiddleware, createTask);
router.patch('/tasks/:taskId', authMiddleware, updateTask);
router.delete('/tasks/:taskId', authMiddleware, deleteTask);
router.patch('/tasks/:taskId/move', authMiddleware, moveTask);

export default router;
