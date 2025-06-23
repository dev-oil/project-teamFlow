import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db/prisma'; // 혹은 TypeORM/Sequelize
import { redisClient } from '../utils/redis';
import { sendVerificationEmail } from './email.service';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

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
    data: { name, phone, email, password: hashed, is_verified: false },
  });

  const token = uuidv4();
  await redisClient.setEx(`email:verify:${token}`, 60 * 10, email);

  await sendVerificationEmail(email, token);
};

export const storeRefreshToken = async (userId: number, token: string) => {
  // 60초(1분) * 60 * 24 * 7
  await redisClient.setEx(`user:refresh:${userId}`, 60 * 60 * 24 * 7, token);
};

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
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};
