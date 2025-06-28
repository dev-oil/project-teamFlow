import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PendingGuest = {
  id: number;
  email: string;
  invited_at: string;
  token: string;
  expires_at: string;
};

type Props = {
  workspaceId: number;
  members: {
    role: 'host' | 'guest';
    user?: {
      email: string;
      name: string;
    };
  }[];
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  setInviteMessage: (msg: string) => void;
  setInviteError: (err: boolean) => void;
  setPendingGuests: React.Dispatch<React.SetStateAction<PendingGuest[]>>;
};

const TabInviteGuest = ({
  workspaceId,
  members,
  inviteEmail,
  setInviteEmail,
  setInviteMessage,
  setInviteError,
  setPendingGuests,
}: Props) => {
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInvite = async () => {
    if (!isValidEmail(inviteEmail)) {
      setInviteMessage('유효한 이메일 주소를 입력해주세요.');
      setInviteError(true);
      return;
    }

    try {
      // 이메일 존재 확인
      const checkRes = await fetch('/api/users/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const checkData = await checkRes.json();
      if (!checkData.exists) {
        setInviteMessage('Teamflow 존재하지 않는 회원입니다. 이메일을 확인해주세요.');
        setInviteError(true);
        return;
      }

      const host = members.find((m) => m.role === 'host');
      const fromEmail = host?.user?.email;
      const fromName = host?.user?.name;

      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromName,
          fromEmail,
          toEmail: inviteEmail,
          workspaceId,
        }),
      });

      if (!res.ok) throw new Error('초대 실패');
      const data = await res.json();

      setPendingGuests((prev) => [
        {
          id: Date.now(),
          email: inviteEmail,
          invited_at: new Date().toLocaleDateString('ko-KR'),
          expires_at: new Date(data.expires_at).toLocaleDateString('ko-KR'),
          token: data.token,
        },
         ...prev,

      ]);

      setInviteMessage(`${inviteEmail}로 초대장을 보냈습니다.`);
      setInviteEmail('');
      setInviteError(false);
    } catch (error) {
      console.error('초대 실패:', error);
      setInviteMessage('초대 처리 중 오류가 발생했습니다.');
      setInviteError(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="이메일 주소 입력"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <Button onClick={handleInvite}>초대</Button>
      </div>
    </div>
  );
};

export default TabInviteGuest;