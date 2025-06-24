// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//DB 이메일 확인
export const checkUserEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false, error: '이메일 필요' });

    const user = await prisma.users.findUnique({ where: { email } });
    res.json({ exists: !!user });

  } catch (err) {
    console.error('checkUserEmail Error:', err);
    res.status(500).json({ exists: false, error: '서버 에러 발생' });
  }
};