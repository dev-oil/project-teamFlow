import { HomeCalendarWidget } from '@/components/Home/HomeCalendarWidget';
import { HomeMeetingList } from '@/components/Home/HomeMeetingList';

import { Boardlist } from './Dashboard/boardlist';

export function Home() {
  return (
    <main className='flex flex-col p-6 w-full gap-6'>
      {/* 작업 보드 영역 */}
      <section>
        <Boardlist page='mainpage' />
      </section>

      {/* 회의록 + 달력 영역 */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 회의록 */}
        <HomeMeetingList />

        {/* 달력 */}
        <HomeCalendarWidget />
      </section>
    </main>
  );
}
