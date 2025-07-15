//년,월,이동,필터 컨트롤
import { ChevronDown, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { colorOptions } from '@/types/colors';
type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
  category: string;
  setCategory: (cat: string) => void;
  categories: string[];
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
};

export const CalendarHeader = ({
  date,
  onDateChange,
  category,
  setCategory,
  categories,
  selectedColor,
  setSelectedColor,
}: Props) => {
  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleNavigate = (action: 'PREV' | 'NEXT') => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + (action === 'PREV' ? -1 : 1));
    onDateChange(newDate);
  };

  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex-1' />
      <div className='flex items-center gap-2 justify-center'>
        <Button variant='outline' onClick={() => handleNavigate('PREV')}>
          {'<'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>{date.getFullYear()}년</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {years.map((y) => (
              <DropdownMenuItem
                key={y}
                onClick={() => onDateChange(new Date(y, date.getMonth(), 1))}
              >
                {y}년
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>{date.getMonth() + 1}월</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {months.map((m) => (
              <DropdownMenuItem
                key={m}
                onClick={() =>
                  onDateChange(new Date(date.getFullYear(), m - 1, 1))
                }
              >
                {m}월
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant='outline' onClick={() => handleNavigate('NEXT')}>
          {'>'}
        </Button>
      </div>

      <div className='flex gap-2 flex-1 justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              카테고리별 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategory('')}>
              전체보기{' '}
              {category === '' && (
                <span>
                  <Check />
                </span>
              )}
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
                {cat}
                {category === cat && (
                  <span>
                    <Check />
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              색상별 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedColor(null)}>
              전체보기{' '}
              {selectedColor === null && (
                <span>
                  <Check />{' '}
                </span>
              )}
            </DropdownMenuItem>
            {colorOptions.map((col) => (
              <DropdownMenuItem
                key={col.code}
                onClick={() => setSelectedColor(col.code)}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: col.code,
                    marginRight: '8px',
                  }}
                />
                {col.name}
                {selectedColor === col.code && (
                  <span>
                    <Check />
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
