//card.service.ts
import { prisma } from '../db/prisma';

/** 카드 리스트 가져오기 (캘린더)  */
export const findCards = async (userId: number, workspaceId: number) => {
  const cards = await prisma.cards.findMany({
    where: {
      boxes: {
        workspaces: {
          id: workspaceId,
          members: {
            some: {
              users_id: userId,
            },
          },
        },
      },
    },
    include: {
      boxes: {
        select: {
          id: true,
          title: true, // category로 쓰임
          workspaces_id: true,
        },
      },
    },
  });

  return cards.map((card) => ({
    id: card.id,
    title: card.title,
    start: new Date(card.start_date),
    end: new Date(card.end_date),
    color: card.color,
    category: card.boxes.title,
    boxId: card.boxes.id,
  }));
};

/** 카드 가져오기 */
export const findCardById = async (userId: number, cardId: string) => {
  const card = await prisma.cards.findFirst({
    where: {
      id: cardId,
      boxes: {
        workspaces: {
          members: {
            some: { users_id: userId },
          },
        },
      },
    },
    include: {
      boxes: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!card) return null;

  return {
    id: card.id,
    title: card.title,
    start: card.start_date,
    end: card.end_date,
    description: card.description,
    color: card.color,
    boxId: card.boxes.id,
    category: card.boxes.title,
  };
};

/** 카드 수정 */
export const updateCardDate = async (
  cardId: string,
  start: string,
  end: string
) => {
  return prisma.cards.update({
    where: { id: cardId },
    data: {
      start_date: new Date(start),
      end_date: new Date(end),
    },
  });
};
