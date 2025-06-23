import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const createInvitation = async (req: Request, res: Response) => {
  const { email, workspaceId } = req.body;
  if (!email || !workspaceId) {
    return res
      .status(400)
      .json({ error: '이메일과 워크스페이스 ID가 필요합니다.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후
  console.log(expires_at);
  // TODO: DB 저장 로직

  // TODO: 이메일 발송 로직
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
