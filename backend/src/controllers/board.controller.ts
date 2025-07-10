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

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const { workspaceId, cardId } = req.params;
    const files = req.files as Express.Multer.File[];

    const filePaths = files.map((f) => f.path);

    // DB에 파일 경로 추가
    await prisma.card.update({
      where: { id: cardId },
      data: {
        attachments: {
          push: filePaths, // Prisma 배열에 파일 경로 추가
        },
      },
    });

    res.status(200).json({
      message: '파일 업로드 완료',
      files: filePaths,
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    res.status(500).json({ message: '파일 업로드 실패' });
  }
};
