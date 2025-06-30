import { prisma } from '../db/prisma';

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
