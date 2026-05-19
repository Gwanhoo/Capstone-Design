import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getProjectMessages, postProjectMessage } from '../controllers/chatController.js';

const router = Router();

router.get('/projects/:projectId/messages', authMiddleware, getProjectMessages);
router.post('/projects/:projectId/messages', authMiddleware, postProjectMessage);

export default router;
