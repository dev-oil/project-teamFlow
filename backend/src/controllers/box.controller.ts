import type { Request, Response } from 'express';
import * as boxService from '../services/box.service';

/** 박스 리스트 가져오기 (캘린더 - 카테고리) */  
export const getBoxes = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user?.userId; 

  try {
    const boxes = await boxService.findBoxes(userId, workspaceId);
    res.json(boxes);
  } catch {
    res.status(500).json({ error: '박스 목록 조회 실패' });
  }
};

/** 박스 가져오기 */  
export const getBoxById = async (req: Request, res: Response) => {
  const boxId = Number(req.params.noteId);

  try {
    const box = await boxService.findBoxById(boxId);
    if (!box) res.status(404).json({ error: '박스를 찾을 수 없습니다.' });
    res.json(box);
  } catch (error) {
    res.status(500).json({ error: '박스를 가져오지 못했습니다.' });
  }
};
