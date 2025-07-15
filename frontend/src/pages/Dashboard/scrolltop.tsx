'use client';

// import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

import { Button } from '../../components/ui/button';

type ScrollTopButtonProps = {
  targetRef: React.RefObject<HTMLElement | null>;
};

export function ScrollTopBtn({ targetRef }: ScrollTopButtonProps) {
  //이슈) 버튼을 클릭했을때 스크롤바가 없어짐(다시 스크롤하면 생김)
  const scrolltoTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <Button
      className='hello absolute bottom-4 right-4 z-50'
      onClick={scrolltoTop}
    >
      <ChevronUp />
    </Button>
  );
}
