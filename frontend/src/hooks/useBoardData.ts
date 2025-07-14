import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

import {
  createBox,
  createCard,
  deleteCardApi,
  fetchBoard,
  persistOrder,
  togglePinApi,
  updateCardApi,
} from '@/api/board';
import {
  getOrderedBoxesForRedis,
  getOrderedCardsForRedis,
} from '@/lib/orderHelper';
import { useAuthStore } from '@/stores/useAuthStore';
import { useBoardStore } from '@/stores/useBoardStore';
import { useModalStore } from '@/stores/useModalStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { BoxtypeWithCards } from '@/types/board';

export function useBoardData() {
  const { boxes, setBoxes } = useBoardStore();

  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModalStore();

  const accessToken = useAuthStore((state) => state.accessToken);
  const { workspace } = useWorkspaceStore();

  const getBoardData = async () => {
    if (!accessToken || !workspace?.id) return;

    setIsLoading(true);
    try {
      const data = await fetchBoard(workspace.id);
      setBoxes(data);
    } catch (err) {
      console.error('보드 데이터를 불러오지 못했습니다:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBoardData();
  }, [accessToken, workspace?.id]);

  const moveCard = useCallback(
    async (activeId: string, overId: string) => {
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

      const cardOrders = getOrderedCardsForRedis(updated);
      await persistOrder(workspace.id, cardOrders);
    },
    [boxes]
  );

  const moveBox = useCallback(
    async (activeId: string, overId: string) => {
      if (!boxes) return;

      const fromIndex = boxes.findIndex((b) => b.id === activeId);
      const toIndex = boxes.findIndex((b) => b.id === overId);
      if (fromIndex === -1 || toIndex === -1) return;

      const moved = arrayMove(boxes, fromIndex, toIndex).map((box, idx) => ({
        ...box,
        order: idx,
      }));
      setBoxes(moved);

      const boxOrders = getOrderedBoxesForRedis(moved);
      await persistOrder(workspace.id, undefined, boxOrders);

      // return moved;
    },
    [boxes]
  );

  // 핀 상태
  const pinToggled = (boxes: BoxtypeWithCards[], cardId: string) => {
    return boxes.map((box) => ({
      ...box,
      cards: box.cards.map((card) =>
        card.id === cardId ? { ...card, pinned: !card.pinned } : card
      ),
    }));
  };

  const togglePin = async (cardId: string) => {
    const prev = boxes;
    const updated = pinToggled(prev, cardId);

    setBoxes(updated);

    try {
      const targetCard = prev
        .flatMap((b) => b.cards)
        .find((c) => c.id === cardId);
      const newPinned = !targetCard?.pinned;

      await togglePinApi(workspace.id, cardId, newPinned);

      await persistOrder(workspace.id, getOrderedCardsForRedis(updated));
    } catch (err) {
      console.error('핀 업데이트 실패', err);
      setBoxes(prev);
    }
    // const updated = boxes.map((box) => ({
    //   ...box,
    //   cards: box.cards.map((card) =>
    //     card.id === cardId ? { ...card, pinned: !card.pinned } : card
    //   ),
    // }));

    // setBoxes(updated);

    // const cardOrders = getOrderedCardsForRedis(updated);
    // await persistOrder(workspace.id, cardOrders);
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

  const editBox = async (editBoxId: string, title: string) => {
    if (!workspace?.id) return;
    const newBoxes = boxes.map((b) =>
      b.id === editBoxId ? { ...b, title } : b
    );
    setBoxes(newBoxes);
  };

  const deleteBox = async (deletedBoxId: string) => {
    if (!accessToken || !workspace?.id) return;

    const updated = boxes.filter((b) => b.id !== deletedBoxId);
    setBoxes(updated);
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
      // assignee?: any;
    }
  ) => {
    if (!accessToken) return;

    try {
      const newCard = await createCard(workspace.id, boxId, cardData);

      const updatedBoxes = await fetchBoard(workspace.id);
      setBoxes(updatedBoxes);
      closeModal();
      return newCard;
    } catch (err) {
      console.error('카드 생성 중 오류 발생:', err);
      throw err;
    }
  };

  const editCard = async (
    cardId: string,
    boxId: string,
    cardData: {
      title?: string;
      description?: string;
      color?: string;
      start_date?: string;
      end_date?: string;
      assignee?: { id: string; name: string; profile_image: string }[];
    }
  ) => {
    try {
      const updatedCard = await updateCardApi(
        workspace.id,
        boxId,
        cardId,
        cardData
      );

      const updated = boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              cards: box.cards.map((c) =>
                c.id === cardId ? { ...c, ...updatedCard } : c
              ),
            }
          : box
      );

      setBoxes(updated);
      closeModal();

      return updatedCard;
    } catch (err) {
      alert('카드 수정 실패');
      throw err;
    }
  };

  const deleteCard = async (boxId: string, cardId: string) => {
    try {
      await deleteCardApi(workspace.id, boxId, cardId);

      const updated = boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              cards: box.cards.filter((c) => c.id !== cardId),
            }
          : box
      );

      setBoxes(updated);
      closeModal();
    } catch (err) {
      alert('카드 삭제 실패');
      throw err;
    }
  };

  return {
    boxes: boxes ?? [],
    isLoading,
    getBoardData,
    moveCard,
    moveBox,
    togglePin,
    addBox,
    addCard,
    deleteBox,
    editBox,
    deleteCard,
    editCard,
  };
}
