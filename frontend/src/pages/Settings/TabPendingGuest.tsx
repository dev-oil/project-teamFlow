import { columns } from '@/components/Settings/columns';
import { DataTable } from '@/components/Settings/data-table';
import { ScrollArea } from '@/components/ui/scroll-area';

type PendingGuest = {
  id: number;
  email: string;
  invited_at: string;
  token: string;
  expires_at: string;
};

type Props = {
  guests: PendingGuest[];
  onDelete: (token: string) => void;
  onResend: (email: string) => void;
};

const TabPendingGuests = ({ guests, onDelete, onResend }: Props) => {
  return (
    <ScrollArea className="h-[300px]">
      <DataTable
        columns={columns({
          onDelete,
          resendInvite: onResend,
        })}
        data={guests}
      />
    </ScrollArea>
  );
};

export default TabPendingGuests;
