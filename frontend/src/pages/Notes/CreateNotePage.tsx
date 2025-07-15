import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';
import { useCreateNote } from '@/hooks/notes/useCreateNote';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function CreateNotePage() {
  const { accessToken } = useAuthStore();
  const { workspace } = useWorkspaceStore();

  const mutation = useCreateNote(accessToken!, workspace.id);

  return (
    <MeetingNoteEditor
      mode='create'
      onSubmit={(form) => mutation.mutate(form)}
    />
  );
}
