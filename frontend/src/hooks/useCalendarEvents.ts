//카드/박스 데이터 로딩 훅
// hooks/iseCalendarEvents.ts
// import { useEffect, useState } from 'react';

// import type { CalendarEvent, DropEvent, ResizeEvent } from '../types/calendar';

// export function useCalendarEvents(
//   workspaceId: number,
//   category: string,
//   selectedColor: string | null
// ) {
//   const [events, setEvents] = useState<CalendarEvent[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     if (!workspaceId) return;

//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       console.error('Access Token 없음');
//       return;
//     }

//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };

//     // 박스(카테고리) 가져오기
//     fetch(`/api/workspaces/${workspaceId}/boxes`, { headers })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setCategories(data.map((box) => box.title));
//         } else {
//           setCategories([]);
//           console.error('박스 데이터가 배열이 아님:', data);
//         }
//       })
//       .catch(console.error);

//     // 카드(이벤트) 가져오기
//     fetch(`/api/workspaces/${workspaceId}/cards`, { headers })
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setEvents(data);
//         } else {
//           setEvents([]);
//           console.error('카드 데이터가 배열이 아님:', data);
//         }
//       })
//       .catch(console.error);
//   }, [workspaceId]);

//   // 필터링된 이벤트만 반환
//   const filteredEvents = events.filter((e) => {
//     const categoryMatch = category === '' || e.category === category;
//     const colorMatch = selectedColor === null || e.color === selectedColor;
//     return categoryMatch && colorMatch;
//   });

//   const updateEvent = async (id: number, start: Date, end: Date) => {
//     const res = await fetch(`/api/cards/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//       },
//       body: JSON.stringify({ start, end }),
//     });
//     if (!res.ok) throw new Error('일정 수정 실패');

//     setEvents((prev) =>
//       prev.map((e) => (e.id === id ? { ...e, start, end } : e))
//     );
//   };

//   const onEventDrop = async ({ event, start, end }: DropEvent) => {
//     await updateEvent(event.id, start, end);
//   };

//   const onEventResize = async ({ event, start, end }: ResizeEvent) => {
//     await updateEvent(event.id, start, end);
//   };

//   const eventStyleGetter = (event: CalendarEvent) => ({
//     style: {
//       backgroundColor: event.color,
//       borderRadius: '4px',
//       opacity: 0.8,
//       color: 'white',
//       border: 'none',
//       paddingLeft: '4px',
//     },
//   });

//   return {
//     events: filteredEvents,
//     categories,
//     onEventDrop,
//     onEventResize,
//     eventStyleGetter,
//   };
// }


// import { useQuery } from '@tanstack/react-query';
// import { useEffect, useMemo } from 'react';

// import type { CalendarEvent } from '../types/calendar';

// export function useCalendarEvents(
//   accessToken: string | null,
//   workspaceId: number | null,
//   category: string,
//   selectedColor: string | null
// ) {
//   const headers = useMemo(() => ({
//     Authorization: `Bearer ${accessToken}`,
//   }), [accessToken]);

//   // 박스(카테고리) 가져오기
//   const { data: categories = [] } = useQuery<string[]>({
//     queryKey: ['boxes', workspaceId],
//     queryFn: async () => {
//       const res = await fetch(`/api/workspaces/${workspaceId}/boxes`, { headers });
//       const data = await res.json();
//       return Array.isArray(data) ? data.map((box) => box.title) : [];
//     },
//     enabled: !!workspaceId && !!accessToken,
//   });

//   // 카드(일정) 가져오기
//   const { data: events = [] } = useQuery<CalendarEvent[]>({
//     queryKey: ['cards', workspaceId],
//     queryFn: async () => {
//       const res = await fetch(`/api/workspaces/${workspaceId}/cards`, { headers });
//       const data = await res.json();
//       return Array.isArray(data) ? data : [];
//     },
//     enabled: !!workspaceId && !!accessToken,
//   });

//   const filteredEvents = useMemo(() => {
//     return events.filter((e) => {
//       const categoryMatch = category === '' || e.category === category;
//       const colorMatch = selectedColor === null || e.color === selectedColor;
//       return categoryMatch && colorMatch;
//     });
//   }, [events, category, selectedColor]);

//   const updateEvent = async (id: number, start: Date, end: Date) => {
//     const res = await fetch(`/api/cards/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify({ start, end }),
//     });
//     if (!res.ok) throw new Error('일정 수정 실패');
//   };

//   const onEventDrop = async ({ event, start, end }: any) => {
//     await updateEvent(event.id, start, end);
//   };

//   const onEventResize = async ({ event, start, end }: any) => {
//     await updateEvent(event.id, start, end);
//   };

//   const eventStyleGetter = (event: CalendarEvent) => ({
//     style: {
//       backgroundColor: event.color,
//       borderRadius: '4px',
//       opacity: 0.8,
//       color: 'white',
//       border: 'none',
//       paddingLeft: '4px',
//     },
//   });

//   return {
//     events: filteredEvents,
//     categories,
//     onEventDrop,
//     onEventResize,
//     eventStyleGetter,
//   };
// }


// hooks/iseCalendarEvents.ts
import { useEffect, useState } from 'react';

import type { CalendarEvent, DropEvent, ResizeEvent } from '../types/calendar';

export function useCalendarEvents(
  accessToken: string | null,
  workspaceId: number | null,
  category: string,
  selectedColor: string | null
) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!workspaceId) return;

    if (!accessToken) {
      console.error('Access Token 없음');
      return;
    }

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
          console.log('변환된 이벤트 데이터:', eventsWithDateObjects);
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

  const updateEvent = async (id: number, start: Date, end: Date) => {
    const res = await fetch(`/api/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ start, end }),
    });
    if (!res.ok) throw new Error('일정 수정 실패');

    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, start, end } : e))
    );
  };

  const onEventDrop = async ({ event, start, end }: DropEvent) => {
    await updateEvent(event.id, start, end);
  };

  const onEventResize = async ({ event, start, end }: ResizeEvent) => {
    await updateEvent(event.id, start, end);
  };

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
    onEventDrop,
    onEventResize,
    eventStyleGetter,
  };
}