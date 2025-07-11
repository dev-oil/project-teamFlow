import { useEffect } from 'react';

import { fetchUserProfile } from '@/api/user';
import { useUserStore } from '@/stores/useUserStore';

import { useAuth } from './useAuth';

export function useProfileInit() {
  const { isLoggedIn, isInitiailized } = useAuth();

  useEffect(() => {
    const tryGetProfile = async () => {
      try {
        // 로그인 완료된 경우에만 profile 요청
        if (isLoggedIn) {
          const res = await fetchUserProfile();
          useUserStore.getState().setProfile(res);
        }
      } catch (e) {
        console.error('프로필 불러오기 실패', e);
      }
    };

    // 초기화 되기 전엔 아무 것도 하지 않기
    if (isInitiailized) {
      tryGetProfile();
    }
  }, [isInitiailized, isLoggedIn]);
}
