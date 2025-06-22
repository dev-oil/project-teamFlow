import { IconCirclePlusFilled, type Icon } from '@tabler/icons-react';
import * as React from 'react';

import { Link } from 'react-router-dom';

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

const data = {
  versions: ['기본 워크스페이스', '나의 워크스페이스 1', '나의 워크스페이스 2'],
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
        {
          title: '워크스페이스 설정',
          routes: 'settings',
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
        <VersionSwitcher versions={data.versions} />
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
        {/* Dev용 임시 로그아웃 */}
        <Button
          variant='outline'
          onClick={() => {
            localStorage.removeItem('token'); // ✅ 토큰 제거
            window.location.href = '/'; // 또는 window.location.reload() 해도 됨
          }}
        >
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
