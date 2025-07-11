// src/hooks/useAuthInitializer.ts
import { useEffect } from 'react';

import { fetchUserProfile } from '@/api/user';
import { useUserStore } from '@/stores/useUserStore';

export function useProfileInit() {
  useEffect(() => {
    const tryGetProfile = async () => {
      const res = await fetchUserProfile();
      useUserStore.getState().setProfile(res);
    };

    tryGetProfile();
  }, []);
}
