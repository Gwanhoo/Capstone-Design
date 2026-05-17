import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.get('/health', healthCheck);
router.use(projectRoutes);
router.use(taskRoutes);
router.use(authRoutes);

export default router;
