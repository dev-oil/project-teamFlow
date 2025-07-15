import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { updateNote } from '@/api/notes';

export const useUpdateNote = (
  accessToken: string,
  workspaceId: number,
  noteId: number
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (form: FormData) =>
      updateNote(accessToken, workspaceId, noteId, form),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', workspaceId] });
      navigate('/notes');
    },

    onError: (err) => {
      console.error('회의록 수정 실패', err);
      alert('회의록 수정 실패');
    },
  });
};
