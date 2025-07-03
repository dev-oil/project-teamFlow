// import {
//   addMonths,
//   format,
//   parse,
//   startOfWeek,
//   getDay,
// } from 'date-fns';
// import { useState, useEffect } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';

// // eslint-disable-next-line import/order
// import { ko } from 'date-fns/locale';

// export type ColorOption =
//   | '#FF6B6B'
//   | '#FFD43B'
//   | '#51CF66'
//   | '#38BDF8'
//   | '#845EF7'
//   | '#FFA8D4';

// const colorOptions: ColorOption[] = [
//   '#FF6B6B',
//   '#FFD43B',
//   '#51CF66',
//   '#38BDF8',
//   '#845EF7',
//   '#FFA8D4',
// ];

// const categories = ['기획', '디자인', '개발'];

// type CalendarEvent = {
//   id: number;
//   title: string;
//   start: Date;
//   end: Date;
//   color: ColorOption;
//   category: string;
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek, 
//   getDay,
//   locales: { ko },
// });

// const DragAndDropCalendar = withDragAndDrop(Calendar);

// // // 오늘 날짜 강조 컴포넌트
// // const CustomDateCell = ({ value, children }: { value: Date; children: React.ReactNode }) => {
// //   const isToday = isSameDay(value, new Date());
// //   return (
// //     <div
// //       style={{
// //         backgroundColor: isToday ? '#eaf6ff' : 'transparent',
// //         border: isToday ? '2px solid #38BDF8' : 'none',
// //         borderRadius: isToday ? '4px' : '0',
// //         padding: '2px',
// //         textAlign: 'center',
// //       }}
// //     >
// //       {children}
// //     </div>
// //   );
// // };

// export const CalendarPage = () => {
//   const [date, setDate] = useState(new Date());
//   const [category, setCategory] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

//   const [events, setEvents] = useState<CalendarEvent[]>([
//     {
//       id: 1,
//       title: '기획 회의',
//       start: new Date(2025, 6, 10),
//       end: new Date(2025, 6, 13),
//       color: '#FF6B6B',
//       category: '기획',
//     },
//     {
//       id: 2,
//       title: '디자인 시안',
//       start: new Date(2025, 6, 15),
//       end: new Date(2025, 6, 16),
//       color: '#38BDF8',
//       category: '디자인',
//     },
//     {
//       id: 3,
//       title: '디자인 시안',
//       start: new Date(2025, 6, 15),
//       end: new Date(2025, 6, 18),
//       color: '#51CF66',
//       category: '디자인',
//     },
//     {
//       id: 4,
//       title: '디자인 시안',
//       start: new Date(2025, 6, 6),
//       end: new Date(2025, 6, 8),
//       color: '#845EF7',
//       category: '디자인',
//     },
//     {
//       id: 5,
//       title: '디자인 시안',
//       start: new Date(2025, 6, 12),
//       end: new Date(2025, 6, 16),
//       color: '#FFD43B',
//       category: '디자인',
//     },
//     {
//       id: 6,
//       title: '디자인 시안',
//       start: new Date(2025, 6, 22),
//       end: new Date(2025, 6, 24),
//       color: '#FFA8D4',
//       category: '디자인',
//     },
//   ]);

//   // 컴포넌트 마운트 시 오늘 날짜로 설정
//   useEffect(() => {
//     setDate(new Date());
//   }, []);

//   const onEventDrop = ({
//     event,
//     start,
//     end,
//   }: {
//     event: CalendarEvent;
//     start: Date;
//     end: Date;
//   }) => {
//     const updatedEvents = events.map((e) =>
//       e.id === event.id ? { ...e, start, end } : e
//     );
//     setEvents(updatedEvents);
//   };

//   const onEventResize = ({
//     event,
//     start,
//     end,
//   }: {
//     event: CalendarEvent;
//     start: Date;
//     end: Date;
//   }) => {
//     const updatedEvents = events.map((e) =>
//       e.id === event.id ? { ...e, start, end } : e
//     );
//     setEvents(updatedEvents);
//   };

//   const filteredEvents = events.filter((e) => {
//     const categoryMatch = category === '' || e.category === category;
//     const colorMatch = selectedColor === null || e.color === selectedColor;
//     return categoryMatch && colorMatch;
//   });

//   const eventStyleGetter = (event: CalendarEvent) => {
//     return {
//       style: {
//         backgroundColor: event.color,
//         borderRadius: '4px',
//         opacity: 0.8,
//         color: 'white',
//         border: 'none',
//         paddingLeft: '4px',
//       },
//     };
//   };

//   const handleNavigate = (action: 'PREV' | 'NEXT') => {
//     setDate((prev) =>
//       action === 'PREV' ? addMonths(prev, -1) : addMonths(prev, 1)
//     );
//   };

//   const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);

//   return (
//     <div className='p-6'>
//       <div className='flex items-center justify-between mb-4'>
//         <div className='flex-1' />
//         <div className='flex items-center gap-2 justify-center'>
//           <Button variant='outline' onClick={() => handleNavigate('PREV')}>
//             {'<'}
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost'>{date.getFullYear()}년</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {years.map((y) => (
//                 <DropdownMenuItem
//                   key={y}
//                   onClick={() => setDate(new Date(y, date.getMonth(), 1))}
//                 >
//                   {y}년
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost'>{date.getMonth() + 1}월</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {months.map((m) => (
//                 <DropdownMenuItem
//                   key={m}
//                   onClick={() =>
//                     setDate(new Date(date.getFullYear(), m - 1, 1))
//                   }
//                 >
//                   {m}월
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Button variant='outline' onClick={() => handleNavigate('NEXT')}>
//             {'>'}
//           </Button>
//         </div>
//         <div className='flex gap-2 flex-1 justify-end'>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='outline'>카테고리별 ▽</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => setCategory('')}>
//                 {category === '' && <span>✔ </span>} 전체보기
//               </DropdownMenuItem>
//               {categories.map((cat) => (
//                 <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
//                   {category === cat && <span>✔ </span>}
//                   {cat}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='outline'>색상별 ▽</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => setSelectedColor(null)}>
//                 {selectedColor === null && <span>✔ </span>} 전체보기
//               </DropdownMenuItem>
//               {colorOptions.map((col) => (
//                 <DropdownMenuItem key={col} onClick={() => setSelectedColor(col)}>
//                   {selectedColor === col && <span>✔ </span>}
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       width: '20px',
//                       height: '20px',
//                       backgroundColor: col,
//                       marginRight: '8px',
//                     }}
//                   />
//                   {col}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//       <DragAndDropCalendar
//         localizer={localizer}
//         events={filteredEvents}
//         startAccessor={(event) => event.start}
//         endAccessor={(event) => event.end}
//         style={{ height: 600 }}
//         date={date}
//         onNavigate={setDate}
//         views={['month']}
//         toolbar={false}
//         eventPropGetter={eventStyleGetter}
//         onEventDrop={onEventDrop}
//         onEventResize={onEventResize}
//         draggableAccessor={() => true}
//         resizable
//         // components={{
//         //   dateCellWrapper: CustomDateCell,
//         // }}
//       />
//     </div>
//   );
// };

// export default CalendarPage;

//------------------------------------------------------------------------------------------------
//2차수정

// import {
//   addMonths,
//   format,
//   parse,
//   startOfWeek,
//   getDay,
// } from 'date-fns';
// import { useState, useEffect } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
// import { useParams } from 'react-router-dom';

// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';

// // eslint-disable-next-line import/order
// import { ko } from 'date-fns/locale';
// import { type CalendarEvent } from '@/types/calendar';
// import { colorOptions } from '@/types/colors';

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek, 
//   getDay,
//   locales: { ko },
// });

// const DragAndDropCalendar = withDragAndDrop(Calendar);

//   export const CalendarPage = () => {
//   const { workspaceId: workspaceIdParam } = useParams<{ workspaceId: string }>();
//   const workspaceId = Number(workspaceIdParam);

//   const [date, setDate] = useState(new Date());
//   const [category, setCategory] = useState<string>('');
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [events, setEvents] = useState<CalendarEvent[]>([]);

// useEffect(() => {
//   if (!workspaceId) return;

//   const fetchBoxes = async () => {
//     try {
//       const res = await fetch(`/api/workspaces/${workspaceId}/boxes`);
//       if (!res.ok) throw new Error('박스 불러오기 실패');
//       const data: { id: number; title: string }[] = await res.json();
//       setCategories(data.map(box => box.title));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchBoxes();
// }, [workspaceId]);

// useEffect(() => {
//   if (!workspaceId) return;

//   const fetchEvents = async () => {
//     try {
//       const res = await fetch(`/api/workspaces/${workspaceId}/cards`);
//       if (!res.ok) throw new Error('불러오기 실패');

//       const data = await res.json();
//       setEvents(data);
//     } catch (err) {
//       console.error('일정 불러오기 실패:', err);
//     }
//   };

//   fetchEvents();
// }, [workspaceId]);

//   const onEventDrop = async ({ event, start, end }: any) => {
//     try {
//       const res = await fetch(`/api/cards/${event.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ start, end }),
//       });

//       if (!res.ok) throw new Error('일정 수정 실패');

//       setEvents((prev) =>
//         prev.map((e) =>
//           e.id === event.id ? { ...e, start, end } : e
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onEventResize = async ({ event, start, end }: any) => {
//     // resize 처리도 드롭과 동일하게 API 호출
//     try {
//       const res = await fetch(`/api/cards/${event.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ start, end }),
//       });

//       if (!res.ok) throw new Error('일정 수정 실패');

//       setEvents((prev) =>
//         prev.map((e) =>
//           e.id === event.id ? { ...e, start, end } : e
//         )
//       );
//     } catch (err) {
//       console.error(err);
//     }
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

//   const handleNavigate = (action: 'PREV' | 'NEXT') => {
//     setDate((prev) =>
//       action === 'PREV' ? addMonths(prev, -1) : addMonths(prev, 1)
//     );
//   };

//   const years = Array.from({ length: 5 }, (_, i) => 2022 + i);
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);

//   const filteredEvents = events.filter((e) => {
//     const categoryMatch = category === '' || e.category === category;
//     const colorMatch = selectedColor === null || e.color === selectedColor;
//     return categoryMatch && colorMatch;
//   });

//   return (
//     <div className='p-6'>
//       <div className='flex items-center justify-between mb-4'>
//         <div className='flex-1' />
//         <div className='flex items-center gap-2 justify-center'>
//           <Button variant='outline' onClick={() => handleNavigate('PREV')}>
//             {'<'}
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost'>{date.getFullYear()}년</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {years.map((y) => (
//                 <DropdownMenuItem
//                   key={y}
//                   onClick={() => setDate(new Date(y, date.getMonth(), 1))}
//                 >
//                   {y}년
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='ghost'>{date.getMonth() + 1}월</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {months.map((m) => (
//                 <DropdownMenuItem
//                   key={m}
//                   onClick={() =>
//                     setDate(new Date(date.getFullYear(), m - 1, 1))
//                   }
//                 >
//                   {m}월
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <Button variant='outline' onClick={() => handleNavigate('NEXT')}>
//             {'>'}
//           </Button>
//         </div>
//         <div className='flex gap-2 flex-1 justify-end'>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='outline'>카테고리별 ▽</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => setCategory('')}>
//                 {category === '' && <span>✔ </span>} 전체보기
//               </DropdownMenuItem>
//               {categories.map((cat) => (
//   <DropdownMenuItem key={cat} onClick={() => setCategory(cat)}>
//     {category === cat && <span>✔ </span>}
//     {cat}
//   </DropdownMenuItem>
// ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant='outline'>색상별 ▽</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <DropdownMenuItem onClick={() => setSelectedColor(null)}>
//                 {selectedColor === null && <span>✔ </span>} 전체보기
//               </DropdownMenuItem>
//              {colorOptions.map((col) => (
//                 <DropdownMenuItem key={col.code} onClick={() => setSelectedColor(col.code)}>
//                   {selectedColor === col.code && <span>✔ </span>}
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       width: '20px',
//                       height: '20px',
//                       backgroundColor: col.code,
//                       marginRight: '8px',
//                     }}
//                   />
//                   {col.name}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//       <DragAndDropCalendar
//         localizer={localizer}
//         events={filteredEvents}
//   startAccessor="start"
//         endAccessor="end"
//         style={{ height: 600 }}
//         date={date}
//         onNavigate={setDate}
//         views={['month']}
//         toolbar={false}
//         eventPropGetter={eventStyleGetter}
//         onEventDrop={onEventDrop}
//         onEventResize={onEventResize}
//         draggableAccessor={() => true}
//         resizable
//         // components={{
//         //   dateCellWrapper: CustomDateCell,
//         // }}
//       />
//     </div>
//   );
// };

// export default CalendarPage;


// import { useState } from 'react';

// import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

// import { CalendarBody } from '../components/Calendar/CalendarBody';
// import { CalendarHeader } from '../components/Calendar/CalendarHeader';
// import { useCalendarEvents } from '../hooks/useCalendarEvents';


// export const CalendarPage = () => {
//     const { workspace } = useWorkspaceStore();
   
//     const workspaceId = workspace?.id;
  
  
//   const [date, setDate] = useState(new Date());
//   const [category, setCategory] = useState('');
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);

//   console.log(workspaceId, category);

//   const {
//     events,
//     categories,
//     onEventDrop,
//     onEventResize,
//     eventStyleGetter,
//   } = useCalendarEvents(workspaceId ?? 0, category, selectedColor);

//   if (!workspaceId) {
//     // workspaceId가 없으면 로딩중 표시하거나 빈 화면 처리
//     return <div>Loading...</div>;
//   }


//  return (
//     <div className="p-6">
//       <CalendarHeader
//         date={date}
//         onDateChange={setDate}
//         category={category}
//         setCategory={setCategory}
//         categories={categories}
//         selectedColor={selectedColor}
//         setSelectedColor={setSelectedColor}
//       />
//       <CalendarBody
//         date={date}
//         onDateChange={setDate}
//         events={events}
//         onEventDrop={onEventDrop}
//         onEventResize={onEventResize}
//         eventStyleGetter={eventStyleGetter}
//       />
//     </div>
//   );
// };

// export default CalendarPage;


import { useState } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { CalendarBody } from '../components/Calendar/CalendarBody';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';

import { useCalendarEvents } from '../hooks/useCalendarEvents';

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
  onEventDrop,
  onEventResize,
  eventStyleGetter,
} = useCalendarEvents(accessToken, workspaceId, category, selectedColor);

  console.log(workspaceId, category, accessToken);
  
  if (!workspaceId || !accessToken) return <div>Loading...</div>;

  return (
    <div className="p-6">
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
