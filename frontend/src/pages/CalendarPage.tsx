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

  const { mutate: updateCardDate } = useUpdateCardDate();

  const onEventDrop = ({ event, start, end }: any) => {
    if (!accessToken) return;
    console.log('일정이동');
    console.log(start);
    console.log(end);

    const startDate = new Date(start);
    const endDate = new Date(end);

    // const isSingleDay =
    //   startDate.toDateString() ===
    //   new Date(endDate.getTime() - 86400000).toDateString();
    // console.log('isSameDay:', isSingleDay);

    // // ✅ DB 저장용으로 보정
    // const saveEnd = isSingleDay
    //   ? new Date(startDate) // 당일치기면 start와 같은 날
    //   : new Date(endDate); // 그 외엔 그대로

    console.log('⏬ 이동 저장');
    console.log('start →', startDate.toISOString());
    console.log('end   →', endDate.toISOString());

    // console.log('page.tsx', start, end, 'newEnd:', newEnd);
    //console.log('page-Drop', start, saveEnd);

    //이동시에는 날짜 그대로 저장
    updateCardDate(
      {
        cardId: event.id,
        start: startDate.toISOString(),
        end: endDate.toISOString(), // ✅ 그대로 저장
        workspaceId,
        accessToken,
      },
      {
        onSuccess: () => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === event.id ? { ...e, start: startDate, end: endDate } : e
            )
          );
        },
      }
    );
  };

  const onEventResize = ({ event, start, end }: any) => {
    if (!accessToken) return;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // const isSameDay =
    //   startDate.toDateString() ===
    //   new Date(endDate.getTime() - 1).toDateString();

    // const saveEnd = isSameDay
    //   ? new Date(startDate)
    //   : new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // ✅ -1일

    console.log('⏬ 리사이즈 저장');
    console.log('start →', startDate.toISOString());
    console.log('end   →', endDate.toISOString());

    updateCardDate(
      {
        cardId: event.id,
         start: startDate.toISOString(),
         end: endDate.toISOString(), // ✅ 그대로 저장
        workspaceId,
        accessToken,
      },
      {
        onSuccess: () => {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === event.id ? { ...e, start: startDate, end: endDate } : e
            )
          );
        },
      }
    );
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
