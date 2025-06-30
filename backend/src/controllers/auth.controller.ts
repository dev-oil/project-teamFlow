import { Request, Response } from 'express';
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  sendReset,
  updatePassword,
  verifyUserEmail,
} from '../services/auth.service';
import { title } from 'process';

/** 회원가입 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password } = req.body;
    await registerUser(name, phone, email, password);
    res.status(201).json({
      title: '회원가입 성공',
      description: '이메일을 확인해주세요.',
    });
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(400).json({ title: err.name, description: err.message });
  }
};

/** 이메일 인증 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ message: '유효하지 않은 요청입니다.' });
    return;
  }

  try {
    const message = await verifyUserEmail(token);
    res.status(200).json({ message });
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(400).json({ title: err.name, description: err.message });
  }
};

/** 로그인 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const { refreshToken, ...result } = await loginUser(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 클라이언트와 백엔드가 서로 다른 origin이라면 'none' + secure: true 조합
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1000(1초)
    });
    res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(401).json({ title: err.name, description: err.message });
  }
};

/** token 재발급 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const prevToken = req.signedCookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await refreshAccessToken(
      prevToken
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1000(1초)
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err: unknown) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1000(1초)
    });
    if (err instanceof Error) res.status(401).json({ message: err.message });
  }
};

/** 로그아웃 */
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1000(1초)
  });

  res.status(200).json({ message: '로그아웃 완료' });
};

/** 비밀번호 재설정 이메일 발송 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await sendReset(email);

    res.status(200).json({
      title: '재설정 메일 발송 완료',
      description: '이메일을 확인해주세요',
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ title: err.name, description: err.message });
    }
  }
};

/** 비밀번호 재설정 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await updatePassword(token, newPassword);

    res.status(200).json({
      message: '비밀번호가 재설정되었습니다. 이제 새 비밀번호로 로그인하세요.',
    });
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(400).json({ title: err.name, description: err.message });
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
