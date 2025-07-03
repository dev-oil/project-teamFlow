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

  const {
    events,
    categories,
    eventStyleGetter,
    setEvents,
  } = useCalendarEvents(accessToken, workspaceId, category, selectedColor);

  const { mutate: updateCardDate } = useUpdateCardDate();

  const onEventDrop = ({ event, start, end }: any) => {
    if (!accessToken) {
      return;
    }
    updateCardDate(
      { cardId: event.id, start, end, workspaceId, accessToken },
      {
        onSuccess: () => {
          setEvents((prev) =>
            prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
          );
        },
      }
    );
  };

  const onEventResize = onEventDrop;

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
