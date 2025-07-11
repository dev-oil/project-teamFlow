// 캘린더 (카드 일정 수정) hooks/useUpdateCardDate.ts
import { useMutation } from '@tanstack/react-query';

type UpdateCardDateArgs = {
  workspaceId: number;
   cardId: string;
  start: string;
  end: string;
  accessToken: string;
};

export const useUpdateCardDate = () => {
  return useMutation({
    mutationFn: async ({ workspaceId, cardId, start, end, accessToken }: UpdateCardDateArgs) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          start: start.slice(0, 10),
          end: end.slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error('일정 수정 실패');
      return res.json();
    },
  });
};