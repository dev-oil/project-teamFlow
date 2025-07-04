import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { BoxtypeWithCards } from '@/types/board';

import { Boardcard } from './boardcard';
import { Boardmodal } from '../../components/Modal/boardmodal';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';

type BoardboxProps = {
  box: BoxtypeWithCards;
};

export function Boardbox({ box }: BoardboxProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: box.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
        <SortableContext
          items={box.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <CardHeader>
            <CardTitle className='text-lg'>{box.title}</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <CardAction>
                  <Button className='text-m' variant='outline'>
                    + 카드 생성
                  </Button>
                </CardAction>
              </DialogTrigger>

              <DialogContent>
                <Boardmodal mode='create' box={box} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className=' flex flex-col gap-6'>
            {box.cards.length === 0 ? (
              <div className='p-4 border-dashed border-2 border-gray-400 rounded-md text-center text-sm text-gray-500'>
                카드를 추가해 주세요
              </div>
            ) : (
              box.cards.map((card) => (
                <Boardcard
                  key={card.id}
                  box={box}
                  card={card}
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
