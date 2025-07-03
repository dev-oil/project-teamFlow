//card.controller.ts
import type { Request, Response } from 'express';
import * as cardService from '../services/card.service';

/** 카드 리스트 가져오기 (캘린더)  */   
export const getCards = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user?.userId;
  
  try {
    const cards = await cardService.findCards(userId, workspaceId);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: '카드들 불러오기 실패' });
  }
};

/** 카드 가져오기 */
export const getCardById = async (req:Request, res:Response) => {
  const cardId = Number(req.params.cardId);
  const userId = req.user?.userId;

  try {
    const card = await cardService.findCardById(userId, cardId);
      if (!card) res.status(404).json({ error: '카드를 찾을 수 없습니다.' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: '카드를 가져오지 못했습니다.' });
  }
}  

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