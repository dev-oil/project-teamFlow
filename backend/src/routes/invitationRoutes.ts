import { Router } from 'express';
import { createInvitation } from '../controllers/invitationController';

const router = Router();

router.post('/', createInvitation);

export default router;