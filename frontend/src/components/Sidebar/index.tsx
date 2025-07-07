import { IconCirclePlusFilled } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';

import { toast } from 'sonner';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// import { fetchWorkspaces } from '@/api/workspaces';
import { VersionSwitcher } from '@/components/Sidebar/version-switcher';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/useAuthStore';

import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { WorkspaceListItem } from '@/types/workspace';
import { fetchWorkspaces } from '@/api/workspaces';
import { customFetch } from '@/lib/customFetch';
import { Loader2 } from 'lucide-react';

const navMain = [
  {
    title: '팀플로우 시작하기',
    url: '#',
    items: [
      { title: '작업보드', routes: 'dashboard' },
      { title: '회의록', routes: 'notes' },
      { title: '달력', routes: 'calendar' },
      { title: '워크스페이스 설정', routes: 'settings' },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { setWorkspace, workspace } = useWorkspaceStore();
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: workspaces = [] } = useQuery<WorkspaceListItem[]>({
    queryKey: ['workspaces'],
    queryFn: () => fetchWorkspaces(accessToken!),
  });

  useEffect(() => {
    if (workspaces.length === 0) return;

    const exists = workspaces.some((ws) => ws.id === workspace?.id);

    // 선택값이 없거나 유효하지 않으면 첫 번째 워크스페이스로 설정
    if (!workspace || !exists) {
      setWorkspace(workspaces[0]);
    }
  }, [workspaces, workspace, setWorkspace]);

  const location = useLocation();

  const handleCreateWorkspace = async () => {
    setIsLoading(true);
    try {
      const res = await customFetch('/api/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: '새 워크스페이스' }),
        credentials: 'include',
      });
      if (res.ok) {
        const newWorkspace: WorkspaceListItem = await res.json();
        navigate('/');
        setWorkspace(newWorkspace);

        // await refetch();
        toast.success('새 워크스페이스가 생성되었습니다');
      } else {
        const errData = await res.json();
        toast.success(errData.title, {
          description: errData.description,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.warning(err.name, {
          description: err.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Button onClick={handleCreateWorkspace} disabled={isLoading}>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
          <IconCirclePlusFilled /> 새 워크스페이스
        </Button>
      </SidebarHeader>

      <SidebarHeader>
        <VersionSwitcher versions={workspaces} />
      </SidebarHeader>

      <SidebarContent>
        {navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((menu) => {
                  const fullPath = `/${menu.routes}`;
                  const isActive = location.pathname === fullPath;

                  return (
                    <SidebarMenuItem key={menu.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={menu.routes}>{menu.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant='outline'
          asChild
          onClick={async () => {
            try {
              const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
              });

              if (!res.ok) throw new Error('로그아웃 실패');
              useAuthStore.getState().clearAccessToken();
            } catch (err: unknown) {
              if (err instanceof Error) {
                toast.warning('로그아웃 실패', {
                  description: '잠시후 다시 시도해주세요',
                });
              }
            }
          }}
        >
          <Link to='/'>Logout</Link>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
