import { Request, Response } from 'express';

import * as boardService from '../services/board.service';

export const getBoard = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
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
  const userId = req.user?.userId;
  const workspaceId = Number(req.params.workspaceId);
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: '박스 제목이 필요합니다.' });
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
  const userId = req.user?.userId;
  const workspaceId = Number(req.params.workspaceId);
  const boxId = req.params.boxId;
  const { title, description, color, start_date, end_date } = req.body;

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
      // users_ids,
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '카드를 생성하지 못했습니다.' });
  }
};
