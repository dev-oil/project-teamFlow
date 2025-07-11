import { prisma } from '../db/prisma';

/** 보드 데이터 가져오기 */
export const findBoardWidthCard = async (
  userId: number,
  workspaceId: number
) => {
  return prisma.boxes.findMany({
    where: {
      workspaces_id: workspaceId,
      workspaces: {
        members: {
          some: {
            users_id: userId,
          },
        },
      },
    },
    orderBy: { order: 'asc' },
    include: {
      cards: {
        orderBy: {
          order: 'asc', // or 'desc'
        },
      },
    },
  });
};

/** 박스 생성 */
export const createBox = async (
  userId: number,
  workspaceId: number,
  title: string
) => {
  const workspace = await prisma.workspaces.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: {
          users_id: userId,
        },
      },
    },
    select: { id: true },
  });

  if (!workspace) {
    throw new Error('잘못된 접근입니다.');
  }

  const order =
    (await prisma.boxes.count({
      where: { workspaces_id: workspaceId },
    })) + 1;

  const newBox = await prisma.boxes.create({
    data: {
      title,
      order,
      workspaces_id: workspaceId,
    },
    include: {
      cards: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return newBox;
};

// 카드 생성
export const postCard = async (
  userId: number,
  workspaceId: number,
  boxId: string,
  data: {
    title: string;
    description?: string;
    color?: string;
    start_date?: string;
    end_date?: string;
    assignee?: { id: string; name: string; profile_image: string }[];
  }
) => {
  const cardCount =
    (await prisma.cards.count({
      where: { boxes_id: boxId },
    })) + 1;

  return prisma.cards.create({
    data: {
      boxes_id: boxId,
      title: data.title,
      description: data.description,
      color: data.color,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      assignee: data.assignee,
      order: cardCount,
      file: [],
    },
  });
};

export const uploadFilePath = async (
  files: Express.Multer.File[],
  workspaceId: number,
  cardId: string,
  userId: number
) => {
  const filePaths = files.map((f) => {
    const file = {
      path: f.path,
      filename: f.filename,
      originalName: f.originalname,
    };
    return file;
  });

  await prisma.cards.updateMany({
    where: {
      id: cardId,
      boxes: {
        workspaces: {
          id: workspaceId,
          members: {
            some: { users_id: userId },
          },
        },
      },
    },
    data: {
      file: { push: filePaths },
    },
  });
};

// 카드 수정 -> 날짜 수정 가능 / 통째로 저장버튼 클릭시
// 	=> dnd order변경은 실시간(redis) 중간저장 텀을두고 db 저장 // 주요
// 카드 삭제

// 옵션) 박스 삭제 / 수정
