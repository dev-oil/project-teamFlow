import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import DeleteWorkspaceCard from './Settings/DeleteWorkspaceCard';
import MembersCard from './Settings/MembersCard';
import WorkspaceNameCard from './Settings/WorkspaceNameCard';

export const SettingsPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const { workspace } = useWorkspaceStore();

  const workspaceId = workspace?.id;
  const isHost = workspace?.role === 'host';

  if (!workspaceId || !accessToken) return <div>로딩 중...</div>;

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold mb-6'>워크스페이스 정보</h1>

      <WorkspaceNameCard isHost={isHost} workspaceId={workspaceId} />
      <MembersCard isHost={isHost} workspaceId={workspaceId} />
      {isHost && (
        <DeleteWorkspaceCard
          workspaceId={workspaceId}
          onDeleted={() => navigate('/')}
        />
      )}
    </div>
  );
};

export default SettingsPage;
