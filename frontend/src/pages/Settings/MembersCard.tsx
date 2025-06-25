import { useState, useEffect } from 'react';

import { columns } from '@/components/Settings/columns';
import { DataTable } from '@/components/Settings/data-table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    //대기중 초대 리스트 불러오기
    const fetchPendingGuests = async () => {
      try {
        const res = await fetch(
          `/api/invitations/${workspaceId}/pending`
        );
        if (!res.ok) throw new Error('초대 리스트 불러오기 실패');

        const data = await res.json();
        const formatted: PendingGuest[] = data.pending.map(
          (item: PendingGuest) => ({
            id: item.id,
            email: item.email,
            invited_at: new Date(item.invited_at).toLocaleDateString('ko-KR'),
            expires_at: new Date(item.expires_at).toLocaleDateString('ko-KR'),
            token: item.token,
          })
        );
        setPendingGuests(formatted);
      } catch (err) {
        console.error('대기중 초대 불러오기 오류:', err);
      }
    };

    fetchPendingGuests();

    //멤버 리스트 불러오기
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/members`);
        if (!res.ok) throw new Error('멤버 리스트 불러오기 실패');
        const data = await res.json();
        setMembers(data); // API 응답이 배열임
      } catch (err) {
        console.error('멤버 불러오기 오류:', err);
      }
    };
    fetchMembers();
  }, [workspaceId]);

  const handleInviteGuest = async () => {
    if (!isValidEmail(inviteEmail)) {
       setInviteMessage('유효한 이메일 주소를 입력해주세요.');
      setInviteError(true);
      return;
    }
 
    try {
       // ✅ 이메일 존재 여부 확인
    const checkRes = await fetch('/api/users/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    });

    if (!checkRes.ok) {
      const text = await checkRes.text();
      console.error('check-email 응답 오류:', text);
      setInviteMessage('이메일 확인 중 서버 오류가 발생했습니다.');
      setInviteError(true);
      return;
    }

    const checkData = await checkRes.json();
    if (!checkData.exists) {
      setInviteMessage('Teamflow 존재하지 않는 회원입니다. 이메일을 확인해주세요');
      setInviteError(true);
      return;
    }

    const hostMember = members.find((m) => m.role === 'host');
    const fromEmail = hostMember?.user?.email;
    const fromName = hostMember?.user?.name;

       const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromName,
          fromEmail,
          toEmail: inviteEmail,
          workspaceId: workspaceId,
        }),
      });

      if (!response.ok) throw new Error('초대 실패');

      const data = await response.json();
      setPendingGuests([
        {
          id: Date.now(),
          email: inviteEmail,
          invited_at: new Date().toLocaleDateString(),
          expires_at: new Date(data.expires_at).toLocaleDateString('ko-KR'),
          token: data.token,
        },
        ...pendingGuests,
      ]);

      setInviteMessage(`${inviteEmail}로 초대장을 보냈습니다.`);
      setInviteEmail('');
      setInviteError(false);
    } catch (error) {
      console.error('초대 오류:', error);
      setInviteMessage('초대 처리 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteInvitation = async (token: string) => {
    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('초대 삭제 실패');

      setPendingGuests((prev) => prev.filter((guest) => guest.token !== token));
    } catch (err) {
      console.error('초대 삭제 오류:', err);
    }
  };

  const handleResendInvite = async (email: string) => {
    try {
      const hostMember = members.find((m) => m.role === 'host');
      const fromEmail = hostMember?.user?.email;
      const fromName = hostMember?.user?.name;

      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromName,
          fromEmail,
          toEmail: email,
          workspaceId: workspaceId,
        }),
      });

      if (!response.ok) throw new Error('다시 초대 실패');

      const data = await response.json();
      
      // 기존 초대를 삭제하고 새로운 초대로 교체
      setPendingGuests((prev) => 
        prev.map((guest) => 
          guest.email === email 
            ? {
                ...guest,
                invited_at: new Date().toLocaleDateString('ko-KR'),
                expires_at: new Date(data.expires_at).toLocaleDateString('ko-KR'),
                token: data.token,
              }
            : guest
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
              <ScrollArea className='h-[300px]'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>멤버</TableHead>
                      <TableHead>역할</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage
                                src={m.user?.profile_image || undefined}
                              />
                              <AvatarFallback>{m.user?.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{m.user?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              m.role === 'host' ? 'default' : 'secondary'
                            }
                          >
                            {m.role === 'host' ? '호스트' : '게스트'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='invite' className='flex-1 mt-4'>
              <div className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    type='email'
                    placeholder='이메일 주소 입력'
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button onClick={handleInviteGuest}>초대</Button>
                </div>
                {inviteMessage && (
                  <p
                    className={`text-sm ${inviteError ? 'text-red-500' : 'text-green-600'}`}
                  >
                    {inviteMessage}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value='pending' className='flex-1 mt-4'>
              <ScrollArea className='h-[300px]'>
                <DataTable
                  columns={columns({
                    onDelete: handleDeleteInvitation,
                    resendInvite: handleResendInvite,
                  })}
                  data={pendingGuests}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <ScrollArea className='h-[300px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>멤버</TableHead>
                  <TableHead>역할</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage
                            src={m.user?.profile_image || undefined}
                          />
                          <AvatarFallback>{m.user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{m.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={m.role === 'host' ? 'default' : 'secondary'}
                      >
                        {m.role === 'host' ? '호스트' : '게스트'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MembersCard;
