import { DashboardPage } from './DashboardPage';

export function Home() {
  return (
    <main className='flex flex-col gap-8 p-6 w-full'>
      {/* 상단 제목 */}
      <h1 className='text-2xl font-bold'>작업 보드</h1>

      {/* 작업 보드 영역 */}
      <section className='h-[50vh] overflow-auto'>
        <DashboardPage />
      </section>

      {/* 회의록 + 달력 영역 */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 회의록 */}
        <div className='p-4'>
          <h2 className='text-2xl font-bold'>회의록</h2>
          <div className='h-64 bg-gray-100 rounded-md' />
        </div>

        {/* 달력 */}
        <div className='p-4'>
          <h2 className='text-2xl font-bold'>달력</h2>
          <div className='h-64 bg-gray-100 rounded-md' />
        </div>
      </section>
    </main>
  );
}
