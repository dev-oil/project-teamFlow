import type { Request, Response } from 'express';
import * as boxService from '../services/box.service';

/** 박스 가져오기 (캘린더 - 카테고리) */  
export const getBoxesByWorkspace = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  try {
    const boxes = await boxService.findBoxesByWorkspace(workspaceId);
    res.json(boxes);
  } catch {
    res.status(500).json({ error: '박스 목록 조회 실패' });
  }
};