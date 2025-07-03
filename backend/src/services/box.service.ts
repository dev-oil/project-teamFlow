//box.service.ts
import { prisma } from '../db/prisma'; 

/** 박스 리스트 가져오기 (캘린더 - 카테고리) */  
export const findBoxes = (
  userId: number,
  workspaceId: number
) => {
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
export const findBoxById = async (boxId :number) => {
  return prisma.boxes.findUnique({where: { id: boxId }});
}