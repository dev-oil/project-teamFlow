import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { customFetch } from '@/lib/customFetch';

type MeetingNote = {
  id: number; // 실제 API 데이터에 id 있으면
  title: string;
  created_at: string; // YYYY-MM-DD
};

export function HomeMeetingList() {
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetingNotes = async () => {
      try {
        // const res = await customFetch('/api/workspaces/:workspaceId/notes');
        const res = await customFetch(
          'http://localhost:3001/api/51/workspace/5/notes/'
        );
        if (!res.ok) throw new Error('데이터를 가져오지 못했습니다.');
        const data: MeetingNote[] = await res.json();
        // 최신순 정렬
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setMeetingNotes(sortedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingNotes();
  }, []);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>회의록</h1>
      <div className='bg-neutral-50 rounded-xl shadow pt-6 px-4'>
        {loading ? (
          <p className='text-center text-gray-500'>불러오는 중...</p>
        ) : (
          <ul className='space-y-6 max-h-[350px] overflow-y-auto pr-2'>
            {meetingNotes.map((note) => (
              <li
                key={note.id}
                className='border-b last:border-b-0 pb-6 flex justify-between items-center'
              >
                <span className='font-medium'>{note.title}</span>
                <span className='text-sm text-gray-500'>
                  {format(new Date(note.created_at), 'yyyy년 M월 d일', {
                    locale: ko,
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
