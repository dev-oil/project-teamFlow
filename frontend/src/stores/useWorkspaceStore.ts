// src/stores/useWorkspaceStore.ts
import { create } from 'zustand';

type WorkspaceState = {
  workspace: string;
  setWorkspace: (ws: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspace: '기본 워크스페이스', // 기본값
  setWorkspace: (ws) => set({ workspace: ws }),
}));
