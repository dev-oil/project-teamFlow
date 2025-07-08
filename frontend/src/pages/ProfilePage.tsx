import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from '@/api/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { useAuthStore } from '@/stores/useAuthStore';
import {
  type UserProfile,
  type UpdateProfileData,
  type ChangePasswordData,
} from '@/types/user';

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  // 폼 상태
  const [editForm, setEditForm] = useState<UpdateProfileData>({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const { clearAccessToken } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 프로필 수정
  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = await updateUserProfile(editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
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
      clearAccessToken(); // 삭제 성공 후 토큰 제거
      toast.success('계정이 삭제되었습니다.');
      navigate('/login')
    } catch {
      toast.error('계정 삭제에 실패했습니다.');
    }
  };

  // 프로필 정보 로드
  const loadProfile = async () => {
    try {
      const userProfile = await fetchUserProfile();
      setProfile(userProfile);
      setEditForm({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
      });
    } catch {
      toast.error('프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  //이미지 변경
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('업로드 실패');

      const data = await res.json(); // ex: { profile_image: 'https://...' }
      setProfile((prev) =>
        prev ? { ...prev, profile_image: data.profile_image } : prev
      );
      toast.success('프로필 이미지가 변경되었습니다.');
    } catch {
      toast.error('이미지 업로드 실패');
    }
  };
  useEffect(() => {
    if (!accessToken) return;
    loadProfile();
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
          {/* 프로필 이미지 */}
          <div className='flex flex-col items-center space-y-4'>
            <Avatar className='w-24 h-24'>
              <AvatarImage
                src={profile.profile_image || undefined}
                alt={profile.name}
              />
              <AvatarFallback className='text-2xl'>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* 편집 모드일 때만 이미지 변경 버튼 */}
            {isEditing && (
              <>
                <Button asChild variant='outline' size='sm'>
                  <label htmlFor='file'>이미지 변경</label>
                </Button>
                <input
                  id='file'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <Separator />

          {/* 프로필 정보 */}
          <div className='space-y-4'>
            {!isEditing ? (
              // 읽기 전용 모드
              <div className='space-y-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-500'>
                    이름
                  </Label>
                  <div className='mt-1 text-lg'>{profile.name}</div>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-500'>
                    이메일
                  </Label>
                  <div className='mt-1 text-lg'>{profile.email}</div>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-500'>
                    전화번호
                  </Label>
                  <div className='mt-1 text-lg'>{profile.phone}</div>
                </div>
              </div>
            ) : (
              // 편집 모드
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='name'>이름</Label>
                  <Input
                    id='name'
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder='이름을 입력하세요'
                  />
                </div>
                <div>
                  <Label htmlFor='email'>이메일</Label>
                  <Input
                    id='email'
                    type='email'
                    value={editForm.email}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor='phone'>전화번호</Label>
                  <Input
                    id='phone'
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder='전화번호를 입력하세요'
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 액션 버튼들 */}
          <div className='flex flex-col space-y-3'>
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} className='w-full'>
                  프로필 수정하기
                </Button>

                <Dialog
                  open={isChangingPassword}
                  onOpenChange={setIsChangingPassword}
                >
                  <DialogTrigger asChild>
                    <Button variant='outline' className='w-full'>
                      비밀번호 변경하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>비밀번호 변경</DialogTitle>
                      <DialogDescription>
                        현재 비밀번호와 새로운 비밀번호를 입력해주세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='currentPassword'>현재 비밀번호</Label>
                        <Input
                          id='currentPassword'
                          type='password'
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder='현재 비밀번호'
                        />
                      </div>
                      <div>
                        <Label htmlFor='newPassword'>새 비밀번호</Label>
                        <Input
                          id='newPassword'
                          type='password'
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder='새 비밀번호'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setIsChangingPassword(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        비밀번호 변경
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                  <DialogTrigger asChild>
                    <Button variant='outline' className='text-red-600 w-full'>
                      탈퇴하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>계정 탈퇴</DialogTitle>
                      <DialogDescription>
                        정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수
                        없습니다.
                        <br />
                        계속하려면 아래에 "탈퇴"를 입력해주세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <Label htmlFor='deleteConfirm'>확인 입력</Label>
                      <Input
                        id='deleteConfirm'
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder='탈퇴'
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant='outline'
                        onClick={() => setIsDeleting(false)}
                      >
                        취소
                      </Button>
                      <Button
                        variant='outline'
                        className='text-red-600'
                        onClick={handleAccountDelete}
                      >
                        계정 삭제
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              // 편집 모드 버튼들
              <div className='flex space-x-3'>
                <Button
                  variant='outline'
                  onClick={() => setIsEditing(false)}
                  className='flex-1'
                >
                  취소
                </Button>
                <Button onClick={handleProfileUpdate} className='flex-1'>
                  저장
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
