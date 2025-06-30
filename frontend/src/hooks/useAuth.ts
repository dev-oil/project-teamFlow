import { useAuthStore } from '@/stores/useAuthStore';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitiailized = useAuthStore((state) => state.isInitiailized);
  return {
    isLoggedIn: Boolean(accessToken),
    isInitiailized,
  };
}
