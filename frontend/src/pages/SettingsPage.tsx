// export function SettingsPage() {
//   return <div>SettingsPage</div>;
// }
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

interface Workspace {
  id: number;
  name: string;
  created_at: string;
  users_id: number;
}

interface Member {
  id: number;
  users_id: number;
  workspaces_id: number;
  role: 'host' | 'guest';
  user?: User;
}

export const SettingsPage: React.FC = () => {
  // 예시 데이터
  const exampleWorkspace: Workspace = {
    id: 1,
    name: "TeamFlow 프로젝트",
    created_at: "2024-03-20T00:00:00Z",
    users_id: 1
  };

  const exampleMembers: Member[] = [
    {
      id: 1,
      users_id: 1,
      workspaces_id: 1,
      role: "host",
      user: {
        id: 1,
        email: "host@example.com",
        name: "호스트",
        phone: "01012345678",
        profile_image: "https://github.com/shadcn.png",
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
    {
      id: 2,
      users_id: 2,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 2,
        email: "guest1@example.com",
        name: "게스트 1",
        phone: "01087654321",
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
    {
      id: 3,
      users_id: 3,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 3,
        email: "guest2@example.com",
        name: "게스트 2",
        phone: "01011112222",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
     {
      id: 4,
      users_id: 4,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 4,
        email: "guest2@example.com",
        name: "게스트 3",
        phone: "01033333333",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
     {
      id: 5,
      users_id: 5,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 5,
        email: "guest2@example.com",
        name: "게스트 4",
        phone: "01044444444",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
     {
      id: 6,
      users_id: 6,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 6,
        email: "guest2@example.com",
        name: "게스트 5",
        phone: "01055555555",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
     {
      id: 7,
      users_id: 7,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 7,
        email: "guest2@example.com",
        name: "게스트 6",
        phone: "01011116666",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
      {
      id: 8,
      users_id: 8,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 8,
        email: "guest2@example.com",
        name: "게스트 7",
        phone: "01011117777",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
      {
      id: 9,
      users_id: 9,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 9,
        email: "guest2@example.com",
        name: "게스트 8",
        phone: "01011118888",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },
      {
      id: 10,
      users_id: 10,
      workspaces_id: 1,
      role: "guest",
      user: {
        id: 10,
        email: "guest2@example.com",
        name: "게스트 9",
        phone: "01011119999",
        
        profile_image: null,
        created_at: "2024-03-20T00:00:00Z",
        updated_at: "2024-03-20T00:00:00Z"
      }
    },

  ];

  const [workspaceName, setWorkspaceName] = useState(exampleWorkspace.name);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState(exampleWorkspace.name);
  const [inviteEmail, setInviteEmail] = useState("");
  const [members] = useState<Member[]>(exampleMembers);
  const [isHost] = useState(true); //호스트 화면을 보기 위해 true로 설정
  //  const [isHost] = useState(false); // 게스트 화면을 보기 위해 false로 설정

  const handleWorkspaceNameUpdate = () => {
    setWorkspaceName(newWorkspaceName);
    setIsEditing(false);
  };

  const handleInviteGuest = () => {
    console.log("초대 이메일:", inviteEmail);
    setInviteEmail("");
  };

  const handleDeleteWorkspace = () => {
    console.log("워크스페이스 삭제");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        {isHost ? "워크스페이스 설정" : "워크스페이스 정보"}
      </h1>

      {/* 워크스페이스 이름 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>워크스페이스 이름</CardTitle>
        </CardHeader>
        <CardContent>
          {isHost ? (
            <div className="flex items-center gap-4">
              {isEditing ? (
                <>
                  <Input
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="max-w-md"
                  />
                  <Button onClick={handleWorkspaceNameUpdate}>저장</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-lg">{workspaceName}</span>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    변경
                  </Button>
                </>
              )}
            </div>
          ) : (
            <span className="text-lg">{workspaceName}</span>
          )}
        </CardContent>
      </Card>

       {/* 멤버 정보 섹션 */}
      <Card className="flex flex-col h-[500px]">
        <CardHeader>
          <CardTitle>멤버 정보 ({members.length}명) </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          {isHost ? (
            <Tabs defaultValue="members" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
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
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.user?.profile_image || undefined} />
                                <AvatarFallback>{member.user?.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{member.user?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={member.role === "host" ? "default" : "secondary"}>
                              {member.role === "host" ? "호스트" : "게스트"}
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
                      className="max-w-md"
                    />
                    <Button onClick={handleInviteGuest}>초대</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="flex-1 mt-4">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이메일</TableHead>
                        <TableHead>초대일</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>pending@example.com</TableCell>
                        <TableCell>2024-03-20</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.user?.profile_image || undefined} />
                            <AvatarFallback>{member.user?.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{member.user?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.role === "host" ? "default" : "secondary"}>
                          {member.role === "host" ? "호스트" : "게스트"}
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
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">워크스페이스 삭제</CardTitle>
          </CardHeader>
          <CardContent>
            워크스페이스를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.
            <Button variant="destructive" onClick={handleDeleteWorkspace}>
              워크스페이스 삭제하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};








//-------------------------------------------------------
// DB 연동
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import axios from 'axios';

// interface User {
//   id: number;
//   email: string;
//   name: string;
//   phone: string;
//   profile_image: string | null;
//   created_at: string;
//   updated_at: string;
// }

// interface Workspace {
//   id: number;
//   name: string;
//   created_at: string;
//   users_id: number;
// }

// interface Member {
//   id: number;
//   users_id: number;
//   workspaces_id: number;
//   role: 'host' | 'guest';
//   user?: User; // JOIN으로 가져올 사용자 정보
// }

// export const SettingsPage: React.FC = () => {
//   const [workspaceName, setWorkspaceName] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [newWorkspaceName, setNewWorkspaceName] = useState("");
//   const [inviteEmail, setInviteEmail] = useState("");
//   const [members, setMembers] = useState<Member[]>([]);
//   const [isHost, setIsHost] = useState(false);
//   const [workspaceId, setWorkspaceId] = useState<number | null>(null);

//   // 워크스페이스 정보 가져오기
//   const fetchWorkspaceInfo = async () => {
//     try {
//       const response = await axios.get(`/api/workspaces/${workspaceId}`);
//       const workspace: Workspace = response.data;
//       setWorkspaceName(workspace.name);
//       setNewWorkspaceName(workspace.name);
//     } catch (error) {
//       console.error('워크스페이스 정보를 가져오는데 실패했습니다:', error);
//     }
//   };

//   // 멤버 정보 가져오기
//   const fetchMembers = async () => {
//     try {
//       const response = await axios.get(`/api/workspaces/${workspaceId}/members`);
//       const membersData: Member[] = response.data;
//       setMembers(membersData);
      
//       // 현재 사용자의 역할 확인
//       const currentUserId = localStorage.getItem('userId'); // 로컬 스토리지에서 사용자 ID 가져오기
//       const currentUser = membersData.find(member => member.users_id === Number(currentUserId));
//       setIsHost(currentUser?.role === 'host');
//     } catch (error) {
//       console.error('멤버 정보를 가져오는데 실패했습니다:', error);
//     }
//   };

//   // 워크스페이스 이름 업데이트
//   const handleWorkspaceNameUpdate = async () => {
//     try {
//       await axios.patch(`/api/workspaces/${workspaceId}`, {
//         name: newWorkspaceName
//       });
//       setWorkspaceName(newWorkspaceName);
//       setIsEditing(false);
//     } catch (error) {
//       console.error('워크스페이스 이름 변경에 실패했습니다:', error);
//     }
//   };

//   // 게스트 초대
//   const handleInviteGuest = async () => {
//     try {
//       await axios.post(`/api/workspaces/${workspaceId}/invite`, {
//         email: inviteEmail
//       });
//       setInviteEmail("");
//       // 초대 성공 메시지 표시
//     } catch (error) {
//       console.error('게스트 초대에 실패했습니다:', error);
//     }
//   };

//   // 워크스페이스 삭제
//   const handleDeleteWorkspace = async () => {
//     try {
//       await axios.delete(`/api/workspaces/${workspaceId}`);
//       // 삭제 후 리다이렉트
//       window.location.href = '/dashboard';
//     } catch (error) {
//       console.error('워크스페이스 삭제에 실패했습니다:', error);
//     }
//   };

//   useEffect(() => {
//     // URL에서 workspaceId 가져오기
//     const pathParts = window.location.pathname.split('/');
//     const id = parseInt(pathParts[pathParts.length - 1]);
//     if (!isNaN(id)) {
//       setWorkspaceId(id);
//     }
//   }, []);

//   useEffect(() => {
//     if (workspaceId) {
//       fetchWorkspaceInfo();
//       fetchMembers();
//     }
//   }, [workspaceId]);

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold mb-6">
//         {isHost ? "워크스페이스 설정" : "워크스페이스 정보"}
//       </h1>

//       {/* 워크스페이스 이름 섹션 */}
//       <Card>
//         <CardHeader>
//           <CardTitle>워크스페이스 이름</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isHost ? (
//             <div className="flex items-center gap-4">
//               {isEditing ? (
//                 <>
//                   <Input
//                     value={newWorkspaceName}
//                     onChange={(e) => setNewWorkspaceName(e.target.value)}
//                     className="max-w-md"
//                   />
//                   <Button onClick={handleWorkspaceNameUpdate}>저장</Button>
//                   <Button variant="outline" onClick={() => setIsEditing(false)}>
//                     취소
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <span className="text-lg">{workspaceName}</span>
//                   <Button variant="outline" onClick={() => setIsEditing(true)}>
//                     변경
//                   </Button>
//                 </>
//               )}
//             </div>
//           ) : (
//             <span className="text-lg">{workspaceName}</span>
//           )}
//         </CardContent>
//       </Card>

//       {/* 멤버 정보 섹션 */}
//       <Card>
//         <CardHeader>
//           <CardTitle>멤버 정보</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <h3 className="font-semibold">참여중인 멤버</h3>
//             <div className="space-y-2">
//               {members.map((member) => (
//                 <div key={member.id} className="flex items-center gap-4">
//                   <Avatar>
//                     <AvatarImage src={member.user?.profile_image || undefined} />
//                     <AvatarFallback>{member.user?.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{member.user?.name}</p>
//                     <p className="text-sm text-gray-500">{member.user?.email}</p>
//                   </div>
//                   <Badge variant={member.role === "host" ? "default" : "secondary"}>
//                     {member.role === "host" ? "호스트" : "게스트"}
//                   </Badge>
//                 </div>
//               ))}
//             </div>

//             {isHost && (
//               <>
//                 {/* 게스트 초대 */}
//                 <div className="mt-6">
//                   <h3 className="font-semibold mb-2">게스트 초대</h3>
//                   <div className="flex gap-2">
//                     <Input
//                       type="email"
//                       placeholder="이메일 주소 입력"
//                       value={inviteEmail}
//                       onChange={(e) => setInviteEmail(e.target.value)}
//                       className="max-w-md"
//                     />
//                     <Button onClick={handleInviteGuest}>초대</Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* 워크스페이스 삭제 (host 전용) */}
//       {isHost && (
//         <Card className="border-red-200">
//           <CardHeader>
//             <CardTitle className="text-red-600">위험 구역</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Button variant="destructive" onClick={handleDeleteWorkspace}>
//               워크스페이스 삭제
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

