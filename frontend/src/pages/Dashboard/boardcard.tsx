import { Pin } from 'lucide-react';
import { useState } from 'react';

import type { Boxtype, Cardtype } from '@/types/board';

import { Boardmodal } from '../../components/Modal/boardmodal';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '../../components/ui/dialog';

type BoardcardProps = {
  box: Boxtype;
  card: Cardtype;
};

export function Boardcard({ box, card }: BoardcardProps) {
  const [pinned, setPinned] = useState(false);

  // if (!card) {
  //   console.warn('Boardcard: card prop이 없습니다!');
  // } else {
  //   console.log('Boardcard: card prop 잘 받았습니다', card);
  // }

  return (
    <>
      <Dialog key={card.id}>
        <DialogTrigger asChild className='text-left w-full block'>
          <div
            className='relative mb-[20px] cursor-pointer'
            role='button'
            tabIndex={0}
          >
            <div
              className={`w-[10px] h-full rounded-l-md absolute`}
              style={{ backgroundColor: card.color }}
            />

            <Card className='w-full rounded-md'>
              <CardHeader className='pl-[26px] pr-[16px]'>
                <CardTitle className='text-lg'>{card.title}</CardTitle>
                <CardAction>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinned((prev) => !prev);
                    }}
                  >
                    {pinned ? (
                      <Pin className='opacity-100 fill-rose-500 text-rose-500' />
                    ) : (
                      <Pin className='opacity-20 fill-gray-700 text-gray-700' />
                    )}
                  </button>
                </CardAction>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className='pl-[26px] pr-[16px]'>
                <div className='flex justify-between items-center'>
                  <div>6.10 ~ 6.12</div>
                  <div>
                    <div className='flex flex-row flex-wrap items-center gap-12'>
                      <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 '>
                        <Avatar>
                          <AvatarImage
                            src='https://github.com/shadcn.png'
                            alt='@shadcn'
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarImage
                            src='https://github.com/leerob.png'
                            alt='@leerob'
                          />
                          <AvatarFallback>LR</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarImage
                            src='https://github.com/evilrabbit.png'
                            alt='@evilrabbit'
                          />
                          <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogTrigger>

        <DialogContent>
          <Boardmodal
            key={card.id}
            mode='edit'
            box={box}
            card={card}
            // boxId={box.id}
            // updateCard={updateCard}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
