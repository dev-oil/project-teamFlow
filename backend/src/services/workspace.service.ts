import { prisma } from '../db/prisma';
import type { Request, Response } from 'express';

/** 멤버 조회 */
export const fetchMembersByWorkspaceId = async (workspaceId: number) => {
  const members = await prisma.members.findMany({
    where: { workspaces_id: workspaceId },
    include: { users: true },
  });

  return members.map((m) => ({
    id: m.id,
    users_id: m.users_id,
    workspaces_id: m.workspaces_id,
    role: m.role,
    user: {
      id: m.users.id,
      email: m.users.email,
      name: m.users.name,
      phone: m.users.phone,
      profile_image: m.users.profile_image,
      created_at: m.users.created_at,
      updated_at: m.users.updated_at,
    },
  }));
};

/** 멤버 추방 */
export const deleteMember = async (workspaceId: number, userId: number) => {
  return await prisma.members.deleteMany({
    where: { workspaces_id: workspaceId, users_id: userId },
  });
};

/**  워크스페이스 이름 조회 */  
export const getWorkspaceNameById = async (workspaceId: number) => {
  return await prisma.workspaces.findUnique({ where: { id: workspaceId } });
};

/**  워크스페이스 이름 변경 */   
export const renameWorkspace = async (workspaceId: number, name: string) => {
  return await prisma.workspaces.update({
    where: { id: workspaceId },
    data: { name },
  });
};

/**  워크스페이스 삭제 */
export const deleteWorkspace = async (workspaceId: number, userId: number) => {
   console.log('삭제 요청 userId:', userId); // 🔍 확인

  // 1. 워크스페이스 개수 체크
   const hostMemberships = await prisma.members.findMany({
    where: {
      users_id: userId,
      role: 'host',
    },
    select: {
      workspaces_id: true,
    },
  });

  console.log('host로 참여한 워크스페이스 목록:', hostMemberships);
  console.log('host 워크스페이스 수:', hostMemberships.length);

  if (hostMemberships.length <= 1) {
    throw new Error('워크스페이스가 1개만 남았습니다. 삭제할 수 없습니다.');
  }
  
  // 2. 권한 체크 (host 여부)
  const isHost = await prisma.members.findFirst({
    where: {
      workspaces_id: workspaceId,
      users_id: userId,
      role: 'host',
    },
  });
  if (!isHost) {
    throw new Error('호스트만 워크스페이스를 삭제할 수 있습니다.');
  }

  // 3. 삭제 (일단 cascade 사용을..)
  return await prisma.workspaces.delete({
    where: { id: workspaceId },
  });
};

/**  워크스페이스 리스트 */   
export const findUserWorkspaces = (userId: number) => {
  return prisma.workspaces.findMany({
    where: {
      members: {
        some: {
          users_id: userId,
        },
      },
    },
    include: {
      members: {
        where: {
          users_id: userId,
        },
        select: {
          role: true,
        },
      },
    },
  }).then(workspaces => 
    workspaces.map(workspace => ({
      id: workspace.id,
      users_id: workspace.users_id,
      name: workspace.name,
      role: workspace.members[0]?.role || 'guest',
    }))
  );
};

/** 워크스페이스 한개 */   
export const findUserWorkspace = (userId: number, workspaceId: number) => {
  return prisma.workspaces.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: {
          users_id: userId,
        },
      },
    },
    include: {
      members: {
        where: {
          users_id: userId,
        },
        select: {
          role: true,
        },
      },
    },
  }).then(workspace => 
    workspace ? {
      id: workspace.id,
      users_id: workspace.users_id,
      name: workspace.name,
      role: workspace.members[0]?.role || 'guest', 
    } : null
  );
};
