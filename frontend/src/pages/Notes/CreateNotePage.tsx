import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createNote } from '@/api/notes';
import { MeetingNoteEditor } from '@/components/Notes/MeetingNoteEditor';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function CreateNotePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { workspace } = useWorkspaceStore();
  const workspaceId = workspace.id;

  const handleSubmit = async (form: FormData) => {
    try {
      await createNote(accessToken!, workspaceId, form);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      navigate('/notes');
    } catch (err) {
      alert('회의록 작성 실패');
      console.error(err);
    }
  };

  return <MeetingNoteEditor mode='create' onSubmit={handleSubmit} />;
}
