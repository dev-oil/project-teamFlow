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
  // 드래그앤드랍 시에 추가 정보가 있으면 더 넣어도 됨
};

export type ResizeEvent = {
  event: CalendarEvent;
  start: Date;
  end: Date;
  // 추가 정보 필요 시 여기에 추가
};