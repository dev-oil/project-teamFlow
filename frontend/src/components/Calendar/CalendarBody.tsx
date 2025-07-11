 //components/Calendar/CalendarBody
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// eslint-disable-next-line import/order
import { ko } from 'date-fns/locale';
// eslint-disable-next-line import/order
import { format, parse, startOfWeek, getDay } from 'date-fns';

import type { CalendarEvent } from '@/types/calendar';

import { usePublicHolidays } from './holiday';

type Props = {
  events: CalendarEvent[];
  date: Date;
  onDateChange: (date: Date) => void;
  onEventDrop: (args: { event: CalendarEvent; start: Date; end: Date }) => void;
  onEventResize: (args: {
    event: CalendarEvent;
    start: Date;
    end: Date;
  }) => void;
  eventStyleGetter: (event: CalendarEvent) => unknown;
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { ko },
});

const DragAndDropCalendar = withDragAndDrop(Calendar);

export const CalendarBody = ({
  events,
  date,
  onDateChange,
  onEventDrop,
  onEventResize,
  eventStyleGetter,
}: Props) => {
  const { holidays, loading, error } = usePublicHolidays(date.getFullYear());

  //토,일
  const dayPropGetter = (date: Date) => {
    const day = date.getDay();

    if (day === 0) return { className: 'rbc-day-sunday' };
    if (day === 6) return { className: 'rbc-day-saturday' };
    return {};
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  //공휴일
  const isHoliday = (date: Date) => {
    const formatted = format(date, 'yyyyMMdd');
    return holidays.some((h) => String(h.locdate) === formatted);
  };

  return (
    <DragAndDropCalendar
      localizer={localizer}
      events={events}
      startAccessor='start'
      endAccessor='end'
      date={date}
      onNavigate={onDateChange}
      views={['month']}
      popup={true}
      toolbar={false}
      eventPropGetter={eventStyleGetter}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      draggableAccessor={() => true}
      resizable
      style={{ height: 600 }}
      dayPropGetter={dayPropGetter}
      components={{
        month: {
          dateHeader: ({ date, label }) => {
            const day = date.getDay();
            const holiday = isHoliday(date);

            let color;
            if (holiday || day === 0)
              color = '#dc2626'; // 빨강 (공휴일 또는 일요일)
            else if (day === 6) color = '#2563eb'; // 파랑 (토요일)

            return (
              <span
                style={{
                  color,
                  fontWeight:
                    holiday || day === 0 || day === 6 ? 'bold' : undefined,
                }}
              >
                {label}
              </span>
            );
          },
        },
      }}
    />
  );
};
