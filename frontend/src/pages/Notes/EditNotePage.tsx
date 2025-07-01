// EditNotePage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/api/notes'; // 따로 만들어야 함
import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';

export function EditNotePage() {
  const { noteId } = useParams<{ noteId: string }>();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(Number(noteId)),
    enabled: !!noteId,
  });

  if (isLoading || !note) return <div className='p-4'>불러오는 중...</div>;

  const handleUpdate = async (form: FormData) => {
    // updateNote(note.id, form) 호출 등
  };

  return (
    <MeetingNoteEditor
      mode='edit'
      defaultValue={note}
      onSubmit={handleUpdate}
    />
  );
}
