import { Router } from 'express';
import { createInvitation } from '../controllers/invitationController';

const router = Router();

router.post('/invitations', createInvitation);

export default router;