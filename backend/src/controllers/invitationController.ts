// backend/src/controllers/invitationController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

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
  
    return; 
  
  } catch (error) {
    console.error('대기중 초대 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
    
    return; 
  }
};

export const createInvitation = async (req: Request, res: Response) => {
  const { email, workspaceId } = req.body;
  if (!email || !workspaceId) {
    res
      .status(400)
      .json({ error: '이메일과 워크스페이스 ID가 필요합니다.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후
  // TODO: 이메일 발송 로직

  //DB 저장
  try {
    await prisma.invitations.create({
      data: {
        email,
        token,
        expires_at,
        used: 0,
        workspaces: {
          connect: { id: workspaceId },
        },
      },
    });

    res.json({
      success: true,
      token,
      expires_at,
    });
    return;

  } catch (error) {
    console.error('초대 저장 실패:', error);
    res.status(500).json({ error: '서버 오류: 초대를 저장하지 못했습니다.' });
    return;
  }
};
