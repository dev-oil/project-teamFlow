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
  const [newWorkspaceName, setNewWorkspaceName] = useState(exampleWorkspace.name);

  const handleUpdate = () => {
    setWorkspaceName(newWorkspaceName);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>워크스페이스 이름</CardTitle>
      </CardHeader>
      <CardContent>
        {isHost ? (
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <Input
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="max-w-md"
                />
                <Button onClick={handleUpdate}>저장</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>취소</Button>
              </>
            ) : (
              <>
                <span className="text-lg">{workspaceName}</span>
                <Button variant="outline" onClick={() => setIsEditing(true)}>변경</Button>
              </>
            )}
          </div>
        ) : (
          <span className="text-lg">{workspaceName}</span>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceNameCard;
