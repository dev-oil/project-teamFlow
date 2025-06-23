// import { useEffect } from 'react';

import { Boardbox } from '@/components/Dashboard/boardbox';
import { ScrollHorizonBtn } from '@/components/Dashboard/scrollhorizon';
import { ScrollTopBtn } from '@/components/Dashboard/scrolltop';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollAreaViewport } from '@radix-ui/react-scroll-area';
import { useEffect, useRef } from 'react';

export function DashboardPage() {
  // useEffect(() => {
  //   fetch('/api/tasks')
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(scrollRef);
    console.log('ref 확인:', scrollRef.current);
  }, []);

  return (
    <div className='relative'>
      <ScrollHorizonBtn>
        <ScrollArea className='h-[calc(100vh-64px)] overflow-y-auto  whitespace-nowrap'>
          <ScrollAreaViewport ref={scrollRef}>
            <div className='p-8 flex gap-5'>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
              <Boardbox></Boardbox>
            </div>
          </ScrollAreaViewport>
          <ScrollBar orientation='horizontal' />
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </ScrollHorizonBtn>

      <ScrollTopBtn targetRef={scrollRef} />
    </div>
  );
}
