import { HomeCalendarWidget } from '@/components/Home/HomeCalendarWidget';
import { HomeMeetingList } from '@/components/Home/HomeMeetingList';

import { DashboardPage } from './DashboardPage';

export function Home() {
  return (
    <main className='flex flex-col p-6 w-full'>
      {/* 상단 제목 */}
      <h1 className='text-2xl font-bold'>작업 보드</h1>

      {/* 작업 보드 영역 */}
      <section className='h-[65vh] overflow-auto mb-8'>
        <DashboardPage />
      </section>

      {/* 회의록 + 달력 영역 */}
      <section className='grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6'>
        {/* 회의록 */}
        <HomeMeetingList />

        {/* 달력 */}
        <HomeCalendarWidget />
      </section>
    </main>
  );
}
