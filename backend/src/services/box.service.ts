//box.service.ts
import { prisma } from '../db/prisma';

/** 박스 리스트 가져오기 (캘린더 - 카테고리) */
export const findBoxes = (userId: number, workspaceId: number) => {
  return prisma.boxes.findMany({
    where: {
      workspaces_id: workspaceId,
      workspaces: {
        members: {
          some: {
            users_id: userId, // 이 워크스페이스에 속한 유저인지 확인
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
    },
  });
};

/** 박스 가져오기 */
export const findBoxById = async (boxId: string) => {
  return prisma.boxes.findUnique({ where: { id: boxId } });
};

export const updateBox = async (
  boxId: string,
  title: string,
  userId: number
) => {
  try {
    const updatedBox = await prisma.boxes.update({
      where: {
        id: boxId,
        workspaces: {
          members: {
            some: {
              users_id: userId, // 이 워크스페이스에 속한 유저인지 확인
            },
          },
        },
      },
      data: { title },
      select: { title: true },
    });
    return updatedBox;
  } catch (err) {
    throw new Error('업데이트 실패');
  }
};

export const deleteBoxById = async (boxId: string, userId: number) => {
  try {
    await prisma.boxes.delete({
      where: {
        id: boxId,
        workspaces: {
          members: {
            some: {
              users_id: userId, // 이 워크스페이스에 속한 유저인지 확인
            },
          },
        },
      },
    });
  } catch (err) {
    throw new Error('삭제 실패');
  }
};
