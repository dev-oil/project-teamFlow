import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_image: string | null;
};

type Props = {
  user: User;
  isHost: boolean;
  workspaceId:number;
  onRemoveMember?: (userId: number) => void;
};

const PopoverMemberProfile = ({ user, isHost, onRemoveMember, workspaceId }: Props & { workspaceId: number }) => {
  const handleRemove = async () => {
    if (!onRemoveMember) return;

    const confirmed = window.confirm(`${user.name}님을 워크스페이스에서 추방하시겠습니까?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/members/${user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('추방 실패');

      onRemoveMember(user.id);
    } catch (error) {
      console.error('멤버 추방 실패:', error);
      alert('멤버 추방 중 오류가 발생했습니다.');
    }
  };


  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='flex items-center gap-2 cursor-pointer'>
          <Avatar className='h-8 w-8'>
            {user.profile_image ? (
              <AvatarImage src={user.profile_image} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            )}
          </Avatar>
          <span>{user.name}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side='right'
        sideOffset={8}
        className='w-80 p-4 space-y-4'
      >
        <div className='flex flex-col items-center'>
          <Avatar className='w-20 h-20'>
            {user.profile_image ? (
              <AvatarImage src={user.profile_image} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            )}
          </Avatar>
          <p className='text-lg font-semibold mt-2'>{user.name}</p>
          <p className='text-sm text-gray-600'>{user.email}</p>
          <p className='text-sm text-gray-600'>
            {user.phone || '전화번호 없음'}
          </p>
        </div>

        {isHost && (
          <Button
            variant='outline'
            className='w-full border-yellow-500 bg-yellow-400 text-white hover:bg-yellow-300"'
            onClick={handleRemove}
          >
            워크스페이스에서 추방하기
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PopoverMemberProfile;
