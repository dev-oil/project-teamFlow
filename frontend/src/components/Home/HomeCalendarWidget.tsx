import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Calendar } from '@/components/ui/calendar';
import { customFetch } from '@/lib/customFetch';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

type CardEvent = {
  id: string;
  end_date: string;
};

export function HomeCalendarWidget() {
  const { workspace } = useWorkspaceStore();

  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  const formatCaption = (date: Date) =>
    format(date, 'yyyy년 M월', { locale: ko });

  useEffect(() => {
    const fetchCardEvents = async () => {
      if (!workspace?.id) return;

      setLoading(true);
      try {
        const res = await customFetch(
          `/api/workspaces/${workspace.id}/cards/events/end_dates`
        );
        const data: CardEvent[] = await res.json();
        const dates = data
          .filter((card) => card.end_date) // dueDate 있는 카드만
          .map((card) => new Date(card.end_date));

        setEventDates(dates);
      } catch (error) {
        toast.error(`📛 일정 가져오기 실패: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCardEvents();
  }, [workspace]);

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>달력</h2>
      <div className='bg-neutral-50 rounded-xl shadow pt-6 px-4'>
        {loading && (
          <p className='text-center text-gray-500'>일정을 불러오는 중...</p>
        )}
        <div className='flex justify-center items-center p-4'>
          <Calendar
            className='w-full max-w-md bg-neutral-50
            [&_thead_th]:text-center [&_thead_th]:font-semibold 
            [&_thead_th:first-child]:text-red-500 [&_thead_th:last-child]:text-blue-500'
            locale={ko}
            formatters={{ formatCaption }}
            modifiers={{ hasEvent: eventDates }}
            modifiersClassNames={{
              hasEvent:
                'relative flex flex-col items-center after:content-[""] after:w-1.5 after:h-1.5 after:bg-blue-500 after:rounded-full after:mt-1',
              // 'relative flex flex-col items-center after:content-[""] after:w-3/4 after:h-0.5 after:rounded-full after:bg-blue-500 after:mt-0.5',
            }}
          />
        </div>
      </div>
    </div>
  );
}
