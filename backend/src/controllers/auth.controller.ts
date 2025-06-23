import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';
import { redisClient } from '../utils/redis';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await registerUser(email, password);
    res.status(201).json({ message: '회원가입 성공. 이메일을 확인해주세요.' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ message: '유효하지 않은 요청입니다.' });
  }

  const email = await redisClient.get(`email:verify:${token}`);
  if (!email) {
  }
};
