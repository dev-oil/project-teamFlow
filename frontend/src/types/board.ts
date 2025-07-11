export type Boxtype = {
  id: string;
  workspaces_id: string;
  order: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Cardtype = {
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
  file?: File | undefined;
  created_at: string;
  updated_at: string;
};

export type BoxtypeWithCards = Boxtype & {
  cards: Cardtype[];
};
