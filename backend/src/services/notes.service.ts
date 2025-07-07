import { prisma } from '../db/prisma';

export const findNotesByWorkspace = async (
  userId: number,
  workspaceId: number
) => {
  return prisma.meeting_notes.findMany({
    where: {
       workspaces_id: workspaceId,
      users_id: userId,
    },
    include: {
      users: {
         select: { name: true },
      },
    },
     orderBy: { created_at: 'desc' },
  });
};

export const findNoteById = async (noteId: number) => {
  return prisma.meeting_notes.findUnique({ where: { id: noteId } });
};

export const createNote = async (data: {
  users_id: number;
    workspace_id: number;
  title: string;
  content?: string;
  participant: string[];
  file?: any[];
}) => {
   return prisma.meeting_notes.create({
    data: {
      users_id: data.users_id,
      workspaces_id: data.workspace_id,
      title: data.title,
      content: data.content,
      participant: data.participant,
      file: data.file,
    },
  });
};

export const updateNote = async (
  noteId: number,
  data: { title: string; content?: string; participant: any; file?: any }
) => {
  return prisma.meeting_notes.update({
    where: { id: noteId },
    data: { ...data, updated_at: new Date() },
  });
};

export const deleteNote = async (noteId: number) => {
  return prisma.meeting_notes.delete({ where: { id: noteId } });
};
