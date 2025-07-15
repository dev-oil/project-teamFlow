import { Request } from 'express';
import { Files } from 'formidable';

export type Note = {
  id: number;
  users_id: number;
  workspaces_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  participant: string[];
  content?: string | null;
  file?: [];
  users?: {
    name: string;
  };
};

export type NoteFormRequest = Request & {
  fields: {
    title: string;
    content?: string;
    participant: string;
    file?: string;
  };
  files: Files;
};
