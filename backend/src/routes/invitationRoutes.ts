import { Router } from 'express';
import { createInvitation, getPendingInvitations, deleteInvitation } from '../controllers/invitationController';

const router = Router();

router.post('/', createInvitation);
router.get('/:workspaceId/pending', getPendingInvitations);
router.delete('/:token', deleteInvitation);

export default router;