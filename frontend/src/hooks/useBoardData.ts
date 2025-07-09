import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

import { createBox, createCard, fetchBoard } from '@/api/board';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { BoxtypeWithCards } from '@/types/board';

export function useBoardData() {
  // useEffect(() => {
  //   const fetchBoxes = async () => {
  //     try {
  //       const res = await customFetch('/api/board');
  //       const data = await res.json();

  //       const boxes: BoxtypeWithCards[] = data.boxes;
  //       const sorted = boxes
  //         .map((box) => ({
  //           ...box,
  //           cards: box.cards.sort((a, b) => a.order - b.order),
  //         }))
  //         .sort((a, b) => a.order - b.order);

  //       setBoxes(sorted);
  //     } catch (error) {
  //       console.error('Error fetching board data:', error);
  //     }
  //   };

  //   fetchBoxes();
  // }, []);

  // const {
  //   data,
  //   isLoading,
  //   isError,
  // } = useQuery<BoxtypeWithCards[]>({
  //   queryKey: ['board', workspace?.id],
  //   queryFn: () => fetchBoard(accessToken!, workspace!.id),
  //   enabled: !!accessToken && !!workspace?.id,
  //   staleTime: 1000 * 60, // optional
  // });

  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['board', workspace?.id],
  //   queryFn: () => fetchBoard(accessToken!, workspace!.id),
  //   enabled: !!accessToken && !!workspace?.id,
  //   staleTime: 1000 * 60,
  // });

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

      // 데이터는 업데이트되지만, 실제 상태(setBoxes)는 없으니
      // 여기선 이후 API 연동 또는 optimistic update 적용 필요
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
    console.log('업데이트');
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
    }
  ) => {
    if (!accessToken) return;

    try {
      const newCard = await createCard(workspace.id, boxId, cardData);

      const updatedBoxes = await fetchBoard(workspace.id);
      setBoxes(updatedBoxes);
      return newCard;
    } catch (err) {
      console.error('카드 생성 중 오류 발생:', err);
      throw err; // 필요시 호출하는 쪽에서 캐치하게 던짐
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
