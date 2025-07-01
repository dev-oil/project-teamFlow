import {
  addMonths,
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
} from 'date-fns';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

// eslint-disable-next-line import/order
import { enUS, ko } from 'date-fns/locale';

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

const categories = ['기획', '디자인', '개발'];

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: ColorOption; // colorOptions에 맞게 타입 제한
  category: string;
};

const locales = {
  ko: ko,
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek, //startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // 월요일 시작
  getDay,
  locales,
});

// 드래그 앤 드롭 기능을 추가한 Calendar 컴포넌트
const DragAndDropCalendar = withDragAndDrop(Calendar);

export const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: '기획 회의',
      start: new Date(2025, 5, 10), // 2025년 6월 10일
      end: new Date(2025, 5, 13), // 2025년 6월 13일
      color: '#FF6B6B', // colorOptions 사용
      category: '기획',
    },
    {
      id: 2,
      title: '디자인 시안',
      start: new Date(2025, 5, 15), // 2025년 6월 15일
      end: new Date(2025, 5, 16), // 2025년 6월 16일
      color: '#38BDF8', // colorOptions 사용
      category: '디자인',
    },
     {
      id: 3,
      title: '디자인 시안',
      start: new Date(2025, 5, 25), // 2025년 6월 15일
      end: new Date(2025, 5, 28), // 2025년 6월 16일
      color: '#51CF66', // colorOptions 사용
      category: '디자인',
    },
     {
      id: 4,
      title: '디자인 시안',
      start: new Date(2025, 5, 6), // 2025년 6월 15일
      end: new Date(2025, 5, 8), // 2025년 6월 16일
      color: '#FFD43B', // colorOptions 사용
      category: '디자인',
    },
     {
      id: 5,
      title: '디자인 시안',
      start: new Date(2025, 5, 10), // 2025년 6월 15일
      end: new Date(2025, 5, 12), // 2025년 6월 16일
      color: '#845EF7', // colorOptions 사용
      category: '디자인',
    },
     {
      id: 6,
      title: '디자인 시안',
      start: new Date(2025, 5, 22), // 2025년 6월 15일
      end: new Date(2025, 5, 24), // 2025년 6월 16일
      color: '#FFA8D4', // colorOptions 사용
      category: '디자인',
    },
  ]);

  // 이벤트 드래그 앤 드롭 핸들러
  const onEventDrop = ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: Date;
    end: Date;
  }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);
    console.log('Event dropped:', updatedEvents);
  };

  // 이벤트 리사이즈 핸들러
  const onEventResize = ({
    event,
    start,
    end,
  }: {
    event: CalendarEvent;
    start: Date;
    end: Date;
  }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);
    console.log('Event resized:', updatedEvents);
  };

  // 필터링: 빈 문자열('')은 전체보기
const filteredEvents = events.filter((e) => {
    const categoryMatch = category === '' || e.category === category;
    const colorMatch = selectedColor === null || e.color === selectedColor;
    return categoryMatch && colorMatch;
  });
  console.log('Filtered Events:', filteredEvents);

  const eventStyleGetter = (event: CalendarEvent) => {
    console.log('Rendering event:', event);
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        paddingLeft: '4px',
      },
    };
  };

  const handleNavigate = (action: 'PREV' | 'NEXT') => {
    setDate((prev) =>
      action === 'PREV' ? addMonths(prev, -1) : addMonths(prev, 1)
    );
  };

  const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);


//오늘날짜?
  // const CustomDateCell = ({ value, children }: { value: Date; children: React.ReactNode }) => {
  // const isToday = isSameDay(value, new Date());
  // const day = value.getDate();
  // const circledNumber = isToday ? circledNumbers[day - 1] || day.toString() : day;

  return (
    <div className='p-6'>
      {/* 상단 네비 */}
      <div className='flex items-center justify-between mb-4'>
        {/* 왼쪽 빈칸 */}
        <div className='flex-1' />

        {/* 가운데: 이전/다음 + 연도/월 선택 */}
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
                  onClick={() => setDate(new Date(y, date.getMonth(), 1))}
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
                    setDate(new Date(date.getFullYear(), m - 1, 1))
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

        {/* 오른쪽: 카테고리, 색상 필터 */}
        <div className='flex gap-2 flex-1 justify-end'>
          {/* 카테고리 필터 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>카테고리별 ▽</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* 전체보기 */}
              <DropdownMenuItem onClick={() => setCategory('')}>
                {category === '' && <span>✔ </span>} 전체보기
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
                  {category === cat && <span>✔ </span>}
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 색상 필터 */}
      <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">색상별 ▽</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedColor(null)}>
                {selectedColor === null && <span>✔ </span>} 전체보기
              </DropdownMenuItem>
              {colorOptions.map((col) => (
                <DropdownMenuItem key={col} onClick={() => setSelectedColor(col)}>
                  {selectedColor === col && <span>✔ </span>}
                  <span
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: col,
                      marginRight: '8px',
                    }}
                  />
                  {col}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 달력 */}
      {/* <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        style={{ height: 600 }}
        date={date}
        onNavigate={setDate}
        views={['month']}
        popup
        toolbar={false}
       eventPropGetter={eventStyleGetter} // eventPropGetter={() => ({})} 
      /> */}

      {/* 드래그 앤 드롭 캘린더 */}
      <DragAndDropCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor={(event) => event.start}
        endAccessor={(event) => event.end}
        style={{ height: 600 }}
        date={date}
        onNavigate={setDate}
        views={['month']}
        toolbar={false} // 여기까지 기본
        eventPropGetter={eventStyleGetter}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        draggableAccessor={() => true} // 모든 이벤트 드래그 가능
        resizable // 리사이징 활성화
  //       components={{
  //   dateCellWrapper: CustomDateCell, //오늘날짜
  // }}
      />
    </div>
  );
};

export default CalendarPage;
