// DnD 테스트 컴포넌트

// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   horizontalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
// import { useEffect, useRef, useState } from 'react';

// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// // import { ScrollHorizonBtn } from '@/components/Dashboard/scrollhorizon';
// import type { BoxtypeWithCards } from '@/types/board';

// const BoxItem = ({ id }: { id: string }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={style}
//       className='min-w-[200px] h-[150px] bg-blue-200 rounded-md flex items-center justify-center cursor-grab'
//     >
//       {id}
//     </div>
//   );
// };

// export function SortableBoardbox() {
//   const [boxes, setBoxes] = useState<BoxtypeWithCards[]>([]);

//   const [items, setItems] = useState(['Box 1', 'Box 2', 'Box 3', 'Box 4']);

//   const sensors = useSensors(useSensor(PointerSensor));

//   function handleDragEnd(event: any) {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       const oldIndex = items.indexOf(active.id);
//       const newIndex = items.indexOf(over.id);

//       setItems(arrayMove(items, oldIndex, newIndex));
//     }
//   }

//   useEffect(() => {
//     fetch('/api/board')
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setBoxes(data.boxes);
//       })
//       .catch(console.error);
//   }, []);

//   const scrollRef = useRef<HTMLDivElement>(null);

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={closestCenter}
//       onDragEnd={handleDragEnd}
//     >
//       <ScrollArea className='w-full border rounded-lg'>
//         <ScrollAreaViewport
//           ref={scrollRef}
//           className='overflow-x-auto whitespace-nowrap'
//         >
//           <SortableContext
//             items={items}
//             strategy={horizontalListSortingStrategy}
//           >
//             <div className='flex gap-4 p-4'>
//               {items.map((id) => (
//                 <BoxItem key={id} id={id} />
//               ))}
//             </div>
//           </SortableContext>
//         </ScrollAreaViewport>
//         <ScrollBar orientation='horizontal' />
//       </ScrollArea>
//     </DndContext>
//   );
// }

import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  // closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';

import type { BoxtypeWithCards, Cardtype } from '@/types/board';

// 카드 컴포넌트
// const CardItem = ({ card }: { card: Cardtype }) => {
//   const { setNodeRef, attributes, listeners, transform, transition } =
//     useSortable({ id: card.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     zIndex: 10,
//     position: 'relative',
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       {...attributes}
//       {...listeners}
//       style={style}
//       className='bg-white border rounded-md p-2 my-1 cursor-grab will-change-transform'
//     >
//       {card.title}
//     </div>
//   );
// };

const CardItem = ({ card }: { card: Cardtype }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // transition: isDragging ? undefined : transition, // ← 핵심
    opacity: isDragging ? 0.3 : 1, // ✔ 드래그 중엔 반투명 처리
    // visibility: isDragging ? 'hidden' : 'visible',
    zIndex: isDragging ? 0 : 1, // ✔ 드래그 중 카드가 밑으로 깔리게
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='bg-white border rounded-md p-2 my-1 cursor-grab'
    >
      {card.title}
    </div>
  );
};

// 박스 컴포넌트
const BoxItem = ({ box }: { box: BoxtypeWithCards }) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: box.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className='min-w-[250px] bg-blue-200 rounded-md p-3'
    >
      <h3 className='font-bold mb-2 cursor-grab'>{box.title}</h3>

      <SortableContext
        items={box.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {box.cards.length > 0 ? (
          box.cards.map((card) => <CardItem key={card.id} card={card} />)
        ) : (
          // 카드 없을 때도 드롭 가능하게 placeholder 추가
          <div className='p-4 border-dashed border-2 border-gray-400 rounded-md text-center text-sm text-gray-500'>
            Drop card here
          </div>
        )}
      </SortableContext>
    </div>
  );
};

export function SortableBoardbox() {
  const [boxes, setBoxes] = useState<BoxtypeWithCards[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeCard, setActiveCard] = useState<Cardtype | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/board')
      .then((res) => res.json())
      .then((data) => {
        const sortedBoxes = data.boxes
          .map((box: BoxtypeWithCards) => ({
            ...box,
            cards: box.cards.sort((a, b) => a.order - b.order),
          }))
          .sort((a, b) => a.order - b.order);
        setBoxes(sortedBoxes);
      });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 카드 드래그
    const sourceBox = boxes.find((b) => b.cards.some((c) => c.id === activeId));
    const targetBox = boxes.find((b) => b.cards.some((c) => c.id === overId));

    if (sourceBox && (targetBox || overId.startsWith('box-'))) {
      if (activeId === overId) return;

      const updatedBoxes = [...boxes];
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

      if (insertIndex === -1) {
        insertIndex = updatedBoxes[toBoxIndex].cards.length;
      }

      // if (sourceBox.id === targetBox?.id && activeCardIndex < insertIndex) {
      //   insertIndex += 1;
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

      // order 정리
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

      setBoxes(updatedBoxes);
      return;
    }

    // 박스 드래그
    const activeBoxIndex = boxes.findIndex((b) => b.id === activeId);
    const overBoxIndex = boxes.findIndex((b) => b.id === overId);

    if (activeBoxIndex !== -1 && overBoxIndex !== -1) {
      const updated = arrayMove(boxes, activeBoxIndex, overBoxIndex).map(
        (box, idx) => ({
          ...box,
          order: idx,
        })
      );
      setBoxes(updated);
    }
  };

  return (
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
      <SortableContext
        items={boxes.map((b) => b.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className='flex gap-4 p-4 overflow-x-auto'>
          {boxes.map((box) => (
            <BoxItem key={box.id} box={box} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId && activeCard ? (
          // <div className='bg-white border rounded-md p-2 shadow-lg'>
          //   {activeCard.title}
          // </div>
          <div className='bg-gray-100 border-2 border-dashed rounded-md p-3 shadow-2xl scale-105'>
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
