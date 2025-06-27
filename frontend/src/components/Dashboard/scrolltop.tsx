'use client';

// import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

import { Button } from '../ui/button';

type ScrollTopButtonProps = {
  targetRef: React.RefObject<HTMLElement | null>;
};

export function ScrollTopBtn({ targetRef }: ScrollTopButtonProps) {
  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const el = targetRef.current;
  //   console.log('ScrollTopBtn targetRef.current:', el); // 여기에 진짜 Viewport div 나와야 함
  //   if (!el) return;

  //   const handleScroll = () => {
  //     console.log('scrollTop:', el.scrollTop);
  //     setVisible(el.scrollTop > 10);
  //   };

  //   el.addEventListener('scroll', handleScroll);
  //   return () => el.removeEventListener('scroll', handleScroll);
  // }, [targetRef]);

  // if (!visible) return null;

  //이슈) 버튼을 클릭했을때 스크롤바가 없어짐(다시 스크롤하면 생김)
  const scrolltoTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // targetRef.current.scrollTo({
      //   behavior: 'smooth',
      //   top: 0,
      // });
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
