// src/hooks/useAuthInitializer.ts
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';

export function useAuthInitializer() {
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          useAuthStore.getState().setAccessToken(data.accessToken);
        } else {
          useAuthStore.getState().clearAccessToken();
        }
      } catch {
        useAuthStore.getState().clearAccessToken();
      } finally {
        useAuthStore.getState().setIsInitiailized(true);
      }
    };

    tryRefresh();
  }, []);
}
