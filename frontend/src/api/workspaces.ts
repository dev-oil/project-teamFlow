import type { WorkspaceListItem } from '@/types/workspace';

export const fetchWorkspaces = async (
  accessToken: string
): Promise<WorkspaceListItem[]> => {
  const res = await fetch('/api/workspaces', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('워크스페이스 불러오기 실패');
  return res.json();
};
