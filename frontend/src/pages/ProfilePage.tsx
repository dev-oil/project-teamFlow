import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from '@/api/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserStore } from '@/stores/useUserStore';
import {
  type UserProfile,
  type UpdateProfileData,
  type ChangePasswordData,
} from '@/types/user';

import { ProfileActionsSection } from './Profile/ProfileActionsSection';
import { ProfileAvatarSection } from './Profile/ProfileAvatarSection';
import { ProfileInfoSection } from './Profile/ProfileInfoSection';

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // 리렌더링
  const [, forceRender] = useState(0);

  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { clearAccessToken } = useAuthStore();

  const [editForm, setEditForm] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
  });

  // 프로필 불러오기
  const loadProfile = async () => {
    try {
      const userProfile = await fetchUserProfile();
      setProfile(userProfile);
      setEditForm({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
      });
      useUserStore.getState().setProfile(userProfile);
    } catch {
      toast.error('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 수정
  const handleProfileUpdate = async () => {
    try {
      const updated = await updateUserProfile(editForm);
      setProfile(updated);
      useUserStore.getState().setProfile(updated);
      setIsEditing(false);
      forceRender((n) => n + 1);
      toast.success('프로필이 성공적으로 수정되었습니다.');
    } catch {
      toast.error('프로필 수정에 실패했습니다.');
    }
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setIsChangingPassword(false);
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
    } catch {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };

  // 계정 삭제
  const handleAccountDelete = async () => {
    if (deleteConfirm !== '탈퇴') {
      toast.error('정확히 "탈퇴"를 입력해주세요.');
      return;
    }

    try {
      await deleteAccount();
      clearAccessToken();
      toast.success('계정이 삭제되었습니다.');
      navigate('/login');
    } catch {
      toast.error('계정 삭제에 실패했습니다.');
    }
  };

  // 이미지 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error('업로드 실패');
      const data = await res.json();

      setProfile((prev) =>
        prev ? { ...prev, profile_image: data.profile_image } : prev
      );
      toast.success('프로필 이미지가 변경되었습니다.');
    } catch {
      toast.error('이미지 업로드 실패');
    }
  };

  useEffect(() => {
    if (accessToken) loadProfile();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg'>로딩 중...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg text-red-500'>
          프로필 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            프로필
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <ProfileAvatarSection
            profile={profile}
            isEditing={isEditing}
            handleFileChange={handleFileChange}
          />
          <Separator />

          <ProfileInfoSection
            profile={profile}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
          />
          <Separator />

          <ProfileActionsSection
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            handlePasswordChange={handlePasswordChange}
            isChangingPassword={isChangingPassword}
            setIsChangingPassword={setIsChangingPassword}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            handleAccountDelete={handleAccountDelete}
            deleteConfirm={deleteConfirm}
            setDeleteConfirm={setDeleteConfirm}
            handleProfileUpdate={handleProfileUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
