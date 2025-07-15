import { Request, RequestHandler, Response } from 'express';

import * as boardService from '../services/board.service';
import { redisClient } from '../utils/redis';

export const getBoard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);

  try {
    const boxes = await boardService.findBoardWidthCard(userId, workspaceId);

    // Redis에서 순서 불러오기
    const [cardOrderMap, boxOrderMap] = await Promise.all([
      redisClient.hGetAll(`card_orders:${workspaceId}`),
      redisClient.hGetAll(`box_orders:${workspaceId}`),
    ]);

    // 순서 재적용
    const sortedBoxes = boxes
      .map((box) => {
        const sortedCards = box.cards
          .map((card) => ({
            ...card,
            order: parseInt(cardOrderMap[card.id] ?? `${card.order}` ?? '999'),
          }))
          .sort((a, b) => a.order - b.order);

        return {
          ...box,
          order: parseInt(boxOrderMap[box.id] ?? `${box.order}` ?? '999'),
          cards: sortedCards,
        };
      })
      .sort((a, b) => a.order - b.order);

    res.json(sortedBoxes);
  } catch (error) {
    res.status(500).json({ error: '노트 목록을 불러오지 못했습니다.' });
  }
};

// 박스 생성
export const createBox = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: '박스 제목이 필요합니다.' });
    return;
  }

  try {
    const newBox = await boardService.createBox(userId, workspaceId, title);
    res.status(201).json(newBox);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '박스를 생성하지 못했습니다.' });
  }
};

// 카드 생성
export const createCard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);
  const boxId = req.params.boxId;
  const { title, description, color, start_date, end_date, assignee } =
    req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: '카드 제목이 필요합니다.' });
    return;
  }

  try {
    const newCard = await boardService.postCard(userId, workspaceId, boxId, {
      title,
      description,
      color,
      start_date,
      end_date,
      assignee,
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '카드를 생성하지 못했습니다.' });
  }
};

// 카드 수정 (작업보드)
export const patchCard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);
  const cardId = req.params.cardId;
  const data = req.body;

  try {
    const updated = await boardService.updateCard(
      userId,
      workspaceId,
      cardId,
      data
    );
    res.status(200).json(updated);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: '카드 수정 실패' });
  }
};

// 카드 삭제 (작업보드)
export const deleteCard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);
  const cardId = req.params.cardId;

  try {
    await boardService.deleteCard(userId, workspaceId, cardId);
    res.status(204).end();
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: '카드 삭제 실패' });
  }
};

/** 첨부파일 업로드 */
export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!.userId;
    const filesMap = req.files as unknown as Express.Multer.File[];
    const currentFiles = JSON.parse(req.body.currentFiles || '[]'); // 기존 파일

    await boardService.uploadFilePath(filesMap, currentFiles, cardId, userId);
    res.status(200).json({ message: '파일 업로드 완료' });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    res.status(500).json({ message: '파일 업로드 실패' });
  }
};

/** 첨부파일 다운로드 */
export const downloadAttachment = async (req: Request, res: Response) => {
  const { cardId, filename } = req.params;
  const userId = req.user!.userId;

  try {
    const { filePath, originalName } = await boardService.downloadFile(
      cardId,
      filename,
      userId
    );
    res.download(filePath, originalName);
  } catch (error) {
    res.status(500).json({ message: '파일 다운로드 실패' });
  }
};

// 작업보드 순서
export const updateOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const workspaceId = Number(req.params.workspaceId);
  const { cards, boxes } = req.body;

  if (!cards && !boxes) {
    res.status(400).json({ message: 'cards 또는 boxes가 필요합니다' });
    return;
  }
  if (!workspaceId) {
    res.status(400).json({ message: '워크스페이스를 불러오지 못했습니다.' });
    return;
  }

  try {
    await boardService.updateCardAndBoxOrder(workspaceId, cards, boxes);
    res.status(200).json({ message: '순서 저장 완료' });
  } catch (err) {
    console.error('Redis 저장 실패:', err);
    res.status(500).json({ message: '순서 저장 중 오류 발생' });
  }
};

export const togglePin = async (req: Request, res: Response) => {
  const cardId = req.params.cardId;
  const { pinned } = req.body;

  if (typeof pinned !== 'boolean') {
    res.status(400).json({ error: 'pinned 값이 boolean이 아닙니다.' });
    return;
  }

  try {
    await boardService.updateCardPin(cardId, pinned);
    res.status(200).json({ message: '핀 상태가 업데이트되었습니다.' });
  } catch (error) {
    console.error('핀 업데이트 실패:', error);
    res.status(500).json({ error: '핀 상태 업데이트 중 오류 발생' });
  }
};

export const manualSync = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);

  try {
    await boardService.OrderFromRedisToDB(workspaceId);
    res.status(200).json({ message: '동기화 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '동기화 실패' });
  }
};
