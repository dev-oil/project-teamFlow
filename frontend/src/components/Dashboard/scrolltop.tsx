'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ChevronUp } from 'lucide-react';

type ScrollTopButtonProps = {
  targetRef: React.RefObject<HTMLElement | null>;
};

export function ScrollTopBtn({ targetRef }: ScrollTopButtonProps) {
  const [visible, setVisible] = useState(false);

  const scrolltoTop = () => {
    targetRef.current?.scrollTo({ top: 70, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = targetRef.current;
    console.log('ScrollTopBtn targetRef.current:', el); // 여기에 진짜 Viewport div 나와야 함
    if (!el) return;

    const handleScroll = () => {
      console.log('scrollTop:', el.scrollTop);
      setVisible(el.scrollTop > 50);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  // if (!visible) return null;

  //이슈) 이유는 모르겠지만 ref는 viewport가 잘 나오는 있음
  // but scroll은 인식이 안되고 버튼을 클릭했을때 그냥 스크롤바만 없어짐(다시 스크롤하면 생김)

  return (
    <Button
      className='hello absolute bottom-4 right-4 z-50'
      onClick={scrolltoTop}
    >
      <ChevronUp />
    </Button>
  );
}
