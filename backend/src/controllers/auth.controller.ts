import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { redisClient } from '../utils/redis';
import { prisma } from '../db/prisma';

/** 회원가입 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;
    await registerUser(name, phone, email, password);
    res.status(201).json({ message: '회원가입 성공. 이메일을 확인해주세요.' });
    return;
  } catch (err: any) {
    res.status(400).json({ message: err.message });
    return;
  }
};

/** 이메일 인증 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ message: '유효하지 않은 요청입니다.' });
    return;
  }

  const email = await redisClient.get(`email:verify:${token}`);
  if (!email) {
    res.status(400).json({ message: '토큰이 만료되었거나 유효하지 않습니다.' });
    return;
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    return;
  }

  if (user.is_verified) {
    res.status(200).json({ message: '이미 인증된 사용자입니다.' });
    return;
  }

  await prisma.users.update({
    where: { email },
    data: { is_verified: true },
  });

  await redisClient.del(`email:verify:${token}`);

  res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
};

/** 로그인 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // 클라이언트와 백엔드가 서로 다른 origin이라면 'none' + secure: true 조합
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1000(1초)
    });

    res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof Error) res.status(401).json({ message: err.message });
  }
};

/** 컨트롤러 사용 예 
export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(403).json({ message: '인증되지 않은 요청입니다.' });
    return;
  }

  const user = await prisma.users.findUnique({ where: { id: userId } });
  res.status(200).json({ user });
};
*/
