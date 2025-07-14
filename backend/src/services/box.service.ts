//box.service.ts
import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma';
import { Attachments } from '../types/board';

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
    const cards = await prisma.cards.findMany({ where: { boxes_id: boxId } });
    for (const card of cards) {
      if (!card.file) continue;
      const attachments = card.file as Attachments;
      attachments.forEach((f) => {
        const filePath = path.resolve('uploads/attachments', f.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`파일 삭제 실패: ${filePath}`, err);
        });
      });
    }
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
