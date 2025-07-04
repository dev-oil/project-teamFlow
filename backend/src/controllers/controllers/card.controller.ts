//card.controller.ts
import type { Request, Response } from 'express';
import * as cardService from '../services/card.service';

/** 카드 가져오기 */  
export const getWorkspaceCards = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user?.userId;
  try {
    const cards = await cardService.findCardsByWorkspace(userId, workspaceId);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: '일정 불러오기 실패' });
  }
};

/** 카드 수정 */ 
export const updateCard = async (req: Request, res: Response) => {
  const cardId = Number(req.params.cardId);  
  const { start, end } = req.body;
  try {
    const updated = await cardService.updateCardDate(cardId, start, end);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: '일정 수정 실패' });
  }
};