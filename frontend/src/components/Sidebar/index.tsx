import { IconCirclePlusFilled } from '@tabler/icons-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

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

const data = {
  versions: ['미래존', '나의 워크스페이스 1', '나의 워크스페이스 2'],
  navMain: [
    {
      title: '팀플로우 시작하기',
      url: '#',
      items: [
        {
          title: '작업보드',
          routes: 'dashboard',
          isActive: true,
        },
        {
          title: '회의록',
          routes: 'notes',
        },
        {
          title: '달력',
          routes: 'calendar',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Button>
          <IconCirclePlusFilled /> 새 워크스페이스
        </Button>
      </SidebarHeader>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.routes}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
        <Button variant='outline' asChild>
          <Link to='/settings'>워크스페이스 설정</Link>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
