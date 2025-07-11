//upload.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

export const uploadProfileImage = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const file = req.file;

  if (!userId || !file) {
    res.status(400).json({ message: '파일 또는 사용자 정보가 없습니다.' });
    return;
  }

  const baseUrl = process.env.BASE_URL;
  const imageUrl = `${baseUrl}/uploads/${userId}.jpg`;

  try {
    await prisma.users.update({
      where: { id: userId },
      data: { profile_image: imageUrl },
    });
    res
      .status(200)
      .json({ profile_image: `${imageUrl}?timestamp=${Date.now()}` });
  } catch (err) {
    res.status(500).json({ message: '프로필 이미지 업데이트 실패' });
  }
};
