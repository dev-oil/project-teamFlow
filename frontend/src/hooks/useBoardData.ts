import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

import { createBox, createCard, fetchBoard } from '@/api/board';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { BoxtypeWithCards } from '@/types/board';

export function useBoardData() {
  const [boxes, setBoxes] = useState<BoxtypeWithCards[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = useAuthStore((state) => state.accessToken);
  const { workspace } = useWorkspaceStore();

  useEffect(() => {
    if (!accessToken || !workspace?.id) return;

    fetchBoard(workspace?.id)
      .then(setBoxes)
      .catch((err) => {
        console.error('보드 데이터를 불러오지 못했습니다:', err);
      })
      .finally(() => setIsLoading(false));
  }, [accessToken, workspace?.id]);

  const moveCard = useCallback(
    (activeId: string, overId: string) => {
      if (!boxes) return;
      const updated = [...boxes];

      const sourceBox = updated.find((b) =>
        b.cards.some((c) => c.id === activeId)
      );
      const targetBox = updated.find((b) =>
        b.cards.some((c) => c.id === overId)
      );

      if (!sourceBox) return;
      const fromBoxIndex = updated.findIndex((b) => b.id === sourceBox.id);
      const toBoxIndex = targetBox
        ? updated.findIndex((b) => b.id === targetBox.id)
        : updated.findIndex((b) => b.id === overId);

      const activeCardIndex = updated[fromBoxIndex].cards.findIndex(
        (c) => c.id === activeId
      );

      let insertIndex = targetBox
        ? updated[toBoxIndex].cards.findIndex((c) => c.id === overId)
        : updated[toBoxIndex].cards.length;

      if (insertIndex === -1) insertIndex = updated[toBoxIndex].cards.length;

      const [movingCard] = updated[fromBoxIndex].cards.splice(
        activeCardIndex,
        1
      );

      updated[toBoxIndex].cards.splice(insertIndex, 0, movingCard);

      updated[toBoxIndex].cards = updated[toBoxIndex].cards.map(
        (card, idx) => ({
          ...card,
          order: idx,
          boxes_id: updated[toBoxIndex].id,
        })
      );

      updated[fromBoxIndex].cards = updated[fromBoxIndex].cards.map(
        (card, idx) => ({
          ...card,
          order: idx,
        })
      );
      setBoxes(updated);
    },
    [boxes]
  );

  const moveBox = useCallback(
    (activeId: string, overId: string) => {
      if (!boxes) return;

      const fromIndex = boxes.findIndex((b) => b.id === activeId);
      const toIndex = boxes.findIndex((b) => b.id === overId);
      if (fromIndex === -1 || toIndex === -1) return;

      const moved = arrayMove(boxes, fromIndex, toIndex).map((box, idx) => ({
        ...box,
        order: idx,
      }));
      setBoxes(moved);

      return moved;
    },
    [boxes]
  );

  const togglePin = (cardId: string) => {
    setBoxes((prev) =>
      prev.map((box) => ({
        ...box,
        cards: box.cards.map((card) =>
          card.id === cardId ? { ...card, pinned: !card.pinned } : card
        ),
      }))
    );
    // console.log('업데이트');
  };

  const addBox = async (title: string) => {
    if (!accessToken || !workspace?.id) return;

    try {
      await createBox(workspace.id, title);

      const updatedBoxes = await fetchBoard(workspace.id);
      setBoxes(updatedBoxes);
    } catch (err) {
      console.error('박스 생성 중 오류 발생:', err);
    }
  };

  const addCard = async (
    boxId: string,
    cardData: {
      title: string;
      description?: string;
      color?: string;
      start_date?: string;
      end_date?: string;
      assignee?: { id: string; name: string; profile_image: string }[];
    }
  ) => {
    if (!accessToken) return;

    try {
      await createCard(workspace.id, boxId, cardData);

      const updatedBoxes = await fetchBoard(workspace.id);
      setBoxes(updatedBoxes);
    } catch (err) {
      console.error('카드 생성 중 오류 발생:', err);
      throw err;
    }
  };

  return {
    boxes: boxes ?? [],
    isLoading,
    moveCard,
    moveBox,
    togglePin,
    addBox,
    addCard,
  };
}
