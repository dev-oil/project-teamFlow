import { Request, Response } from 'express';
import * as boardService from '../services/board.service';

export const getBoard = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = Number(req.params.workspaceId);

  try {
    const boxes = await boardService.findBoardWidthCard(userId, workspaceId);

    res.json(boxes);
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

  console.log(boxId);
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
    const filesMap = req.files as Express.Multer.File[];
    const currentFiles = JSON.parse(req.body.currentFiles || '[]'); // 기존 파일

    await boardService.uploadFilePath(filesMap, currentFiles, cardId, userId);
    res.status(200).json({ message: '파일 업로드 완료' });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    res.status(500).json({ message: '파일 업로드 실패' });
  }
};

// 작업보드 순서
export const updateOrder = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const { cards, boxes } = req.body;
  console.log('💬 body:', req.body); // ← 로그 찍기

  if (!cards && !boxes) {
    return res.status(400).json({ message: 'cards 또는 boxes가 필요합니다' });
  }
  if (!workspaceId) {
    return res
      .status(400)
      .json({ message: '워크스페이스를 불러오지 못했습니다.' });
  }

  try {
    await boardService.updateCardAndBoxOrder(workspaceId, cards, boxes);
    res.status(200).json({ message: '순서 저장 완료' });
  } catch (err) {
    console.error('Redis 저장 실패:', err);
    res.status(500).json({ message: '순서 저장 중 오류 발생' });
  }
};
