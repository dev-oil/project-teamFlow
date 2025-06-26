import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';

export type PendingGuest = {
  id: number;
  email: string;
  invited_at: string;
  expires_at: string;
  token: string;
};

type ColumnsProps = {
  onDelete: (token: string) => void;
  resendInvite: (email: string) => void;
};

export const columns = ({ onDelete, resendInvite }: ColumnsProps): ColumnDef<PendingGuest>[] => [
  {
    accessorKey: 'email',
    header: () => <div className='min-w-[500px]'>이메일</div>,
    cell: ({ row }) => {
      const expires = new Date(row.original.expires_at);
      const now = new Date();
      const isExpired = expires <= now;

      return (
        <span className={isExpired ? 'line-through text-muted-foreground' : ''}>
          {row.original.email}
        </span>
      );
    },
  },
  {
    id: 'status',
    header: '상태',
    cell: ({ row }) => {
      const guest = row.original;
      const expires = new Date(guest.expires_at);
      const now = new Date();
      const isExpired = expires <= now;
      const formattedDate = guest.expires_at.slice(6,11);

      return (
        <div className='flex items-center justify-between gap-2'>
          <span className={isExpired ? 'text-red-600' : 'text-black-600'}>
            {isExpired
              ? `만료됨 (${formattedDate})`
              : `대기중 (${formattedDate})`}
          </span>

          <div className='flex gap-3'>
            <Button
              size='sm'
              
              onClick={() => resendInvite(guest.email)}
            >
              다시 초대
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => onDelete(guest.token)}
            >
              삭제
            </Button>
          </div>
        </div>
      );
    },
  },
];
