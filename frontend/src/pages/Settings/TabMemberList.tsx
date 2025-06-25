import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import PopoverMemberProfile from './PopoverMemberProfile';

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
type Props = {
  members: Member[];
  isHost: boolean;
  workspaceId: number;
  onRemoveMember?: (userId: number) => void;
};

const TabMemberList = ({ members, isHost, onRemoveMember, workspaceId }: Props) => {
  return (
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
                <PopoverMemberProfile
                  user={m.user!}
                  isHost={isHost}
                  workspaceId={workspaceId}
                  onRemoveMember={onRemoveMember}
                />
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
  );
};

export default TabMemberList;
