import { customFetch } from '@/lib/customFetch';
import type { Note } from '@/types/note';

export const fetchNotes = async (
  accessToken: string,
  workspaceId: number
): Promise<Note[]> => {
  const res = await customFetch(`/api/workspace/${workspaceId}/notes`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('회의록 불러오기 실패');
  return await res.json();
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const res = await fetch(`/api/1/workspace/1/notes/${id}`);
  if (!res.ok) throw new Error('회의록 상세 불러오기 실패');
  return res.json();
};

export const createNote = async (form: FormData): Promise<Note> => {
  const res = await fetch(`/api/1/workspace/1/notes`, {
    // 임시로 1 넣어두었습니다.
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error('회의록 작성 실패');
  return res.json();
};

export const updateNote = async (
  noteId: number,
  form: FormData
): Promise<Note> => {
  const res = await fetch(`/api/1/workspace/1/notes/${noteId}`, {
    // 임시로 1 넣어두었습니다.
    method: 'PUT',
    body: form,
  });

  if (!res.ok) throw new Error('회의록 수정 실패');
  return res.json();
};
