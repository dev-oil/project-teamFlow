import type { ColorCode } from './colors';

export type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: ColorCode;
  category: string;
  boxId: number;
};

export type DropEvent = {
  event: CalendarEvent;
  start: Date;
  end: Date;
};

export type ResizeEvent = {
  event: CalendarEvent;
  start: Date;
  end: Date;
};