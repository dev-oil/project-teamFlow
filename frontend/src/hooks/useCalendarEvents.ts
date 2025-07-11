//캘린더 조회, 필터만 hooks/useCalendarEvents.ts
import { useEffect, useState } from 'react';

import type { CalendarEvent } from '../types/calendar';

export function useCalendarEvents(
  accessToken: string | null,
  workspaceId: number | null,
  category: string,
  selectedColor: string | null
) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // DB 데이터를 react-big-calendar 표시용으로 변환
  const convertToCalendarEvent = (event: any): CalendarEvent => {
    const start = new Date(`${event.start}T00:00:00`);
    const end = new Date(`${event.end}T00:00:00`);
    end.setDate(end.getDate() + 1);

    return {
      ...event,
      start,
      end,
    };
  };

  useEffect(() => {
    if (!workspaceId || !accessToken) return;

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    // 박스(카테고리) 가져오기
    fetch(`/api/workspaces/${workspaceId}/boxes`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((box) => box.title));
        } else {
          setCategories([]);
          console.error('박스 데이터가 배열이 아님:', data);
        }
      })
      .catch(console.error);

    // 카드(이벤트) 가져오기
    fetch(`/api/workspaces/${workspaceId}/cards`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const eventsWithDateObjects = data.map(convertToCalendarEvent);
          setEvents(eventsWithDateObjects);
        } else {
          setEvents([]);
          console.error('카드 데이터가 배열이 아님:', data);
        }
      })
      .catch(console.error);
  }, [workspaceId, accessToken]);

  // 필터링된 이벤트만 반환
  const filteredEvents = events.filter((e) => {
    const categoryMatch = category === '' || e.category === category;
    const colorMatch = selectedColor === null || e.color === selectedColor;
    return categoryMatch && colorMatch;
  });

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
      paddingLeft: '4px',
    },
  });

  return {
    events: filteredEvents,
    categories,
    eventStyleGetter,
    setEvents,
  };
}
