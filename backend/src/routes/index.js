import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';
import taskRoutes from './taskRoutes.js';

const router = Router();

router.get('/health', healthCheck);
router.use(taskRoutes);

export default router;
