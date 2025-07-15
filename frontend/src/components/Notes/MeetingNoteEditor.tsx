// components/MeetingNoteEditor.tsx
// import { ko } from 'date-fns/locale';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // 기본 Textarea

import type { Note } from '@/types/note';
import { useNavigate } from 'react-router-dom';

type Mode = 'create' | 'edit';

interface MeetingNoteEditorProps {
  mode: Mode;
  defaultValue?: Partial<Note>;
  onSubmit: (form: FormData) => void;
}

export function MeetingNoteEditor({
  mode,
  defaultValue,
  onSubmit,
}: MeetingNoteEditorProps) {
  const [title, setTitle] = useState(defaultValue?.title ?? '');
  const [participantInput, setParticipantInput] = useState('');
  const [participant, setParticipant] = useState<string[]>(
    defaultValue?.participant ?? []
  );

  // const [date, setDate] = useState<Date | undefined>(
  //   defaultValue?.created_at ? new Date(defaultValue.created_at) : undefined
  // );

  // const [fileList, setFileList] = useState<File[]>([]);
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFileList(Array.from(e.target.files));
  //   }
  // };

  const [content, setContent] = useState(defaultValue?.content ?? '');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const form = new FormData();
    form.append('title', title);
    form.append('participant', JSON.stringify(participant));
    form.append('content', content);
    // if (date) form.append('date', date.toISOString());
    // fileList.forEach((file) => form.append('files', file));

    onSubmit(form);
  };

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-xl font-semibold'>
        {mode === 'create' ? '회의록 작성' : '회의록 수정'}
      </h2>

      {/* 제목 */}
      <div>
        <label className='block text-sm mb-1 font-medium'>회의 제목</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='회의 제목을 입력하세요'
        />
      </div>

      {/* 참석자 */}
      <div>
        <label className='block text-sm mb-1 font-medium'>참석자</label>
        <Input
          placeholder='이름을 입력하거나 선택하여 참석자를 추가하세요'
          value={participantInput}
          onChange={(e) => setParticipantInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && participantInput.trim()) {
              e.preventDefault();
              const trimmed = participantInput.trim();
              if (!participant.includes(trimmed)) {
                setParticipant([...participant, trimmed]);
              }
              setParticipantInput('');
            }
          }}
        />
        <div className='mt-2 flex flex-wrap gap-2'>
          {participant.map((p, i) => (
            <span
              key={i}
              className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1'
            >
              {p}
              <button
                onClick={() =>
                  setParticipant(participant.filter((_, idx) => idx !== i))
                }
              >
                <TrashIcon className='w-3 h-3' />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 회의 일시 */}
      {/* <div>
        <label className='block text-sm mb-1 font-medium'>회의 일시</label>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          locale={ko}
        />
      </div> */}

      {/* 파일 업로드 */}
      {/* <div>
        <label className='block text-sm mb-1 font-medium'>첨부 파일</label>
        <Input type='file' multiple onChange={handleFileChange} />
        {fileList.length > 0 && (
          <ul className='mt-2 text-sm text-gray-600 space-y-1'>
            {fileList.map((f, i) => (
              <li key={i}>
                {f.name} ({(f.size / 1024 / 1024).toFixed(1)}MB)
              </li>
            ))}
          </ul>
        )}
      </div> */}

      {/* 본문 */}
      <div>
        <label className='block text-sm mb-1 font-medium'>회의 내용</label>
        <Textarea
          placeholder='회의 내용을 입력하세요...'
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* 저장 버튼 */}
      <div className='text-right'>
        <Button onClick={() => navigate('/notes')} variant='outline'>
          취소하기
        </Button>
        <Button onClick={handleSubmit} className='ml-3'>
          {mode === 'create' ? '저장하기' : '수정 완료'}
        </Button>
      </div>
    </div>
  );
}
