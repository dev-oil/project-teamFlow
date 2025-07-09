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
  const boxId = req.params.boxId;

  try {
    const box = await boxService.findBoxById(boxId);
    if (!box) res.status(404).json({ error: '박스를 찾을 수 없습니다.' });
    res.json(box);
  } catch (error) {
    res.status(500).json({ error: '박스를 가져오지 못했습니다.' });
  }
};

export const editBoxName = async (req: Request, res: Response) => {
  const boxId = req.params.boxId;
  const userId = req.user?.userId;
  const { title } = req.body;

  if (!title) {
    res
      .status(400)
      .json({ title: '수정 실패', description: '제목은 필수입니다.' });
    return;
  }
  try {
    const box = await boxService.updateBox(boxId, title, userId);
    res.status(200).json(box);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ title: err.name, description: err.message });
    }
  }
};

export const deleteBox = async (req: Request, res: Response) => {
  const boxId = req.params.boxId;
  const userId = req.user?.userId;
  try {
    await boxService.deleteBoxById(boxId, userId);
    res
      .status(200)
      .json({ title: '박스 삭제', description: '삭제가 완료되었습니다.' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ title: err.name, description: err.message });
    }
  }
};
