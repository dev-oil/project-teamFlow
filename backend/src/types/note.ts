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
