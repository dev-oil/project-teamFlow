// 호스트 전용 components/WorkspaceSettings.tsx
// import { Card, CardContent } from '@/components/ui/card';
// //import { Label } from '@/components/ui/label';
// //import { Input } from '@/components/ui/input';
// //import { Button } from'@/components/ui/button';

// import { mockWorkspace } from "@/data/dummyData";


// export function WorkspaceSettings() {
//   return (
//     <div className='p-6 space-y-4'>
//       {/* 워크스페이스 이름 변경 */}
//       <Card>
//         <CardContent className='p-4'>
//           <h2 className='font-bold text-lg'>워크스페이스 이름</h2>
//           <input defaultValue={mockWorkspace.name} className='border mt-2 p-2 w-full rounded' />
//         </CardContent>
//       </Card>

//       {/* 멤버 목록 */}
//       <Card>
//         <CardContent className='p-4'>
//           <h2 className='font-bold text-lg'>멤버</h2>
//           <ul className='mt-2 list-disc pl-5'>
//             {mockWorkspace.members.map((m) => (
//               <li key={m.id}>{m.name} ({m.role})</li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* 대기 중인 게스트 */}
//       <Card>
//         <CardContent className='p-4'>
//           <h2 className='font-bold text-lg'>게스트 초대 대기 목록</h2>
//           <ul className='mt-2 list-disc pl-5'>
//             {mockWorkspace.pendingGuests.map((g) => (
//               <li key={g.id}>{g.name}</li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* 워크스페이스 삭제 */}
//       <Card>
//         <CardContent className='p-4'>
//           <h2 className='text-red-600 font-bold text-lg'>워크스페이스 삭제</h2>
//           <button className='bg-red-600 text-white px-4 py-2 rounded mt-2'>삭제하기</button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
