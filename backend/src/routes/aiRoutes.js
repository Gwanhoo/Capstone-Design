import { Router } from 'express';
import { decomposeProjectTasks } from '../controllers/aiController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/ai/decompose', authMiddleware, decomposeProjectTasks);

export default router;
