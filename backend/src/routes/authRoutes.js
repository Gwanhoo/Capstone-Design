import { Router } from 'express';
import { getMe, login, register } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authMiddleware, getMe);

export default router;
