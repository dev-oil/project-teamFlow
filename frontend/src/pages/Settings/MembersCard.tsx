import { useEffect, useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TabInviteGuest from './TabInviteGuest';
import TabMemberList from './TabMemberList';
import TabPendingGuest from './TabPendingGuest';

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
};

type Member = {
  id: number;
  users_id: number;
  workspaces_id: number;
  role: 'host' | 'guest';
  user?: User;
};

type PendingGuest = {
  id: number;
  email: string;
  invited_at: string;
  token: string;
  expires_at: string;
};

type Props = {
  isHost: boolean;
  workspaceId: number;
};

const MembersCard = ({ isHost, workspaceId }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingGuests, setPendingGuests] = useState<PendingGuest[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/members`);
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error('멤버 불러오기 오류:', err);
      }
    };

    const fetchPendingGuests = async () => {
      try {
        const res = await fetch(`/api/invite/${workspaceId}/pending`);
        const data = await res.json();
        const formatted = data.pending.map((item: PendingGuest) => ({
          ...item,
          invited_at: new Date(item.invited_at).toLocaleDateString('ko-KR'),
          expires_at: new Date(item.expires_at).toLocaleDateString('ko-KR'),
        }));
        setPendingGuests(formatted);
      } catch (err) {
        console.error('대기중 초대 불러오기 오류:', err);
      }
    };

    fetchMembers();
    fetchPendingGuests();
  }, [workspaceId]);

  // 초대 삭제
  const handleDeleteInvitation = async (token: string) => {
    try {
      await fetch(`/api/invite/${token}`, { method: 'DELETE' });
      setPendingGuests((prev) => prev.filter((g) => g.token !== token));
    } catch (err) {
      console.error('초대 삭제 오류:', err);
    }
  };

  // 다시 초대
  const handleResendInvite = async (email: string) => {
    try {
      const hostMember = members.find((m) => m.role === 'host');
      const fromEmail = hostMember?.user?.email;
      const fromName = hostMember?.user?.name;

      const res = await fetch('/api/invite/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, workspaceId, fromName, fromEmail }),
      });

      if (!res.ok) throw new Error('다시 초대 실패');

      const data = await res.json();
      setPendingGuests((prev) =>
        prev.map((g) =>
          g.email === email
            ? {
                ...g,
                invited_at: new Date().toLocaleDateString('ko-KR'),
                expires_at: new Date(data.expires_at).toLocaleDateString(
                  'ko-KR'
                ),
              }
            : g
        )
      );
      setInviteMessage(`${email}로 초대장을 다시 보냈습니다.`);
      setInviteError(false);
    } catch (error) {
      console.error('다시 초대 오류:', error);
      setInviteMessage('다시 초대 처리 중 오류가 발생했습니다.');
      setInviteError(true);
    }
  };

  return (
    <Card className='flex flex-col h-[500px]'>
      <CardHeader>
        <CardTitle>멤버 정보 ({members.length}명)</CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        {isHost ? (
          <Tabs defaultValue='members' className='flex flex-col h-full'>
            <TabsList className='grid grid-cols-3 w-full'>
              <TabsTrigger value='members'>참여중인 멤버</TabsTrigger>
              <TabsTrigger value='invite'>게스트 초대</TabsTrigger>
              <TabsTrigger value='pending'>대기중인 게스트</TabsTrigger>
            </TabsList>

            <TabsContent value='members' className='flex-1 mt-4'>
              <TabMemberList
                members={members}
                isHost={isHost}
                workspaceId={workspaceId}
                onRemoveMember={(userId) => {
                  setMembers((prev) =>
                    prev.filter((m) => m.user?.id !== userId)
                  );
                }}
              />
            </TabsContent>

            <TabsContent value='invite' className='flex-1 mt-4'>
              <TabInviteGuest
                members={members}
                inviteEmail={inviteEmail}
                setInviteEmail={setInviteEmail}
                setInviteMessage={setInviteMessage}
                setInviteError={setInviteError}
                setPendingGuests={setPendingGuests}
                workspaceId={workspaceId}
              />
              {inviteMessage && (
                <p
                  className={`text-sm mt-2 ${inviteError ? 'text-red-500' : 'text-green-600'}`}
                >
                  {inviteMessage}
                </p>
              )}
            </TabsContent>

            <TabsContent value='pending' className='flex-1 mt-4'>
              <ScrollArea className='h-[300px]'>
                <TabPendingGuest
                  guests={pendingGuests}
                  onDelete={handleDeleteInvitation}
                  onResend={handleResendInvite}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <ScrollArea className='h-[300px]'>
            <TabMemberList
              members={members}
              isHost={isHost}
              workspaceId={workspaceId}
              onRemoveMember={(userId) => {
                setMembers((prev) => prev.filter((m) => m.user?.id !== userId));
              }}
            />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MembersCard;
