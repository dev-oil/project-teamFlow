import { Request, Response } from 'express';
import * as notesService from '../services/notes.service';
import { NoteFormRequest } from '../types/note';

export const getNotes = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user!.userId;

  try {
    const notes = await notesService.findNotesByWorkspace(userId, workspaceId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: '노트 목록을 불러오지 못했습니다.' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  const noteId = Number(req.params.noteId);

  try {
    const note = await notesService.findNoteById(noteId);
    if (!note) res.status(404).json({ error: '노트를 찾을 수 없습니다.' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: '노트를 가져오지 못했습니다.' });
  }
};

export const createNote = async (req: NoteFormRequest, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = req.user!.userId;

  const {
    title,
    content,
    participant: participantStr,
    file: fileStr,
  } = req.fields;

  if (!userId || !workspaceId || !title || !participantStr) {
    return res.status(400).json({ error: '필수 정보 누락' });
  }

  const participant = JSON.parse(participantStr || '[]');
  const file = fileStr ? JSON.parse(fileStr) : [];

  try {
    const newNote = await notesService.createNote({
      users_id: userId,
      workspace_id: workspaceId,
      title,
      content,
      participant,
      file,
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error('노트 생성 실패:', error);
    res.status(500).json({ error: '노트 생성 실패' });
  }
};

export const updateNote = async (req: NoteFormRequest, res: Response) => {
  const noteId = Number(req.params.noteId);

  const {
    title,
    content,
    participant: participantStr,
    file: fileStr,
  } = req.fields;

  const participant = JSON.parse(participantStr || '[]');
  const file = fileStr ? JSON.parse(fileStr) : [];

  try {
    const updatedNote = await notesService.updateNote(noteId, {
      title,
      content,
      participant,
      file,
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: '노트 수정 실패' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId = Number(req.params.noteId);

  try {
    await notesService.deleteNote(noteId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: '노트 삭제 실패' });
  }
};
