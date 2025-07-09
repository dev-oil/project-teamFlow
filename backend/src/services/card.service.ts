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
    end: new Date(card.end_date),//string
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

/** 카드 생성 */
// export const createCard = async (data: {
//   boxes_id: string;
//   title: string;
//   color?: string;
//   description?: string;
//   start: string;
//   end: string;
//   assignee?: any;
//   file?: any;
// }) => {
//   const startDate = new Date(data.start);
//   const endDate = new Date(data.end);

//   console.log('시작', startDate);
//   console.log('종료', endDate);

//   // react-big-calendar 기준: end는 exclusive
//   // → 같은 날짜면 end를 하루 뒤로 보정
//   if (startDate.toDateString() === endDate.toDateString()) {
//     endDate.setDate(endDate.getDate() + 1);
//     console.log('보정 후', endDate);
//   }

//   return prisma.cards.create({
//     data: {
//       boxes_id: data.boxes_id,
//       title: data.title,
//       color: data.color,
//       description: data.description,
//       start_date: startDate,
//       end_date: endDate,
//       assignee: data.assignee,
//       file: data.file,
//     },
//   });
// };

/** 카드 수정 */
export const updateCardDate = async (
  cardId: string,
  start: string, // "YYYY-MM-DD" 형태 문자열
  end: string // "YYYY-MM-DD" 형태 문자열
) => {
  return prisma.cards.update({
    where: { id: cardId },
    data: {
      start_date: start,
      end_date: end,
    },
  });
};
