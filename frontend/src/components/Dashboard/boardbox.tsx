import type { BoxtypeWithCards } from '@/types/board';

import { Boardcard } from './boardcard';
import { Boardmodal } from '../Modal/boardmodal';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

type BoardboxProps = {
  box: BoxtypeWithCards;
};

export function Boardbox({ box }: BoardboxProps) {
  // if (!box) {
  //   console.warn('Boardbox: box prop이 없습니다!');
  // } else {
  //   console.log('Boardbox: box prop 잘 받았습니다', box);
  // }

  return (
    <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
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
      <CardContent>
        {box.cards.length === 0
          ? null
          : box.cards.map((card) => (
              <Boardcard
                key={card.id}
                box={box}
                card={card}
                // updateCard={updateCard}
              />
            ))}
      </CardContent>
    </Card>
  );
}
