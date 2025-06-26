import type { Note } from '@/types/note';

export const fetchNotes = async (workspace: string): Promise<Note[]> => {
  const res = await fetch(`/api/notes?workspace=${workspace}`);
  if (!res.ok) throw new Error('회의록 불러오기 실패');
  return res.json();
};
