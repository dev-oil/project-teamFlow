//드래그 앤 드랍 캘린더 렌더
//components/Calendar/CalendarBody

import React from 'react';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

// eslint-disable-next-line import/order
import { ko } from 'date-fns/locale';
// eslint-disable-next-line import/order
import { format, parse, startOfWeek, getDay } from 'date-fns';

import type { CalendarEvent } from '@/types/calendar';

type Props = {
  events: CalendarEvent[];
  date: Date;
  onDateChange: (date: Date) => void;
  onEventDrop: (args: { event: CalendarEvent; start: Date; end: Date }) => void;
  onEventResize: (args: { event: CalendarEvent; start: Date; end: Date }) => void;
  eventStyleGetter: (event: CalendarEvent) => any;
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
  eventStyleGetter 
}: Props) => {

  return (
    <DragAndDropCalendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      date={date}
      onNavigate={onDateChange}
      views={['month']}
      toolbar={false}
      eventPropGetter={eventStyleGetter}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      draggableAccessor={() => true}
      resizable
      style={{ height: 600 }}
    />
  );
};
