export type Box = {
  id: string;
  workspaces_id: number;
  order: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Card = {
  id: string;
  boxes_id: string;
  order: number;
  pinned: boolean;
  title: string;
  color: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  assignee?:
    | {
        id: string;
        name: string;
        profile_image: string;
      }[]
    | null;
  file?: {
    id: number;
    file_name: string;
    file_path: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type Attachments = {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  type: string;
}[];
