import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataTable } from '@/components/Settings/data-table';
import { columns } from '@/components/Settings/columns';
import { exampleMembers, exampleWorkspace } from '@/data/dummyData';

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
  invitedAt: string;
  token: string;
  expiresAt: string;
};

type Props = {
  isHost: boolean;
};

const MembersCard = ({ isHost }: Props) => {
  const [members] = useState<Member[]>(exampleMembers as Member[]);
  const [pendingGuests, setPendingGuests] = useState<PendingGuest[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteGuest = async () => {
    if (!isValidEmail(inviteEmail)) {
      setInviteMessage('유효한 이메일 주소를 입력해주세요.');
      setInviteError(true);
      return;
    }

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          workspaceId: exampleWorkspace.id,
        }),
      });

      if (!response.ok) throw new Error('초대 실패');

      const data = await response.json();
      setPendingGuests([
        ...pendingGuests,
        {
          id: Date.now(),
          email: inviteEmail,
          invitedAt: new Date().toLocaleDateString(),
          expiresAt: new Date(data.expiresAt).toLocaleDateString('ko-KR'),
          token: data.token,
        },
      ]);

      setInviteMessage(`${inviteEmail}로 초대장을 보냈습니다.`);
      setInviteEmail('');
      setInviteError(false);
    } catch (error) {
      console.error('초대 오류:', error);
      setInviteMessage('초대 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>멤버 정보 ({members.length}명)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isHost ? (
          <Tabs defaultValue="members" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="members">참여중인 멤버</TabsTrigger>
              <TabsTrigger value="invite">게스트 초대</TabsTrigger>
              <TabsTrigger value="pending">대기중인 게스트</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="flex-1 mt-4">
              <ScrollArea className="h-[300px]">
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
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={m.user?.profile_image || undefined} />
                              <AvatarFallback>{m.user?.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{m.user?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={m.role === 'host' ? 'default' : 'secondary'}>
                            {m.role === 'host' ? '호스트' : '게스트'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="invite" className="flex-1 mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="이메일 주소 입력"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button onClick={handleInviteGuest}>초대</Button>
                </div>
                {inviteMessage && (
                  <p className={`text-sm ${inviteError ? 'text-red-500' : 'text-green-600'}`}>
                    {inviteMessage}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="flex-1 mt-4">
              <ScrollArea className="h-[300px]">
                <DataTable columns={columns} data={pendingGuests} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          <ScrollArea className="h-[300px]">
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
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={m.user?.profile_image || undefined} />
                          <AvatarFallback>{m.user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{m.user?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.role === 'host' ? 'default' : 'secondary'}>
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
