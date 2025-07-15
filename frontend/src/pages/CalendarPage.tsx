//CalendarPage.tsx
import { useState } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { CalendarBody } from '../components/Calendar/CalendarBody';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { useCalendarEvents } from '../hooks/useCalendarEvents'; //캘린더 불러오기
import { useUpdateCardDate } from '../hooks/useUpdateCardDate'; //캘린더 이동

export const CalendarPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { workspace } = useWorkspaceStore();
  const workspaceId = workspace?.id ?? null;

  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { events, categories, eventStyleGetter, setEvents } = useCalendarEvents(
    accessToken,
    workspaceId,
    category,
    selectedColor
  );

  const formatDateKST = (date: Date): string => {
    const kstDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return kstDate.toISOString().slice(0, 10);
  };

  //DB 저장
  const convertEndForDb = (start: Date, end: Date) => {
    const adjustedStart = new Date(start);
    const adjustedEnd = new Date(end);
    // react-big-calendar가 end+1일로 주므로 무조건 -1일 처리
    adjustedEnd.setDate(adjustedEnd.getDate() - 1);

    const startStr = formatDateKST(adjustedStart);
    const endStr = formatDateKST(adjustedEnd);

    return { start: startStr, end: endStr };
  };

  const { mutate: updateCardDate } = useUpdateCardDate();

  // 일정 이동
  const onEventDrop = ({ event, start, end }: any) => {
    // 1) 화면 상태 먼저 갱신
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);

    // 2) start/end를 '순수 날짜'로 정규화 (시간 제거)
    const normStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const normEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // 3) DB 저장용으로 보정
    const { start: startStr, end: endStr } = convertEndForDb(
      normStart,
      normEnd
    );

    updateCardDate({
      workspaceId: workspaceId!,
      cardId: event.id,
      start: startStr,
      end: endStr,
      accessToken: accessToken!,
    });
  };

  // 일정 길이 조정
  const onEventResize = ({ event, start, end }: any) => {
    // 1) 화면 상태 먼저 갱신
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);

    // 2) start/end를 '순수 날짜'로 정규화 (시간 제거)
    const normStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const normEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    // 3) DB 저장용으로 보정
    const { start: startStr, end: endStr } = convertEndForDb(
      normStart,
      normEnd
    );

    updateCardDate({
      workspaceId: workspaceId!,
      cardId: event.id,
      start: startStr,
      end: endStr,
      accessToken: accessToken!,
    });
  };

  if (!workspaceId || !accessToken) return <div>로딩중</div>;

  return (
    <div className='p-6'>
      <CalendarHeader
        date={date}
        onDateChange={setDate}
        category={category}
        setCategory={setCategory}
        categories={categories}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
      <CalendarBody
        date={date}
        onDateChange={setDate}
        events={events}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        eventStyleGetter={eventStyleGetter}
      />
    </div>
  );
};

export default CalendarPage;
