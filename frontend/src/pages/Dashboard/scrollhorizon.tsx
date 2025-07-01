'use client';

//  시도
// components/ScrollWithHorizontalButtons.tsx

// import {
//   useRef,
//   useState,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
// } from 'react';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// interface ScrollHorizonBtnProps {
//   children: React.ReactNode;
//   cardWidth?: number; // 한 번에 이동할 거리
//   className?: string;
// }

// // forwardRef로 내부 스크롤 DOM 전달 가능
// export const ScrollHorizonBtn = forwardRef<
//   HTMLDivElement,
//   ScrollHorizonBtnProps
// >(({ children, cardWidth = 300, className }, ref) => {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);

//   useImperativeHandle(ref, () => scrollRef.current!);

//   const updateScrollState = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
//   };

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     updateScrollState();
//     el.addEventListener('scroll', updateScrollState);
//     return () => el.removeEventListener('scroll', updateScrollState);
//   }, []);

//   const scrollByAmount = (dir: 'left' | 'right') => {
//     scrollRef.current?.scrollBy({
//       left: dir === 'left' ? -cardWidth : cardWidth,
//       behavior: 'smooth',
//     });
//   };

// ScrollHorizonBtn.displayName = 'ScrollWithHorizontalButtons';

// 시도 3

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, type ReactNode } from 'react';

import { Button } from '../../components/ui/button';

// type horizonProps = {
//   children: ReactNode;
//   cardWidth?: number; // 한 번에 이동할 거리
//   className?: string;
// };
type horizonProps = {
  children: ReactNode;
};

// export const ScrollHorizonBtn = forwardRef<HTMLDivElement, horizonProps>(
//   ({ children, cardWidth = 300, className }, ref) => {
export const ScrollHorizonBtn = forwardRef<HTMLDivElement, horizonProps>(
  ({ children }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => scrollRef.current!, []);
    // const [canScrollLeft, setCanScrollLeft] = useState(false);
    // const [canScrollRight, setCanScrollRight] = useState(false);

    // useImperativeHandle(ref, () => scrollRef.current!);

    // const updateScrollState = () => {
    //   const el = scrollRef.current;
    //   if (!el) return;
    //   setCanScrollLeft(el.scrollLeft > 0);
    //   setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    // };

    return (
      <div className='relative w-full'>
        <div
          ref={scrollRef}
          // className={`overflow-x-auto no-scrollbar px-8 ${className || ''}`}
        >
          {children}
        </div>

        {/* 버튼 */}
        <div className='flex gap-2.5 absolute top-0 translate-y-1/12 left-8 z-20'>
          <Button
            // onClick={() => scrollByAmount('left')}
            // disabled={!canScrollLeft}
            size='icon'
            variant='secondary'
          >
            <ChevronLeft />
          </Button>

          <Button
            // onClick={() => scrollByAmount('right')}
            // disabled={!canScrollRight}
            size='icon'
            variant='secondary'
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    );
  }
);
