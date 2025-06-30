import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db/prisma';
import { redisClient } from '../utils/redis';
import { sendResetEmail, sendVerificationEmail } from './email.service';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { JwtPayload } from '../types/jwt';

/**
 * 회원가입
 * @param name 이름
 * @param phone 전화번호
 * @param email 이메일
 * @param password 비밀번호
 */
export const registerUser = async (
  name: string,
  phone: string,
  email: string,
  password: string
) => {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) throw new Error('이미 가입된 이메일입니다.');

  const hashed = await bcrypt.hash(password, 10);
  await prisma.users.create({
    data: { name, phone, email, password: hashed },
  });

  const token = uuidv4();
  await redisClient.setEx(`email:verify:${token}`, 60 * 10, email);

  await sendVerificationEmail(email, token);
};

/**
 * 회원 이메일 인증
 * @param token 이메일 인증 토큰
 */
export const verifyUserEmail = async (token: string): Promise<string> => {
  const email = await redisClient.get(`email:verify:${token}`);
  if (!email) throw new Error('토큰이 만료되었거나 유효하지 않습니다.');

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');

  if (user.is_verified) return '이미 인증된 사용자입니다.';

  await prisma.users.update({
    where: { email },
    data: { is_verified: 1 },
  });

  await redisClient.del(`email:verify:${token}`);
  return '이메일 인증이 완료되었습니다.';
};

/**
 * RefreshToken 저장
 * @param userId 유저 Id
 * @param token RefreshToken
 */
export const storeRefreshToken = async (userId: number, token: string) => {
  // 60초(1분) * 60 * 24 * 7
  await redisClient.setEx(`user:refresh:${userId}`, 60 * 60 * 24 * 7, token);
};

/**
 * 로그인
 * @param email 이메일
 * @param password 비밀번호
 * @returns
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('존재하지 않는 사용자입니다');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('비밀번호가 일치하지 않습니다');

  if (!user.is_verified) throw new Error('이메일 인증이 필요합니다');

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await storeRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};

/**
 * Refresh Token 재발급
 * @param refreshToken
 * @returns
 */
export const refreshAccessToken = async (refreshToken: string | undefined) => {
  if (!refreshToken) throw new Error('Refresh Token 없음');

  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  ) as JwtPayload;

  const storedToken = await redisClient.get(`user:refresh:${decoded.userId}`);
  if (!storedToken || storedToken !== refreshToken)
    throw new Error('Refresh Token 무효');

  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);
  storeRefreshToken(decoded.userId, newRefreshToken);

  return { newAccessToken, newRefreshToken };
};

/**
 * 비밀번호 재설정 이메일 발송
 * @param email
 */
export const sendReset = async (email: string | undefined) => {
  if (!email) throw new Error('Email 없음');

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('TeamFlow에 존재하지 않는 이메일입니다');

  const token = uuidv4();

  await redisClient.setEx(`password:reset:${token}`, 60 * 5, email);

  await sendResetEmail(email, token);
};

export const updatePassword = async (token: string, newPassword: string) => {
  const email = await redisClient.get(`password:reset:${token}`);
  if (!email) throw new Error('유효하지 않거나 만료된 토큰입니다');

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error('TeamFlow에서 사용자를 찾을 수 없습니다');

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { email },
    data: { password: hashed },
  });

  await redisClient.del(`password:reset:${token}`);
};
