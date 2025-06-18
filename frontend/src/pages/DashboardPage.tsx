// import { useEffect } from 'react';

import { Boardbox } from '@/components/Dashboard/boardbox';
import { Boardmodal } from '@/components/Modal/boardmodal';

export function DashboardPage() {
  // useEffect(() => {
  //   fetch('/api/tasks')
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // }, []);

  return (
    <div className="w-full p-[20px]">
      {/* <h2>작업 보드</h2> */}
      <Boardbox>
        <Boardmodal />
      </Boardbox>
    </div>
  );
}
