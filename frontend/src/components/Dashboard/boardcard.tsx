// import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { useState } from 'react';
import { Pin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function Boardcard() {
  const [pinned, setPinned] = useState(false);

  return (
    <>
      <div className='relative mb-[20px]'>
        <div className='w-[10px] h-full bg-[#FFD43B] rounded-l-md absolute' />
        <Card className='w-full rounded-md'>
          <CardHeader className='pl-[26px] pr-[16px]'>
            <CardTitle className='text-lg'>회의 준비</CardTitle>
            <CardAction>
              {/* <button type='button'>
                <Pin />
                <PinOff />
              </button> */}
              <button type='button' onClick={() => setPinned((prev) => !prev)}>
                {pinned ? (
                  <Pin className='opacity-100 fill-rose-500 text-rose-500' />
                ) : (
                  <Pin className='opacity-20 fill-gray-700 text-gray-700' />
                )}
              </button>
            </CardAction>
            <CardDescription>다음주 화요일 팀 회의 준비</CardDescription>
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
    </>
  );
}
