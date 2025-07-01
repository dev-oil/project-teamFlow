import { create } from 'zustand';

import type { WorkspaceListItem } from '@/types/workspace';

type WorkspaceState = {
  workspace: WorkspaceListItem | null;
  setWorkspace: (ws: WorkspaceListItem) => void;
  workspaceList: WorkspaceListItem[];
  setWorkspaceList: (list: WorkspaceListItem[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: null,
  setWorkspace: (ws) => set({ workspace: ws }),
  workspaceList: [],
  setWorkspaceList: (list) => set({ workspaceList: list }),
}));
