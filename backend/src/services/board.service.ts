import fs from 'fs';

import path from 'path';
import { prisma } from '../db/prisma';
import { redisClient } from '../utils/redis';

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
      title: '새 박스',
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
      start_date: new Date(data.start_date!),
      end_date: new Date(data.end_date!),
      assignee: data.assignee,
      order: cardCount,
      file: [],
    },
  });
};

// 카드 수정
export const updateCard = async (
  userId: number,
  workspaceId: number,
  cardId: string,
  data: {
    title?: string;
    description?: string;
    color?: string;
    start_date?: string;
    end_date?: string;
    assignee?: { id: string; name: string; profile_image: string }[];
  }
) => {
  const card = await prisma.cards.findFirst({
    where: {
      id: cardId,
      boxes: {
        workspaces_id: workspaceId,
        workspaces: { members: { some: { users_id: userId } } },
      },
    },
    select: { id: true },
  });
  if (!card) throw new Error('권한이 없거나 카드가 존재하지 않습니다.');

  return prisma.cards.update({
    where: { id: cardId },
    data: {
      ...data,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      assignee: data.assignee,
    },
  });
};

// 카드 삭제
export const deleteCard = async (
  userId: number,
  workspaceId: number,
  cardId: string
) => {
  const card = await prisma.cards.findFirst({
    where: {
      id: cardId,
      boxes: {
        workspaces_id: workspaceId,
        workspaces: { members: { some: { users_id: userId } } },
      },
    },
    select: { id: true },
  });
  if (!card) throw new Error('권한이 없거나 카드가 존재하지 않습니다.');

  await prisma.cards.delete({ where: { id: cardId } });
};

export const uploadFilePath = async (
  newFiles: Express.Multer.File[],
  currentFiles: {
    filename: string;
    originalName: string;
  }[],
  cardId: string,
  userId: number
) => {
  const totalFilesCount = currentFiles.length + newFiles.length;

  if (totalFilesCount > 5) {
    // 업로드 취소
    // multer가 이미 파일을 저장했다면 삭제 필요
    newFiles.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('파일 삭제 실패:', file.path, err);
      });
    });

    throw new Error(
      `총 첨부파일은 최대 5개까지 허용됩니다. 현재: ${totalFilesCount}개`
    );
  }

  // ✅ IDOR 방지: 워크스페이스 멤버 검사
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
  });

  if (!card) {
    throw new Error('권한 없음 또는 카드가 존재하지 않음');
  }

  // 기존 DB files
  const existingFiles =
    (card.file as {
      filename: string;
      originalName: string;
      path: string;
      size: number;
      type: string;
    }[]) ?? [];

  // 🗑️ 삭제할 파일 계산
  const filesToDelete = existingFiles.filter(
    (existing) =>
      !currentFiles.some((current) => current.filename === existing.filename)
  );

  // 🗑️ 서버에서 실제 파일 삭제
  for (const file of filesToDelete) {
    fs.unlink(path.join(__dirname, '..', file.path), (err) => {
      if (err) console.error('파일 삭제 실패:', err);
    });
  }

  // 📥 새 파일 메타데이터 추가
  const newFileData = newFiles.map((file) => ({
    name: file.originalname,
    path: `/uploads/attachments/${file.filename}`,
    size: file.size,
    type: file.mimetype,
  }));

  const updatedFiles = [
    ...existingFiles.filter((existing) =>
      currentFiles.some((current) => current.filename === existing.filename)
    ), // 기존 유지할 파일
    ...newFileData, // 새로 추가된 파일
  ];

  // DB 업데이트
  await prisma.cards.update({
    where: { id: cardId },
    data: { file: updatedFiles },
  });
};
// 작업보드 순서
type OrderItem = {
  id: string;
  order: number;
};

export const updateCardAndBoxOrder = async (
  workspaceId: number,
  cards?: OrderItem[],
  boxes?: OrderItem[]
) => {
  const pipeline = redisClient.multi();

  if (cards) {
    for (const { id, order } of cards) {
      pipeline.hSet(`card_orders:${workspaceId}`, id, order.toString());
    }
  }

  if (boxes) {
    for (const { id, order } of boxes) {
      pipeline.hSet(`box_orders:${workspaceId}`, id, order.toString());
    }
  }

  await pipeline.exec();
};
