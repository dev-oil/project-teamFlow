export type Workspace = {
  id: number;
  users_id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

// + role 추가
export type WorkspaceListItem = Pick<Workspace, 'id' | 'name'> & {
  role?: 'host' | 'guest'; // 선택적 필드
};
