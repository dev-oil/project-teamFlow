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

export const fetchNoteById = async (
  accessToken: string,
  workspaceId: number,
  noteId: number
): Promise<Note> => {
  const res = await fetch(`/api/workspace/${workspaceId}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('회의록 상세 불러오기 실패');
  return res.json();
};

export const createNote = async (
  accessToken: string,
  workspaceId: number,
  form: FormData
): Promise<Note> => {
  const res = await fetch(`/api/workspace/${workspaceId}/notes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error('회의록 작성 실패');
  return res.json();
};

export const updateNote = async (
  accessToken: string,
  workspaceId: number,
  noteId: number,
  form: FormData
): Promise<Note> => {
  const res = await fetch(`/api/workspace/${workspaceId}/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) throw new Error('회의록 수정 실패');
  return res.json();
};

export const deleteNote = async (
  accessToken: string,
  workspaceId: number,
  noteId: number
): Promise<void> => {
  const res = await fetch(`/api/workspace/${workspaceId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('회의록 삭제 실패');
};
