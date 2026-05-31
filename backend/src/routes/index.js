import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import projectRoutes from './projectRoutes.js';
import taskRoutes from './taskRoutes.js';
import authRoutes from './authRoutes.js';
import chatRoutes from './chatRoutes.js';
import invitationRoutes from './invitationRoutes.js';
import aiRoutes from './aiRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.get('/health', healthCheck);
router.use(projectRoutes);
router.use(taskRoutes);
router.use(authRoutes);
router.use(chatRoutes);
router.use(invitationRoutes);
router.use(aiRoutes);
router.use(dashboardRoutes);

export default router;
