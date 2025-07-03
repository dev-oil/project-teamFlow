//캘린더 조회, 필터만 hooks/iseCalendarEvents.ts
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
        console.log('API 응답 데이터:', data);
        if (Array.isArray(data)) {
           // API에서 받은 데이터의 start, end를 Date 객체로 변환
          const eventsWithDateObjects = data.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
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