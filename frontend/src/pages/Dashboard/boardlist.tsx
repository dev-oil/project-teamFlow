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

import BoardModalProvider from '@/components/Modal/boardmodalprovider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    page === 'dashpage' ? 'h-[calc(100vh-172px)]' : 'h-[calc(500px-172px)]';

  const { boxes, togglePin, isLoading, moveCard, moveBox, addBox } =
    useBoardData();

  const [activeCard, setActiveCard] = useState<Cardtype | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [title, setTitle] = useState('');

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

  // if (isLoading) return <div className='p-4'>불러오는 중...</div>;
  // if (isError)
  //   return <div className='p-4 text-red-500'>데이터 불러오기 실패</div>;
  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className='p-6'>
      <div className='mb-6 flex justify-end'>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!title.trim()) {
              alert('박스 이름을 입력해주세요.');
              return;
            }

            addBox(title);
            setTitle('');
          }}
          className='flex w-full max-w-sm items-center gap-2'
        >
          <Input
            type='text'
            placeholder='박스이름'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type='submit' variant='default'>
            + 박스 추가하기
          </Button>
        </form>
      </div>
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
                <div className='flex items-start gap-5'>
                  {boxes.length === 0 ? (
                    <div className='p-4 text-center text-gray-500'>
                      작업 보드를 추가해 보세요
                    </div>
                  ) : (
                    boxes.map((box) => (
                      <Boardbox
                        key={box.id}
                        // box={{ ...box, cards: [...box.cards] }}
                        box={box}
                        togglePin={togglePin}
                      />
                    ))
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

      <BoardModalProvider />
    </div>
  );
}
