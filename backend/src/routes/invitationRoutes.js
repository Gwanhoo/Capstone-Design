import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { acceptInvitation, createInvitation, declineInvitation, getMyInvitations } from '../controllers/invitationController.js';

const router = Router();

router.post('/projects/:projectId/invitations', authMiddleware, createInvitation);
router.get('/invitations/me', authMiddleware, getMyInvitations);
router.post('/invitations/:invitationId/accept', authMiddleware, acceptInvitation);
router.post('/invitations/:invitationId/decline', authMiddleware, declineInvitation);

export default router;
