import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export const useUpdateWorkspaceName = (workspaceId: number) => {
  const queryClient = useQueryClient();
  const { workspace, setWorkspace } = useWorkspaceStore();

  return useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch(`/api/workspaces/${workspaceId}/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error('이름 변경 실패');
      return { name: newName };
    },
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (workspace.id === workspaceId) setWorkspace({ ...workspace, name });
    },
  });
};
