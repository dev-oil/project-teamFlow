import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';

/** AccessToken 검증 미들웨어 */
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access Token이 없습니다' });
    return;
  }

  // Bearer 때고 jwt 가져오기
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    req.user = { userId: decoded.userId };
    next();
  } catch (err: unknown) {
    if (err instanceof Error)
      res.status(401).json({ message: 'Access Token이 유효하지 않습니다.' });
  }
};
