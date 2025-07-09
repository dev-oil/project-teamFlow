import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById, updateNote } from '@/api/notes';
import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function EditNotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const { workspace } = useWorkspaceStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const workspaceId = workspace.id;

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(accessToken!, workspaceId, Number(noteId)),
    enabled: !!noteId && !!workspaceId && !!accessToken,
  });

  const handleUpdate = async (form: FormData) => {
    await updateNote(accessToken!, workspaceId, Number(noteId), form);
  };

  if (isLoading || !note) return <div className='p-6'>불러오는 중...</div>;

  return (
    <MeetingNoteEditor
      mode='edit'
      defaultValue={note}
      onSubmit={handleUpdate}
    />
  );
}
