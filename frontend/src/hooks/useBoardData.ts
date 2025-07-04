import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';

import type { BoxtypeWithCards } from '@/types/board';

export function useBoardData() {
  const [boxes, setBoxes] = useState<BoxtypeWithCards[]>([]);

  // 초기 데이터 로딩
  // useEffect(() => {
  //   fetch('/api/board')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // console.log(data);
  //       setBoxes(data.boxes);
  //     })
  //     .catch(console.error);
  // }, []);

  // useEffect(() => {
  // fetch('/api/board')
  //   .then((res) => res.json())
  //   .then((data) => {
  //     const sortedBoxes = data.boxes
  //       .map((box: BoxtypeWithCards) => ({
  //         ...box,
  //         cards: box.cards.sort((a, b) => a.order - b.order),
  //       }))
  //       .sort((a, b) => a.order - b.order);
  //     setBoxes(sortedBoxes);
  //   });
  // }, []);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await fetch('/api/board');
        const data = await res.json();

        const boxes: BoxtypeWithCards[] = data.boxes;
        const sorted = boxes
          .map((box) => ({
            ...box,
            cards: box.cards.sort((a, b) => a.order - b.order),
          }))
          .sort((a, b) => a.order - b.order);

        setBoxes(sorted);
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };

    fetchBoxes();
  }, []);

  const moveCard = useCallback((activeId: string, overId: string) => {
    setBoxes((prev) => {
      const updatedBoxes = [...prev];

      const sourceBox = updatedBoxes.find((b) =>
        b.cards.some((c) => c.id === activeId)
      );
      const targetBox = updatedBoxes.find((b) =>
        b.cards.some((c) => c.id === overId)
      );

      if (!sourceBox) return prev;
      const fromBoxIndex = updatedBoxes.findIndex((b) => b.id === sourceBox.id);
      const toBoxIndex = targetBox
        ? updatedBoxes.findIndex((b) => b.id === targetBox.id)
        : updatedBoxes.findIndex((b) => b.id === overId);

      const activeCardIndex = updatedBoxes[fromBoxIndex].cards.findIndex(
        (c) => c.id === activeId
      );

      let insertIndex = targetBox
        ? updatedBoxes[toBoxIndex].cards.findIndex((c) => c.id === overId)
        : updatedBoxes[toBoxIndex].cards.length;

      if (insertIndex === -1)
        insertIndex = updatedBoxes[toBoxIndex].cards.length;

      // if (sourceBox.id === targetBox?.id && activeCardIndex < insertIndex) {
      //   console.log(insertIndex);
      //   console.log('아래로가제발---');
      //   insertIndex += 1;
      //   console.log(insertIndex);
      // }

      const [movingCard] = updatedBoxes[fromBoxIndex].cards.splice(
        activeCardIndex,
        1
      );

      // console.log('--- drag event ---');
      // console.log('activeId', activeId);
      // console.log('overId', overId);
      // console.log('fromBox', sourceBox?.title, '→ toBox', targetBox?.title);
      // console.log(
      //   'activeCardIndex',
      //   activeCardIndex,
      //   '→ insertIndex',
      //   insertIndex
      // );

      updatedBoxes[toBoxIndex].cards.splice(insertIndex, 0, movingCard);

      // 정렬 업데이트
      updatedBoxes[toBoxIndex].cards = updatedBoxes[toBoxIndex].cards.map(
        (card, idx) => ({
          ...card,
          order: idx,
          boxes_id: updatedBoxes[toBoxIndex].id,
        })
      );

      updatedBoxes[fromBoxIndex].cards = updatedBoxes[fromBoxIndex].cards.map(
        (card, idx) => ({
          ...card,
          order: idx,
        })
      );

      return updatedBoxes;
    });
  }, []);

  const moveBox = useCallback((activeId: string, overId: string) => {
    setBoxes((prev) => {
      const fromIndex = prev.findIndex((b) => b.id === activeId);
      const toIndex = prev.findIndex((b) => b.id === overId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const moved = arrayMove(prev, fromIndex, toIndex).map((box, idx) => ({
        ...box,
        order: idx,
      }));

      return moved;
    });
  }, []);

  return { boxes, moveCard, moveBox };
}
