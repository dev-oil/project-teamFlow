export interface Box {
  id: string;
  workspaces_id: string;
  order: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  boxes_id: string;
  order: number;
  pinned: boolean;
  title: string;
  color: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  assignee: string | null;
  file: string | null;
  created_at: string;
  updated_at: string;
}
