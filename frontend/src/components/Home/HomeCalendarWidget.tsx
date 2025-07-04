import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { Calendar } from '@/components/ui/calendar';

const events = ['2025-07-19', '2025-07-22', '2025-07-28'];

export function HomeCalendarWidget() {
  const eventDates = events.map((date) => new Date(date));
  const formatCaption = (date: Date) =>
    format(date, 'yyyy년 M월', { locale: ko });

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>달력</h2>
      <div className='bg-neutral-50 rounded-xl shadow pt-6 px-4'>
        <Calendar
          className='w-full bg-neutral-50 
          [&_thead_th]:text-center [&_thead_th]:font-semibold 
          [&_thead_th:first-child]:text-red-500 [&_thead_th:last-child]:text-blue-500'
          locale={ko}
          formatters={{ formatCaption }}
          modifiers={{ hasEvent: eventDates }}
          modifiersClassNames={{
            hasEvent:
              // 'relative flex flex-col items-center after:content-[""] after:w-1 after:h-1 after:bg-blue-500 after:rounded-full after:mt-0.5',
              'relative flex flex-col items-center after:content-[""] after:w-3/4 after:h-0.5 after:rounded-full after:bg-blue-500 after:mt-0.5',
          }}
        />
      </div>
    </div>
  );
}
