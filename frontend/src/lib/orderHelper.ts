import type { BoxtypeWithCards } from '@/types/board'; // ← 너 타입 정의 기준에 따라 import 수정

export const getOrderedCardsForRedis = (boxes: BoxtypeWithCards[]) => {
  return boxes.flatMap((box) => {
    const sortedCards = [
      ...box.cards.filter((c) => c.pinned),
      ...box.cards.filter((c) => !c.pinned),
    ];

    return sortedCards.map((card, idx) => ({
      id: card.id,
      order: idx,
    }));
  });
};

export const getOrderedBoxesForRedis = (boxes: BoxtypeWithCards[]) => {
  return boxes.map((box, idx) => ({
    id: box.id,
    order: idx,
  }));
};
