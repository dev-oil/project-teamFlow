// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// interface Member {
//   id: string;
//   name: string;
//   email: string;
//   role: 'host' | 'guest';
//   avatar?: string;
// }

// interface PendingGuest {
//   id: string;
//   email: string;
//   invitedAt: string;
// }

// const SettingsPage: React.FC = () => {
//   const [workspaceName, setWorkspaceName] = useState("My Workspace");
//   const [isEditing, setIsEditing] = useState(false);
//   const [newWorkspaceName, setNewWorkspaceName] = useState(workspaceName);
//   const [inviteEmail, setInviteEmail] = useState("");

//   // 임시 데이터 (실제로는 API에서 가져와야 함)
//   const isHost = true; // 실제로는 사용자 역할에 따라 결정
//   const members: Member[] = [
//     { id: "1", name: "John Doe", email: "john@example.com", role: "host", avatar: "https://github.com/shadcn.png" },
//     { id: "2", name: "Jane Smith", email: "jane@example.com", role: "guest", avatar: "https://github.com/shadcn.png" },
//   ];
//   const pendingGuests: PendingGuest[] = [
//     { id: "1", email: "pending@example.com", invitedAt: "2024-03-20" },
//   ];

//   const handleWorkspaceNameUpdate = () => {
//     setWorkspaceName(newWorkspaceName);
//     setIsEditing(false);
//   };

//   const handleInviteGuest = () => {
//     // 게스트 초대 로직 구현
//     console.log("Inviting guest:", inviteEmail);
//     setInviteEmail("");
//   };

//   const handleDeleteWorkspace = () => {
//     // 워크스페이스 삭제 로직 구현
//     console.log("Deleting workspace");
//   };

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
//                     <AvatarImage src={member.avatar} />
//                     <AvatarFallback>{member.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{member.name}</p>
//                     <p className="text-sm text-gray-500">{member.email}</p>
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

//                 {/* 대기중인 게스트 */}
//                 {pendingGuests.length > 0 && (
//                   <div className="mt-6">
//                     <h3 className="font-semibold mb-2">대기중인 게스트</h3>
//                     <div className="space-y-2">
//                       {pendingGuests.map((guest) => (
//                         <div key={guest.id} className="flex items-center justify-between">
//                           <span>{guest.email}</span>
//                           <span className="text-sm text-gray-500">
//                             초대일: {guest.invitedAt}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
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
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="destructive">워크스페이스 삭제</Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>워크스페이스를 삭제하시겠습니까?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     이 작업은 되돌릴 수 없습니다. 워크스페이스의 모든 데이터가 영구적으로 삭제됩니다.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>취소</AlertDialogCancel>
//                   <AlertDialogAction onClick={handleDeleteWorkspace}>
//                     삭제
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SettingsPage;