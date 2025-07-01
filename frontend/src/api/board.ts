// api/board.ts
import type { Boxtype } from '@/types/board';

export async function fetchBoard(): Promise<{
  workspaces_id: string;
  boxes: Boxtype[];
}> {
  const res = await fetch('/api/board?workspaces_id=ws-1');
  if (!res.ok) throw new Error('보드 데이터 불러오기 실패');
  return res.json();
}
