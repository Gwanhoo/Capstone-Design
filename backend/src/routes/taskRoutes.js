import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasksByProject,
  moveTask,
  updateTask,
} from '../controllers/taskController.js';

const router = Router();

router.get('/projects/:projectId/tasks', getTasksByProject);
router.post('/projects/:projectId/tasks', createTask);
router.patch('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);
router.patch('/tasks/:taskId/move', moveTask);

export default router;
