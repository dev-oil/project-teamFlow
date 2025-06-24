import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
//import { exampleWorkspace } from '@/data/dummyData';

type Props = {
  isHost: boolean;
  workspaceId: number;
};

const WorkspaceNameCard = ({ isHost, workspaceId }: Props) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  useEffect(() => {
    const fetchWorkspaceName = async () => {
      try {
        const response = await fetch(
          `/api/workspaces/${workspaceId}/name`
        );
        if (!response.ok)
          throw new Error('워크스페이스 이름을 불러오지 못했습니다.');

        const data = await response.json();
        setWorkspaceName(data.name);
        setNewWorkspaceName(data.name);
      } catch (error) {
        console.error('워크스페이스 이름 불러오기 실패:', error);
      }
    };

    fetchWorkspaceName();
  }, [workspaceId]);

  //워크스페이스 이름 변경
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/name`,
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
