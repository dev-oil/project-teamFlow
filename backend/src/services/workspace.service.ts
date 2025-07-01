import { prisma } from '../db/prisma';

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
export const removeWorkspace = async (workspaceId: number) => {
  return await prisma.workspaces.delete({ where: { id: workspaceId } });
};

export const findUserWorkspaces = (userId: number) => {
  return prisma.workspaces.findMany({
    where: {
      members: {
        some: {
          users_id: userId,
        },
      },
    },
  });
};

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
  });
};
