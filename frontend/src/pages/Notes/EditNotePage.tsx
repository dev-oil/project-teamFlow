import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { fetchNoteById } from '@/api/notes';
import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';
import { useUpdateNote } from '@/hooks/notes/useUpdateNote';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function EditNotePage() {
  const { noteId } = useParams<{ noteId: string }>();
  const { accessToken } = useAuthStore();
  const { workspace } = useWorkspaceStore();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(accessToken!, workspace.id, Number(noteId)),
    enabled: !!noteId && !!workspace.id && !!accessToken,
  });

  const mutation = useUpdateNote(accessToken!, workspace.id, Number(noteId));

  if (isLoading || !note) return <div>불러오는 중...</div>;

  return (
    <MeetingNoteEditor
      mode='edit'
      defaultValue={note}
      onSubmit={(form) => mutation.mutate(form)}
    />
  );
}
