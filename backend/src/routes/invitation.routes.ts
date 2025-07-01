import { Router } from 'express';
import {
  createInvitation,
  verifyInvitationToken,
  getPendingInvitations,
  deleteInvitation,
  reInvitation,
  acceptInvitation
} from '../controllers/invitation.controller';

const router = Router();

router.post('/create', createInvitation); // 초대 생성
router.get('/verify', verifyInvitationToken);   // 초대 토큰 유효성 검사
router.post('/accept', acceptInvitation); // 초대 수락
router.post('/resend', reInvitation); //다시초대
router.get('/:workspaceId/pending', getPendingInvitations); //초대
router.delete('/:token', deleteInvitation); //초대 삭제

export default router;
