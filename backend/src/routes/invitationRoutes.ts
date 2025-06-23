import { Router } from 'express';
import { createInvitation, getPendingInvitations } from '../controllers/invitationController';

const router = Router();

router.post('/', createInvitation);
router.get('/:workspaceId/pending', getPendingInvitations);

export default router;