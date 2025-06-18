import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export function Boardcard() {
  return (
    <>
      <div className='relative mb-[20px]'>
        <div className='w-[10px] h-full bg-amber-500 rounded-l-md absolute' />
        <Card className='w-full rounded-md'>
          <CardHeader className='pl-[26px] pr-[16px]'>
            <CardTitle className='text-lg'>회의 준비</CardTitle>
            <CardAction>
              <Button size='icon' variant='ghost'>
                핀
              </Button>
            </CardAction>
            <CardDescription>다음주 화요일 팀 회의 준비</CardDescription>
          </CardHeader>
          <CardContent className='pl-[26px] pr-[16px]'>
            <div className='flex justify-between'>
              <div>6.10 ~ 6.12</div>
              <div>
                <div className='flex flex-row flex-wrap items-center gap-12'>
                  <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
                    <Avatar className='w-8 h-8 block'>
                      <AvatarImage
                        src='https://github.com/shadcn.png'
                        className='rounded-full object-content'
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className='w-8 h-8 block'>
                      <AvatarImage
                        src='https://github.com/leerob.png'
                        alt='@leerob'
                        className='rounded-full object-content'
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className='w-8 h-8 block'>
                      <AvatarImage
                        src='https://github.com/evilrabbit.png'
                        alt='@evilrabbit'
                        className='rounded-full object-content'
                      />
                      <AvatarFallback>CN</AvatarFallback>
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
