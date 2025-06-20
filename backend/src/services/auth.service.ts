import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db/prisma'; // 혹은 TypeORM/Sequelize
import { redisClient } from '../utils/redis';
import { sendVerificationEmail } from './email.service';

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('이미 가입된 이메일입니다.');

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, is_erified: false },
  });

  const token = uuidv4();
  await redisClient.setEx(`email:verify:${token}`, 600, email);

  await sendVerificationEmail(email, token);
};
