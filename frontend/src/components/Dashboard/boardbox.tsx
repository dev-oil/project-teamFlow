// import type { ReactNode } from 'react';
// import { Button } from '../ui/button';
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '../ui/card';
// import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
// import { Boardcard } from './boardcard';

// type ModalProps = {
//   children: ReactNode;
// };

// export function Boardbox({ children }: ModalProps) {
//   return (
//     <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
//       <CardHeader>
//         <CardTitle className='text-lg'>할 일</CardTitle>
//         <Dialog>
//           <DialogTrigger asChild>
//             <CardAction>
//               <Button className='text-m' variant='outline'>
//                 + 카드 생성
//               </Button>
//             </CardAction>
//           </DialogTrigger>

//           <DialogContent>{children}</DialogContent>
//         </Dialog>
//       </CardHeader>
//       <CardContent>
//         <Boardcard></Boardcard>
//       </CardContent>
//     </Card>
//   );
// }
// import type { ReactNode } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Boardcard } from './boardcard';
import { Boardmodal } from '../Modal/boardmodal';

export function Boardbox() {
  return (
    <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
      <CardHeader>
        <CardTitle className='text-lg'>할 일</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <CardAction>
              <Button className='text-m' variant='outline'>
                + 카드 생성
              </Button>
            </CardAction>
          </DialogTrigger>

          <DialogContent>
            <Boardmodal />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Boardcard></Boardcard>
        <Boardcard></Boardcard>
        <Boardcard></Boardcard>
        <Boardcard></Boardcard>
        <Boardcard></Boardcard>
      </CardContent>
    </Card>
  );
}
