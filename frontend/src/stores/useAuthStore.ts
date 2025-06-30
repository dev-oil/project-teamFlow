import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  isInitiailized: boolean;
  setAccessToken: (token: string) => void;
  setIsInitiailized: (init: boolean) => void;
  clearAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isInitiailized: false,
  setAccessToken: (token) => set({ accessToken: token }),
  setIsInitiailized: (init) => set({ isInitiailized: init }),
  clearAccessToken: () => set({ accessToken: null }),
}));
