import { Request, Response } from 'express';
import type { Note } from '../types/note';

const notes: Note[] = [
  {
    id: 123123,
    noteId: 932433,
    title: '디자인 회의',
    author: '민수',
    workspace: '기본 워크스페이스',
    createdAt: '2025-06-21T10:00:00.000Z',
  },
  {
    id: 2342353,
    noteId: 93243323,
    title: '디자인 회의',
    author: '민수',
    workspace: '기본 워크스페이스',
    createdAt: '2025-06-21T10:00:00.000Z',
  },
  {
    id: 3495809485,
    noteId: 9334,
    title: '기획 회의',
    author: '지은',
    workspace: '나의 워크스페이스 1',
    createdAt: '2025-06-20T15:30:00.000Z',
  },
];

export function getNotes(req: Request, res: Response): void {
  const { workspace } = req.query;

  if (!workspace || typeof workspace !== 'string') {
    res.status(400).json({ message: '워크스페이스 이름이 필요합니다.' });
    return;
  }

  const filtered = notes.filter((note) => note.workspace === workspace);
  res.json(filtered);
}
