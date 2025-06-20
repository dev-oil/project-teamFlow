import { Request, Response } from 'express';
import crypto from 'crypto';
// DB 연결 및 nodemailer 등 import

export const createInvitation = async (req: Request, res: Response) => {
  const { email, workspaceId } = req.body;
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후

  // TODO: DB 저장 로직 

  // TODO: 이메일 발송 로직

  res.json({
    success: true,
    token,
    expiresAt,
  });
};