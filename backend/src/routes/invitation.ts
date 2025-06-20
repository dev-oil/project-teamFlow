import { Router } from 'express';
import { createInvitation } from '../controllers/invitationController';

const router = Router();

router.post('/api/invitations', createInvitation);

export default router;