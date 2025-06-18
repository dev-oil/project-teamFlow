import { useState } from 'react';

import { Button } from '../ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

export type ColorOption =
  | '#FF6B6B'
  | '#FFD43B'
  | '#51CF66'
  | '#38BDF8'
  | '#845EF7'
  | '#FFA8D4';

const colorOptions: ColorOption[] = [
  '#FF6B6B',
  '#FFD43B',
  '#51CF66',
  '#38BDF8',
  '#845EF7',
  '#FFA8D4',
];

export function Boardmodal() {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  // null과 undefined 따로 써도 되나? range는 null 불가

  console.log(range);
  return (
    <>
      <DialogHeader className='flex-row'>
        <DialogTitle>카드 작성</DialogTitle>
        <DialogDescription>in 박스 이름</DialogDescription>
      </DialogHeader>

      <form action='' className='grid gap-4'>
        <div className='grid gap-4'>
          {/* 제목 작성 영역 */}
          <div className='grid gap-3'>
            <Label htmlFor='title'>제목</Label>
            <Input id='title' name='title' type='text' placeholder='제목' />
          </div>

          <div className='flex flex-row justify-between'>
            {/* 색상 선택 영역 */}
            <div className='grid gap-3'>
              <Label htmlFor='color'>색상</Label>
              <div className='flex items-center gap-2'>
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-black scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    type='button'
                  />
                ))}
              </div>
            </div>

            {/* 일정 선택 영역 */}
            <div className='grid gap-3'>
              <Label htmlFor='dates' className='px-1'>
                일정
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    id='dates'
                    className='w-56 justify-between font-normal'
                  >
                    {range?.from && range?.to
                      ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                      : 'Select date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='start'
                >
                  <Calendar
                    mode='range'
                    selected={range}
                    captionLayout='dropdown'
                    onSelect={(range) => {
                      setRange(range);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 설명 작성 영역 */}
          <div className='grid gap-3'>
            <Label htmlFor='description'>설명</Label>
            <Textarea
              id='description'
              name='description'
              placeholder='카드에 대한 설명을 적어주세요'
            ></Textarea>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>삭제하기</Button>
          </DialogClose>
          <Button type='submit'>저장하기</Button>
        </DialogFooter>
      </form>
    </>
  );
}
