import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useModalStore } from '@/stores/useModalStore';
import type { BoxtypeWithCards } from '@/types/board';

import { Boardcard } from './boardcard';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

type BoardboxProps = {
  box: BoxtypeWithCards;
  togglePin: (cardId: string) => void;
};

export function Boardbox({ box, togglePin }: BoardboxProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: box.id,
    });
  const { openModal } = useModalStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const orderedCards = [...box.cards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.order - b.order;
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
        <SortableContext
          // items={box.cards.map((c) => c.id)}
          items={orderedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <CardHeader>
            <CardTitle className='text-lg'>{box.title}</CardTitle>
            <CardAction>
              <Button
                variant='outline'
                onClick={() => openModal('create', box)}
              >
                + 카드 생성
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className=' flex flex-col gap-6'>
            {orderedCards.length === 0 ? (
              <div className='p-4 border-dashed border-2 border-gray-400 rounded-md text-center text-sm text-gray-500'>
                카드를 추가해 주세요
              </div>
            ) : (
              orderedCards.map((card) => (
                <Boardcard
                  key={card.id}
                  box={box}
                  card={card}
                  togglePin={togglePin}
                  // updateCard={updateCard}
                />
              ))
            )}
          </CardContent>
        </SortableContext>
      </Card>
    </div>
  );
}
