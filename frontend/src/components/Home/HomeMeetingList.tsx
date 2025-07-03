const meetingNotes = [
  { title: '주간 스프린트 회의', date: '2025-07-22' },
  { title: '디자인팀 피드백 세션', date: '2025-07-19' },
  { title: '프로젝트 kickoff 정리', date: '2025-07-15' },
  { title: '프로젝트 kickoff 정리', date: '2025-07-15' },
  { title: '프로젝트 kickoff 정리', date: '2025-07-15' },
  { title: '프로젝트 kickoff 정리', date: '2025-07-15' },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function HomeMeetingList() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>회의록</h1>
      <div className='bg-neutral-50 rounded-xl shadow pt-6 px-4'>
        <ul className='space-y-6 max-h-[350px] overflow-y-auto pr-2'>
          {meetingNotes.map((note, index) => (
            <li
              key={index}
              className='border-b last:border-b-0 pb-6 flex justify-between items-center'
            >
              <span className='font-medium'>{note.title}</span>
              <span className='text-sm text-gray-500'>{note.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
