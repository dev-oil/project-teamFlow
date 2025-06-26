import { Router } from 'express';
import { createInvitation, getPendingInvitations, deleteInvitation, reInvitation,  } from '../controllers/invitationController';

const router = Router();

router.post('/', createInvitation);
router.get('/:workspaceId/pending', getPendingInvitations);
router.delete('/:token', deleteInvitation);
router.post('/resend', reInvitation); 

export default router;