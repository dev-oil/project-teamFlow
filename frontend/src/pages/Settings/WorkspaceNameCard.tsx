import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { exampleWorkspace } from '@/data/dummyData';

type Props = {
  isHost: boolean;
};

const WorkspaceNameCard = ({ isHost }: Props) => {
  const [workspaceName, setWorkspaceName] = useState(exampleWorkspace.name);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState(
    exampleWorkspace.name
  );

  // const handleUpdate = () => {
  //   setWorkspaceName(newWorkspaceName);
  //   setIsEditing(false);
  // };
  const handleUpdate = async () => {
    //버튼 누를 때 : /api/workspaces/1/name
    try {
      const response = await fetch(
        `/api/workspaces/${exampleWorkspace.id}/name`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newWorkspaceName }),
        }
      );

      if (!response.ok) {
        throw new Error('워크스페이스 이름 변경 실패');
      }

      setWorkspaceName(newWorkspaceName);
      setIsEditing(false);
    } catch (err) {
      console.error('워크스페이스 이름 변경 오류:', err);
      alert('이름 변경 중 오류가 발생했습니다.');
    }
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
                <span className='text-lg'>{workspaceName}</span>
                <Button variant='outline' onClick={() => setIsEditing(true)}>
                  변경
                </Button>
              </>
            )}
          </div>
        ) : (
          <span className='text-lg'>{workspaceName}</span>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceNameCard;
