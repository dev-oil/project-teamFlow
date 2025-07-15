import { Boardlist } from './Dashboard/boardlist';
// import { SortableBoardbox } from './Dashboard/sortableboardbox';

export function DashboardPage() {
  return (
    <div className='p-6'>
      <Boardlist page='dashpage' />
      {/* <SortableBoardbox></SortableBoardbox> */}
    </div>
  );
}
