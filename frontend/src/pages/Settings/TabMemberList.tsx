import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
//import { User, Member, PendingGuest } from '@/components/Types/member';
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


import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

type Props = {
  members: Member[];
};

const TabMemberList = ({ members }: Props) => {
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
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={m.user?.profile_image || undefined} />
                  <AvatarFallback>{m.user?.name?.[0]}</AvatarFallback>
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
  );
};

export default TabMemberList;
