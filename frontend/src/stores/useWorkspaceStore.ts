import { create } from 'zustand';

import type { WorkspaceListItem } from '@/types/workspace';

type WorkspaceState = {
  workspace: string;
  setWorkspace: (ws: string) => void;
  workspaceList: WorkspaceListItem[];
  setWorkspaceList: (list: WorkspaceListItem[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: '',
  setWorkspace: (ws) => set({ workspace: ws }),
  workspaceList: [],
  setWorkspaceList: (list) => set({ workspaceList: list }),
}));
