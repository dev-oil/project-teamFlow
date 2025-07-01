import type { WorkspaceListItem } from '@/types/workspace';

export const fetchWorkspaces = async (): Promise<WorkspaceListItem[]> => {
  const res = await fetch('/api/1/workspace'); // 임시로 1 넣어두었습니다.
  if (!res.ok) throw new Error('워크스페이스 불러오기 실패');
  return res.json();
};
