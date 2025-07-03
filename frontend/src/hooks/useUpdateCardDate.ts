// 캘린더 (카드 일정 수정) hooks/useUpdateCardDate.ts
import { useMutation } from '@tanstack/react-query';

type UpdateCardDateArgs = {
  workspaceId: number;
  cardId: number;
  start: Date;
  end: Date;
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
        body: JSON.stringify({ start, end }),
      });

      if (!res.ok) throw new Error('일정 수정 실패');
      return res.json();
    },
  });
};