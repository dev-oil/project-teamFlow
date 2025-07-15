// controllers/invitation.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as invitationService from '../services/invitation.service';

const prisma = new PrismaClient();

/** 초대 */
export const createInvitation = async (req: Request, res: Response) => {
  const { fromName, fromEmail, toEmail, workspaceId } = req.body;
  const userId = req.user!.userId;

  if (!fromName || !fromEmail || !toEmail || !workspaceId) {
    res.status(400).json({ message: '필수 항목이 누락되었습니다.' });
    return;
  }

  try {
    const { token, expires_at } = await invitationService.createInvitation(
      fromName,
      fromEmail,
      toEmail,
      workspaceId,
      userId
    );
    res.json({ success: true, token, expires_at });
    return;
  } catch (error: unknown) {
    console.error('초대 생성 실패:', error);

    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : '서버 오류';

    res.status(400).json({ message }); // 프론트에서 받기 쉬운 키 이름
    return;
  }
};

/** 초대 토큰 유효성 검사*/
export const verifyInvitationToken = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: '토큰이 필요합니다.' });
    return;
  }

  try {
    const invite = await prisma.invitations.findUnique({ where: { token } });

    if (
      !invite ||
      invite.used === 1 ||
      new Date(invite.expires_at) < new Date()
    ) {
      res.status(400).json({ error: '유효하지 않거나 만료된 토큰입니다.' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('초대 토큰 검증 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};

/** 초대 수락 */
export const acceptInvitation = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: '초대 토큰이 필요합니다.' });
  }

  try {
    const result = await invitationService.acceptInvitationService(token);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || '초대 수락 실패' });
  }
};

/** 대기중 초대 조회 */
export const getPendingInvitations = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 워크스페이스 ID가 필요합니다.' });
    return;
  }

  try {
    const pending = await invitationService.findPendingInvitations(workspaceId);
    res.status(200).json({ pending });
  } catch (error) {
    console.error('대기중 초대 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};

/** 초대 삭제 */
export const deleteInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    res.status(400).json({ error: '토큰이 누락되었습니다.' });
    return;
  }

  try {
    await invitationService.deleteInvitation(token);
    res.json({ success: true });
  } catch (error) {
    console.error('초대 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

/** 다시 초대 */
export const reInvitation = async (req: Request, res: Response) => {
  const { email, workspaceId, fromEmail, fromName } = req.body;

  try {
    const { expires_at } = await invitationService.renewInvitation(
      email,
      workspaceId,
      fromEmail,
      fromName
    );
    res.json({ success: true, expires_at });
  } catch (error: unknown) {
    console.error('다시 초대 실패:', error);
    if (error instanceof Error)
      res.status(500).json({ error: error.message || '서버 오류' });
  }
};
