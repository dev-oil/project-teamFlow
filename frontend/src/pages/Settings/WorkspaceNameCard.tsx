import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUpdateWorkspaceName } from '@/hooks/useUpdateWorkspaceName';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

type Props = {
  isHost: boolean;
  workspaceId: number;
};

const WorkspaceNameCard = ({ isHost, workspaceId }: Props) => {
  const { workspace } = useWorkspaceStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const updateMutation = useUpdateWorkspaceName(workspaceId);

  //워크스페이스 이름 변경
  const handleUpdate = () => {
    updateMutation.mutate(newWorkspaceName, {
      onSuccess: () => setIsEditing(false),
      onError: () => alert('이름 변경 실패!'),
    });
  };

  return (
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
                <Button onClick={handleUpdate}>저장</Button>
                <Button variant='outline' onClick={() => setIsEditing(false)}>
                  취소
                </Button>
              </>
            ) : (
              <>
                <span className='text-lg'>{workspace.name}</span>
                <Button variant='outline' onClick={() => setIsEditing(true)}>
                  변경
                </Button>
              </>
            )}
          </div>
        ) : (
          <span className='text-lg'>{workspace.name}</span>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceNameCard;
