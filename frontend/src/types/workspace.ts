export type Workspace = {
  id: number;
  users_id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceListItem = Pick<Workspace, 'id' | 'name'>;
