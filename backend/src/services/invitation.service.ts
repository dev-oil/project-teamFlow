// src/services/invitation.service.ts
import { prisma } from '../db/prisma';
import crypto from 'crypto';
import { sendInvitationEmail } from './email.service'; 


/** 초대 */
export const createInvitation = async (
  fromName: string,
  fromEmail: string,
  toEmail: string,
  workspaceId: number
) => {
  const user = await prisma.users.findUnique({ where: { email: toEmail } });
  if (!user) throw new Error('존재하지 않는 유저입니다.');

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일

  await prisma.invitations.create({
    data: {
      email: toEmail,
      token,
      expires_at,
      used: 0,
      users: { connect: { id: user.id } },
      workspaces: { connect: { id: workspaceId } },
    },
  });

  await sendInvitationEmail({ fromName, fromEmail, toEmail, token });
  return { token, expires_at };
};

/** 초대 토큰 유효성 검사 */
export const acceptInvitationService = async (token: string) => {
  const invitation = await prisma.invitations.findUnique({ where: { token } });

  if (!invitation || invitation.used) {
    throw new Error('유효하지 않거나 이미 사용된 초대입니다.');
  }

  const user = await prisma.users.findUnique({ where: { email: invitation.email } });
  if (!user) {
    throw new Error('초대된 이메일이 가입되어 있지 않습니다.');
  }

  const isAlreadyMember = await prisma.members.findFirst({
    where: {
      users_id: user.id,
      workspaces_id: invitation.workspaces_id,
    },
  });

  if (isAlreadyMember) {
    throw new Error('이미 이 워크스페이스의 멤버입니다.');
  }

  await prisma.$transaction([
    prisma.members.create({
      data: {
        users_id: user.id,
        workspaces_id: invitation.workspaces_id,
        role: 'guest',
      },
    }),
    prisma.invitations.update({
      where: { token },
      data: { used: 1 },
    }),
  ]);

  return { success: true, message: '초대 수락 완료' };
};

/** 대기중 초대 조회 */
export const findPendingInvitations = async (workspaceId: number) => {
  return prisma.invitations.findMany({
    where: {
      workspaces_id: workspaceId,
      used: 0,
    },
    orderBy: { created_at: 'desc' },
  });
};

/** 초대 삭제 */
export const deleteInvitation = (token: string) => {
  return prisma.invitations.delete({ where: { token } });
};

/** 다시 초대 */
export const renewInvitation = async (
  email: string,
  workspaceId: number,
  fromEmail: string,
  fromName: string
) => {
  const existing = await prisma.invitations.findFirst({
    where: { email, workspaces_id: workspaceId },
  });

  if (!existing) throw new Error('초대 기록이 없습니다.');

  const newExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  await prisma.invitations.update({
    where: { id: existing.id },
    data: { expires_at: newExpiry },
  });

   await sendInvitationEmail({
    fromName,
    fromEmail,
    toEmail: email,
    token: existing.token,
  });

  return { expires_at: newExpiry };
};