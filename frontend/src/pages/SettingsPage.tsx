import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

import { columns } from '@/components/Settings/columns';
import { DataTable } from'@/components/Settings/data-table';

import { exampleWorkspace, exampleMembers } from '../data/dummyData';

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: number;
  users_id: number;
  workspaces_id: number;
  role: 'host' | 'guest';
  user?: User;
}
interface PendingGuest {
  id: number;
  email: string;
  invitedAt: string;
  token: string;
  expiresAt: string;
}

export const SettingsPage: React.FC = () => {
  // 예시 데이터
  const [workspaceName, setWorkspaceName] = useState(exampleWorkspace.name);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState(
    exampleWorkspace.name
  );
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState(false);

  const [pendingGuests, setPendingGuests] = useState<PendingGuest[]>([{
    id: 999,
    email: "expired@example.com",
    invitedAt: "2025.06.15",
    expiresAt: "2025.06.16", // ⏰ 현재(6/17)보다 이전이라 만료됨
    token: "dummy-token",
  },
{
    id: 998,
    email: "sd@example.com",
    invitedAt: "2025.06.15",
    expiresAt: "2025.06.21", // ⏰ 현재(6/17)보다 이전이라 만료됨
    token: "dummy-token",
  }]);
  const [members] = useState<Member[]>(exampleMembers as Member[]);
  const [isHost] = useState(true);
  //const [isHost] = useState(false); // 게스트 화면을 보기 위해 false로 설정

  const handleWorkspaceNameUpdate = () => {
    setWorkspaceName(newWorkspaceName);
    setIsEditing(false);
  };

  // 이메일 정규식 함수 정의
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteGuest = async () => {
    if (inviteEmail) {
      // 정규식 검사 추가
      if (!isValidEmail(inviteEmail)) {
        setInviteMessage('유효한 이메일 주소를 입력해주세요.');
        setInviteError(true);
        return;
      }

      try {
        // 토큰 API 호출로 변경
        const response = await fetch('/api/invitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: inviteEmail,
            workspaceId: exampleWorkspace.id,
          }),
        });

        if (!response.ok) throw new Error('초대 실패');

        // 백엔드에서 초대 정보(예: email, expiresAt 등)를 응답으로 내려주면 사용
        const data = await response.json();

        // 대기 중인 게스트 목록 갱신
        setPendingGuests([
          ...pendingGuests,
          {
            id: Date.now(),
            email: inviteEmail,
            invitedAt: new Date().toLocaleDateString(),
            token: data.token, // 백엔드에서 내려준 값
            expiresAt: new Date(data.expiresAt).toLocaleDateString('ko-KR'), // 백엔드에서 내려준 값
          },
        ]);
        setInviteMessage(`${inviteEmail}로 워크스페이스 초대장을 보냈습니다.`);
        setInviteEmail('');
        setInviteError(false);
      } catch (error) {
        console.error('초대 처리 중 오류 발생:', error);
        setInviteMessage('초대 처리 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteWorkspace = () => {
    console.log('워크스페이스 삭제');
  };

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold mb-6'>
        {isHost ? '워크스페이스 설정' : '워크스페이스 정보'}
      </h1>

      {/* 워크스페이스 이름 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>워크스페이스 이름</CardTitle>
        </CardHeader>
        <CardContent>
          {isHost ? (
            <div className='flex items-center gap-4'>
              {isEditing ? (
                <>
                  <Input
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className='max-w-md'
                  />
                  <Button onClick={handleWorkspaceNameUpdate}>저장</Button>
                  <Button variant='outline' onClick={() => setIsEditing(false)}>
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <span className='text-lg'>{workspaceName}</span>
                  <Button variant='outline' onClick={() => setIsEditing(true)}>
                    변경
                  </Button>
                </>
              )}
            </div>
          ) : (
            <span className='text-lg'>{workspaceName}</span>
          )}
        </CardContent>
      </Card>

      {/* 멤버 정보 섹션 */}
      <Card className='flex flex-col h-[500px]'>
        <CardHeader>
          <CardTitle>멤버 정보 ({members.length}명) </CardTitle>
        </CardHeader>
        <CardContent className='flex-1'>
          {isHost ? (
            <Tabs
              defaultValue='members'
              className='w-full h-full flex flex-col'
            >
              <TabsList className='grid w-full grid-cols-3'>
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
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage
                                  src={member.user?.profile_image || undefined}
                                />
                                <AvatarFallback>
                                  {member.user?.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.user?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                member.role === 'host' ? 'default' : 'secondary'
                              }
                            >
                              {member.role === 'host' ? '호스트' : '게스트'}
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
                      className='max-w-full'
                    />
                    <Button onClick={handleInviteGuest}>초대</Button>
                  </div>
                  {inviteMessage && (
                    <p
                      className={`text-sm mt-2 ${inviteError ? 'text-red-500' : 'text-green-600'}`}
                    >
                      {inviteMessage}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value='pending' className='flex-1 mt-4'>
                <ScrollArea className='h-[300px] '>
                  <DataTable columns={columns} data={pendingGuests}  />
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
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className='flex items-center gap-2 '>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={member.user?.profile_image || undefined}
                            />
                            <AvatarFallback>
                              {member.user?.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            member.role === 'host' ? 'default' : 'secondary'
                          }
                        >
                          {member.role === 'host' ? '호스트' : '게스트'}
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

      {/* 워크스페이스 삭제 (host 전용) */}
      {isHost && (
        <Card className='border-red-200'>
          <CardHeader>
            <CardTitle className='text-red-600'>워크스페이스 삭제</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              워크스페이스를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이
              작업은 되돌릴 수 없습니다.
            </p>

            {/* 버튼을 오른쪽 정렬 */}
            <div className='flex justify-end mt-4'>
              <Button variant='destructive' onClick={handleDeleteWorkspace}>
                워크스페이스 삭제하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
