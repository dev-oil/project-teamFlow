//card.controller.ts
import type { Request, Response } from 'express';
import * as cardService from '../services/card.service';

/** 카드 리스트 가져오기 (캘린더)  */
export const getCards = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user!.userId;

  try {
    const cards = await cardService.findCards(userId, workspaceId);
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: '카드들 불러오기 실패' });
  }
};

/** 카드 가져오기 */
export const getCardById = async (req: Request, res: Response) => {
  const cardId = req.params.cardId;
  const userId = req.user!.userId;

  try {
    const card = await cardService.findCardById(userId, cardId);
    if (!card) {
      return res.status(404).json({ error: '카드를 찾을 수 없습니다.' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: '카드를 가져오지 못했습니다.' });
  }
};

/** 카드 수정 (캘린더) */
export const updateCard = async (req: Request, res: Response) => {
  const cardId = req.params.cardId;
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ error: '시작일과 종료일이 필요합니다.' });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: '날짜 형식이 올바르지 않습니다.' });
  }

  try {
    const updated = await cardService.updateCardDate(cardId, startDate, endDate);
    res.json(updated);
  } catch (err) {
    console.error('카드 수정 오류:', err);
    res.status(500).json({ error: '일정 수정 실패' });
  }
};
