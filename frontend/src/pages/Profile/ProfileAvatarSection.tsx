//profileAvatarSection.tsx 프로필 이미지 표시 및 업로드
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/types/user';

type Props = {
  profile: Pick<UserProfile, 'name' | 'profile_image'>;
  isEditing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ProfileAvatarSection({
  profile,
  isEditing,
  handleFileChange,
}: Props) {
  return (
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
  );
}
