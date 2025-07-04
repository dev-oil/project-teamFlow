// src/services/invitation.service.ts
import { prisma } from '../db/prisma';
import crypto from 'crypto';
import { sendInvitationEmail } from './email.service';

/** 초대 */
export const createInvitation = async (
  fromName: string,
  fromEmail: string,
  toEmail: string,
  workspaceId: number,
  senderUserId: number
) => {
  // 1. senderUserId가 해당 workspace에 소속되어 있는지 검증 (IDOR 방지)
  const isMember = await prisma.members.findFirst({
    where: {
      users_id: senderUserId,
      workspaces_id: workspaceId,
    },
  });

  if (!isMember) {
    throw new Error('해당 워크스페이스에 대한 권한이 없습니다.');
  }

  // 2. 초대할 유저 존재 확인
  const user = await prisma.users.findUnique({ where: { email: toEmail } });
  if (!user) throw new Error('존재하지 않는 유저입니다.');

  // 3. 해당 워크스페이스에 이미 초대된 이메일인지 확인
  const existingInvitation = await prisma.invitations.findFirst({
    where: {
      email: toEmail,
      workspaces_id: workspaceId,
    },
  });
  if (existingInvitation) {
    throw new Error('이미 초대된 이메일입니다.');
  }

  // 4. 초대 토큰 생성 및 저장
  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3일 후

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

  // 5. 이메일 발송
  await sendInvitationEmail({ fromName, fromEmail, toEmail, token });

  return { token, expires_at };
};

/** 초대 토큰 유효성 검사 */
export const acceptInvitationService = async (token: string) => {
  const invitation = await prisma.invitations.findUnique({  where: {
      token,
      used: 0, // 안전하게 unused 조건까지 포함
      expires_at: { gt: new Date() }, // 만료 안 됐는지도 포함
    },
  });

   if (!invitation) {
    throw new Error('유효하지 않거나 이미 사용된 초대입니다.');
  }

  const user = await prisma.users.findUnique({
    where: { email: invitation.email },
  });

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
