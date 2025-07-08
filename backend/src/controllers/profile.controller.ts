//backend/profile.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** 프로필 조회 */
export const getProfile = async (req: Request, res: Response) => {
  
  try {
    const userId = req.user?.userId;
    console.log(userId);
    if (!userId) {
      res.status(403).json({ message: '인증되지 않은 요청입니다.' });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
        is_verified: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(user);
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

/** 프로필 수정 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(403).json({ message: '인증되지 않은 요청입니다.' });
      return;
    }

    const { name, email, phone } = req.body;

    // 이메일 중복 확인 (자신의 이메일 제외)
    if (email) {
      const existingUser = await prisma.users.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });
      if (existingUser) {
        res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
        return;
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
        is_verified: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

/** 비밀번호 변경 */   
//(비밀번호 재설정  resetPassword 이메일 발송 forgotPassword)
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({ message: '인증되지 않은 요청입니다.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // 현재 사용자 정보 조회
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      res.status(400).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updated_at: new Date(),
      },
    });

    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

/** 계정 삭제 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(403).json({ message: '인증되지 않은 요청입니다.' });
      return;
    }

    // 사용자와 관련된 모든 데이터 삭제 (CASCADE 설정에 따라 자동 삭제)
    await prisma.users.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: '계정이 성공적으로 삭제되었습니다.' });
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};
