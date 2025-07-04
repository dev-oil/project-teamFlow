import { create } from 'zustand';

import type { WorkspaceListItem } from '@/types/workspace';

type WorkspaceState = {
  workspace: WorkspaceListItem;
  setWorkspace: (ws: WorkspaceListItem) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: { id: 0, name: '', created_at: '', updated_at: '' },
  setWorkspace: (ws) => set({ workspace: ws }),
}));


