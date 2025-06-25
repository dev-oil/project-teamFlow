// backend/src/controllers/invitationController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendInvitationEmail } from '../utils/mailer';

const prisma = new PrismaClient();

// 대기중 초대 조회
export const getPendingInvitations = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);

  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 워크스페이스 ID가 필요합니다.' });
    return;
  }

  try {
    const pending = await prisma.invitations.findMany({
      where: {
        workspaces_id: workspaceId,
        used: 0,
      },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json({ pending });
  } catch (error) {
    console.error('대기중 초대 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};

// 초대 생성
export const createInvitation = async (req: Request, res: Response) => {
  const { fromName , fromEmail, toEmail, workspaceId } = req.body;
 
    if (!fromName || !fromEmail || !toEmail || !workspaceId) {
      res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
    return ;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후
  //DB 저장
  try {
    await prisma.invitations.create({
      data: {
        email: toEmail,
        token,
        expires_at,
        used: 0,
        workspaces: {
          connect: { id: workspaceId },
        },
      },
    });

    //이메일 발송
    await sendInvitationEmail(fromName, fromEmail, toEmail, token);

    res.json({
      success: true,
      token,
      expires_at,
    });

  } catch (error) {
    console.error('초대 저장 또는 이메일 전송 실패:', error);
    res.status(500).json({ error: '서버 오류' });

  }
};

// 초대 삭제
export const deleteInvitation = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    await prisma.invitations.delete({
      where: { token },
    });
    res.json({ success: true });

  } catch (error) {
    console.error('초대 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};  

//다시 초대
export const reInvitation = async (req:Request, res : Response) => {
    const { email, workspaceId, fromEmail, fromName } = req.body;
  try {
    const existing = await prisma.invitations.findFirst({
      where: { email, workspaces_id: workspaceId },
    });

    if (!existing) {
      return res.status(404).json({ error: '초대 기록이 없습니다.' });
    }

    // 토큰은 유지하고 expires_at만 갱신
    const newExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);  //3일

   const updated = await prisma.invitations.update({
      where: { id: existing.id },
      data: { expires_at: newExpiry },
    });

    // 이메일 다시 전송
    await sendInvitationEmail(fromName, fromEmail, email, existing.token);

    res.json({ success: true, expires_at: newExpiry });
  } catch (error) {
    console.error('다시 초대 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};
