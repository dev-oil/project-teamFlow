import { createNote } from '@/api/notes';
import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';
import { useNavigate } from 'react-router-dom';

export function CreateNotePage() {
  const navigate = useNavigate();

  const handleSubmit = async (form: FormData) => {
    try {
      const note = await createNote(form);
      navigate('/notes'); // 작성 후 목록으로 이동
    } catch (err) {
      alert('회의록 작성 실패');
      console.error(err);
    }
  };

  return <MeetingNoteEditor mode='create' onSubmit={handleSubmit} />;
}
