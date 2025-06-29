import { Router } from 'express';
import { createInvitation, getPendingInvitations, deleteInvitation, reInvitation } from '../controllers/invitation.controller';


const router = Router();

router.post('/', createInvitation);  // 초대 생성
router.post('/resend', reInvitation); //다시초대 
router.get('/:workspaceId/pending', getPendingInvitations); //초대
router.delete('/:token', deleteInvitation); //초대 삭제


export default router;