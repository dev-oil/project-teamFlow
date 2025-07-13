import { useAuthStore } from '@/stores/useAuthStore';

export const customFetch = async (
  input: RequestInfo,
  init?: RequestInit,
  retry = true
): Promise<Response> => {
  const accessToken = useAuthStore.getState().accessToken;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...(init?.headers || {}),
  } as Record<string, string>;

  if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  console.log({
    ...init,
    headers,
  });
  const response = await fetch(input, {
    ...init,
    headers,
  });

  // accessToken 만료 → 401 → refresh 시도
  if (response.status === 401 && retry) {
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      useAuthStore.getState().setAccessToken(data.accessToken);

      // 원래 요청 재시도
      return customFetch(input, init, false);
    } else {
      // refreshToken도 만료 → 로그인 필요
      useAuthStore.getState().clearAccessToken();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  return response;
};
