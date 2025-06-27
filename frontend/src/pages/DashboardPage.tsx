import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
import { useEffect, useRef, useState } from 'react';

import { Boardbox } from '@/components/Dashboard/boardbox';
// import { ScrollHorizonBtn } from '@/components/Dashboard/scrollhorizon';
import { ScrollTopBtn } from '@/components/Dashboard/scrolltop';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { BoxtypeWithCards } from '@/types/board';

export function DashboardPage() {
  const [boxes, setBoxes] = useState<BoxtypeWithCards[]>([]);

  useEffect(() => {
    fetch('/api/board')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBoxes(data.boxes);
      })
      .catch(console.error);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className='relative'>
      {/* <ScrollHorizonBtn> */}
      <ScrollArea className='h-[calc(100vh-64px)] overflow-y-auto  whitespace-nowrap'>
        <ScrollAreaViewport ref={scrollRef}>
          <div className='p-8 flex items-start gap-5'>
            {boxes.length === 0 ? (
              <div className='p-4 text-center text-gray-500'>
                작업 보드를 추가해 보세요
              </div>
            ) : (
              boxes.map((box) => <Boardbox key={box.id} box={box} />)
            )}
          </div>
        </ScrollAreaViewport>
        <ScrollBar orientation='horizontal' />
        <ScrollBar orientation='vertical' />
      </ScrollArea>
      {/* </ScrollHorizonBtn> */}

      <ScrollTopBtn targetRef={scrollRef} />
    </div>
  );
}
