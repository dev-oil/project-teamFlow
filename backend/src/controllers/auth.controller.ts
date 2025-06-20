import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    await registerUser(email, password);
    return res
      .status(201)
      .json({ message: '회원가입 성공. 이메일을 확인해주세요.' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
