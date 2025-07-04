import {
  DndContext,
  DragOverlay,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
import { useCallback, useRef, useState } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useBoardData } from '@/hooks/useBoardData';
import { Boardbox } from '@/pages/Dashboard/boardbox';
import { ScrollTopBtn } from '@/pages/Dashboard/scrolltop';
import type { Cardtype } from '@/types/board';

type BoardlistProps = {
  page: 'dashpage' | 'mainpage';
};

export function Boardlist({ page }: BoardlistProps) {
  // const { boxes } = useBoardData();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollHeight =
    page === 'dashpage' ? 'h-[calc(100vh-64px)]' : 'h-[calc(500px-64px)]';

  const { boxes, moveCard, moveBox } = useBoardData();

  const [activeCard, setActiveCard] = useState<Cardtype | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const isCard = boxes.some((box) =>
        box.cards.some((card) => card.id === activeId)
      );

      if (isCard) {
        moveCard(activeId, overId);
      } else {
        moveBox(activeId, overId);
      }
    },
    [boxes, moveBox, moveCard]
  );

  // const sensors = useSensors(useSensor(PointerSensor));
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        // collisionDetection={closestCenter}
        collisionDetection={rectIntersection}
        onDragStart={(event) => {
          const id = event.active.id as string;
          setActiveId(id);

          const foundCard = boxes
            .flatMap((b) => b.cards)
            .find((c) => c.id === id);
          if (foundCard) {
            setActiveCard(foundCard);
          }
        }}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveId(null);
          setActiveCard(null);
        }}
        onDragCancel={() => {
          setActiveId(null);
          setActiveCard(null);
        }}
      >
        <div className='relative'>
          <ScrollArea
            className={`${scrollHeight} overflow-y-auto  whitespace-nowrap`}
          >
            <ScrollAreaViewport ref={scrollRef}>
              <SortableContext
                items={boxes.map((b) => b.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className='p-8 flex items-start gap-5'>
                  {boxes.length === 0 ? (
                    <div className='p-4 text-center text-gray-500'>
                      작업 보드를 추가해 보세요
                    </div>
                  ) : (
                    boxes.map((box) => <Boardbox key={box.id} box={box} />)
                  )}
                </div>
              </SortableContext>
            </ScrollAreaViewport>
            <ScrollBar orientation='horizontal' />
            <ScrollBar orientation='vertical' />
          </ScrollArea>

          <ScrollTopBtn targetRef={scrollRef} />
        </div>
        <DragOverlay>
          {activeId && activeCard ? (
            // <div className='bg-white border rounded-md p-2 shadow-lg'>
            //   {activeCard.title}
            // </div>
            <div className='bg-white border-2 border-dashed rounded-md p-3 shadow-2xl scale-105'>
              {activeCard.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
