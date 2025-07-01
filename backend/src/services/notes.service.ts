import { prisma } from '../db/prisma';

export const findNotesByWorkspace = async (workspaceId: number) => {
  return prisma.meeting_notes.findMany({
    where: {
      users: {
        members: {
          some: { workspaces_id: workspaceId },
        },
      },
    },
    orderBy: { created_at: 'desc' },
    include: {
      users: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const findNoteById = async (noteId: number) => {
  return prisma.meeting_notes.findUnique({ where: { id: noteId } });
};

export const createNote = async (data: {
  users_id: number;
  title: string;
  content?: string;
  participant: any;
  file?: any;
}) => {
  return prisma.meeting_notes.create({ data });
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
