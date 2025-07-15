import fs from 'fs';
import path from 'path';
import { prisma } from '../db/prisma';
import { redisClient } from '../utils/redis';
import { Attachments } from '../types/board';

/** 보드 데이터 가져오기 */
export const findBoardWidthCard = async (
  userId: number,
  workspaceId: number
) => {
  const boxes = await prisma.boxes.findMany({
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

  // pinned boolean 변환
  const boxesWithBooleanPinned = boxes.map((box) => ({
    ...box,
    cards: box.cards.map((card) => ({
      ...card,
      pinned: card.pinned === 1,
    })),
  }));

  return boxesWithBooleanPinned;
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
    select: { id: true, file: true },
  });
  if (!card) throw new Error('권한이 없거나 카드가 존재하지 않습니다.');

  if (card.file) {
    const attachments = card.file as Attachments;
    attachments.forEach((f) => {
      const filePath = path.resolve('uploads/attachments', f.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error(`파일 삭제 실패: ${filePath}`, err);
      });
    });
  }

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
  const existingFiles = (card.file as Attachments) ?? [];

  // 🗑️ 삭제할 파일 계산
  const filesToDelete = existingFiles.filter(
    (existing) =>
      !currentFiles.some((current) => current.filename === existing.filename)
  );

  // 🗑️ 서버에서 실제 파일 삭제
  for (const file of filesToDelete) {
    const absolutePath = path.resolve('uploads/attachments', file.filename);
    fs.unlink(absolutePath, (err) => {
      if (err) console.error('파일 삭제 실패:', err);
    });
  }

  // 📥 새 파일 메타데이터 추가
  const newFileData = newFiles.map((file) => ({
    filename: file.filename,
    originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
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

export const downloadFile = async (
  cardId: string,
  filename: string,
  userId: number
) => {
  // IDOR 방지: 카드 워크스페이스 멤버 검사
  const card = await prisma.cards.findFirst({
    where: {
      id: cardId,
      boxes: {
        workspaces: {
          members: { some: { users_id: userId } },
        },
      },
    },
  });

  if (!card) {
    throw new Error('권한 없음');
  }

  const cardFile = card.file as Attachments;
  const file = cardFile.find((f) => f.filename === filename);
  if (!file) {
    throw new Error('파일 없음');
  }

  const filePath = path.resolve('uploads/attachments', file.filename);
  return { filePath, originalName: file.originalName };
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
  // const result = await pipeline.exec();
  // console.log('redis result', result);

  // const cardresult = await redisClient.hGetAll(`card_orders:${workspaceId}`);
  // console.log('Redis에 저장된 카드 순서:', cardresult);
};

export const updateCardPin = async (cardId: string, pinned: boolean) => {
  return prisma.cards.update({
    where: { id: cardId },
    data: { pinned: pinned ? 1 : 0 },
  });
};

export const OrderFromRedisToDB = async (workspaceId: number) => {
  // const [cardOrders, boxOrders] = await Promise.all([
  //   redisClient.hGetAll(`card_orders:${workspaceId}`),
  //   redisClient.hGetAll(`box_orders:${workspaceId}`),
  // ]);

  // const cardOps = Object.entries(cardOrders).map(([id, order]) =>
  //   prisma.cards.update({
  //     where: { id },
  //     data: { order: Number(order) },
  //   })
  // );

  // const boxOps = Object.entries(boxOrders).map(([id, order]) =>
  //   prisma.boxes.update({
  //     where: { id },
  //     data: { order: Number(order) },
  //   })
  // );

  // await Promise.all([...cardOps, ...boxOps]);

  // console.log(`[SYNC] workspace ${workspaceId} 동기화 완료`);

  // Redis 데이터 읽기
  const [cardOrders, boxOrders] = await Promise.all([
    redisClient.hGetAll(`card_orders:${workspaceId}`),
    redisClient.hGetAll(`box_orders:${workspaceId}`),
  ]);

  const boxes = await prisma.boxes.findMany({
    where: { workspaces_id: workspaceId },
    select: { id: true },
  });
  const boxIds = boxes.map((b) => b.id);

  const cards = await prisma.cards.findMany({
    where: { boxes_id: { in: boxIds } },
    select: { id: true },
  });
  const existingCardIds = new Set(cards.map((c) => c.id));
  const existingBoxIds = new Set(boxes.map((b) => b.id));

  // 카드 업데이트
  const cardOps = Object.entries(cardOrders)
    .filter(([id]) => existingCardIds.has(id))
    .map(([id, order]) =>
      prisma.cards.update({ where: { id }, data: { order: Number(order) } })
    );

  // 박스 업데이트
  const boxOps = Object.entries(boxOrders)
    .filter(([id]) => existingBoxIds.has(id))
    .map(([id, order]) =>
      prisma.boxes.update({ where: { id }, data: { order: Number(order) } })
    );

  await Promise.all([...cardOps, ...boxOps]);

  const staleBoxIds = Object.keys(boxOrders).filter(
    (id) => !existingBoxIds.has(id)
  );

  if (staleBoxIds.length) {
    await redisClient.hDel(`box_orders:${workspaceId}`, ...staleBoxIds);
    console.log(`[SYNC] 고아 박스 ${staleBoxIds.length}개 Redis에서 제거`);
  }

  console.log(`[SYNC] WS ${workspaceId} 동기화 완료`);
};
