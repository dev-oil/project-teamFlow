import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createNote } from '@/api/notes';

export const useCreateNote = (accessToken: string, workspaceId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (form: FormData) => createNote(accessToken, workspaceId, form),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', workspaceId] });
      navigate('/notes');
    },

    onError: (err) => {
      console.error('회의록 작성 실패', err);
      alert('회의록 작성 실패');
    },
  });
};
