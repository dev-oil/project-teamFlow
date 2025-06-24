import React, { useState } from 'react';
import WorkspaceNameCard from './Settings/WorkspaceNameCard';
import MembersCard from './Settings/MembersCard';
import DeleteWorkspaceCard from './Settings/DeleteWorkspaceCard';

export const SettingsPage = () => {
  //역할제어
 const [isHost] = useState(true); // 호스트
 //const [isHost] = useState(false); //게스트
 const workspaceId = 1;
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">
        {isHost ? '워크스페이스 설정' : '워크스페이스 정보'}
      </h1>

      <WorkspaceNameCard isHost={isHost} workspaceId={workspaceId} />
      <MembersCard isHost={isHost} workspaceId={workspaceId} />
      {isHost && <DeleteWorkspaceCard  />}
    </div>
  );
};

export default SettingsPage;