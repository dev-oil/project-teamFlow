//frontend/api/user.ts
import type { UserProfile, UpdateProfileData, ChangePasswordData } from '@/types/user';

/** 프로필 조회 */
export const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
  console.log(accessToken);
  const res = await fetch('/api/profile', {
      headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('프로필 정보 불러오기 실패');
  return res.json();
};

/** 프로필 수정 */
export const updateUserProfile = async (
  accessToken: string,
  data: UpdateProfileData
): Promise<UserProfile> => {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('프로필 수정 실패');
  return res.json();
};

/** 비밀번호 변경 */
export const changePassword = async (
  accessToken: string,  
  data: ChangePasswordData
): Promise<void> => {
  const res = await fetch('/api/change-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('비밀번호 변경 실패');
};

/** 탈퇴 */
export const deleteAccount = async (accessToken: string): Promise<void> => {
  const res = await fetch('/api/delete-account', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('탈퇴 실패');
};