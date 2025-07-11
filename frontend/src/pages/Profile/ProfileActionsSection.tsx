//ProfileActionSection.tsx

import { Button } from '@/components/ui/button';
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

type Props = {
   isEditing: boolean;
  setIsEditing: (edit: boolean) => void;

  passwordForm: { currentPassword: string; newPassword: string };
  setPasswordForm: (form: { currentPassword: string; newPassword: string }) => void;
  handlePasswordChange: () => void;
  isChangingPassword: boolean;
  setIsChangingPassword: (open: boolean) => void;

  isDeleting: boolean;
  setIsDeleting: (open: boolean) => void;
  handleAccountDelete: () => void;
  deleteConfirm: string;
  setDeleteConfirm: (val: string) => void;

  handleProfileUpdate: () => void;
};

export function ProfileActionsSection({
  isEditing,
  setIsEditing,
  passwordForm,
  setPasswordForm,
  handlePasswordChange,
  isChangingPassword,
  setIsChangingPassword,
  isDeleting,
  setIsDeleting,
  handleAccountDelete,
  deleteConfirm,
  setDeleteConfirm,
  handleProfileUpdate,
}: Props) {
  if (isEditing) {
    return (
      <div className='flex space-x-3'>
        <Button
          variant='outline'
          onClick={() => setIsEditing(false)}
          className='flex-1'
        >
          취소
        </Button>
        <Button onClick={handleProfileUpdate}  className='flex-1'>
          저장
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col space-y-3'>
      <Button onClick={() => setIsEditing(true)} className='w-full'>
        프로필 수정하기
      </Button>

      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
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
            <div className='grid w-full items-center gap-3'>
              <Label htmlFor='currentPassword'>현재 비밀번호</Label>
              <Input
                id='currentPassword'
                type='password'
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder='현재 비밀번호'
              />
            </div>
            <div className='grid w-full items-center gap-3'>
              <Label htmlFor='newPassword'>새 비밀번호</Label>
              <Input
                id='newPassword'
                type='password'
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder='새 비밀번호'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsChangingPassword(false)}>
              취소
            </Button>
            <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
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
              정말로 계정을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              <br />
              계속하려면 아래에 "탈퇴"를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className='grid w-full items-center gap-3'>
            <Label htmlFor='deleteConfirm'>확인 입력</Label>
            <Input
              id='deleteConfirm'
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder='탈퇴'
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleting(false)}>
              취소
            </Button>
            <Button variant='outline' className='text-red-600' onClick={handleAccountDelete}>
              계정 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}