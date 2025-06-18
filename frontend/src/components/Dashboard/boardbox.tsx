import type { ReactNode } from 'react';
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

type ModalProps = {
  children: ReactNode;
};

export function Boardbox({ children }: ModalProps) {
  return (
    <Card className="max-w-100 min-w-xs !bg-gray-200 rounded-md">
      <CardHeader>
        <CardTitle className="text-lg">할 일</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <CardAction>
              <Button className="text-m" variant="outline">
                + 카드 생성
              </Button>
            </CardAction>
          </DialogTrigger>

          <DialogContent>{children}</DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Boardcard></Boardcard>
      </CardContent>
    </Card>
  );
}
