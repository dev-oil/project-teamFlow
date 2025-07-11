//profileInfoSection.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UpdateProfileData, UserProfile } from '@/types/user';

type Props = {
  profile: Pick<UserProfile, 'name' | 'email' | 'phone'>;
  isEditing: boolean;
  editForm: UpdateProfileData;
  setEditForm: (form: UpdateProfileData) => void;
};

export function ProfileInfoSection({
  profile,
  isEditing,
  editForm,
  setEditForm,
}: Props) {
  if (!isEditing) {
    return (
      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>이름</h3>
          <div className='mt-1 text-lg'>{profile.name}</div>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>이메일</h3>
          <div className='mt-1 text-lg'>{profile.email}</div>
        </div>
        <div>
          <h3 className='text-sm font-medium text-gray-500'>전화번호</h3>
          <div className='mt-1 text-lg'>{profile.phone}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='grid w-full items-center gap-3'>
        <Label htmlFor='name'>이름</Label>
        <Input
          id='name'
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          placeholder='이름을 입력하세요'
        />
      </div>
      <div className='grid w-full items-center gap-3'>
        <Label htmlFor='email'>이메일</Label>
        <Input id='email' type='email' value={editForm.email} disabled />
      </div>
      <div className='grid w-full items-center gap-3'>
        <Label htmlFor='phone'>전화번호</Label>
        <Input
          id='phone'
          value={editForm.phone}
          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          placeholder='전화번호를 입력하세요'
        />
      </div>
    </div>
  );
}
