import { Router } from 'express';
import * as inviteController from '../controllers/invitation.controller';

import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = Router();
router.get('/verify', inviteController.verifyInvitationToken);   // 초대 토큰 유효성 검사
router.post('/accept', inviteController.acceptInvitation); // 초대 수락

router.use(verifyAccessToken); // verifyAccessToken 공통 적용

router.post('/create', inviteController.createInvitation); // 초대 생성
router.post('/resend', inviteController.reInvitation); //다시초대
router.get('/:workspaceId/pending', inviteController.getPendingInvitations); //초대
router.delete('/:token', inviteController.deleteInvitation); //초대 삭제

export default router;
