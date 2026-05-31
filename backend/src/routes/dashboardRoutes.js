import { Router } from 'express';
import { getRecentTasks } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/dashboard/recent-tasks', authMiddleware, getRecentTasks);

export default router;
