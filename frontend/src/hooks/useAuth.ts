import { useAuthStore } from '@/stores/useAuthStore';

export function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return {
    isLoggedIn: Boolean(accessToken),
  };
}
