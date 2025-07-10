import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/useUserStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function Header() {
  const { workspace } = useWorkspaceStore();
  const { profile } = useUserStore();

  const location = useLocation();

  const pathname = location.pathname;

  const pageNameMap: Record<string, string> = {
    '/': '홈',
    '/dashboard': '작업보드',
    '/notes': '회의록',
    '/calendar': '달력',
    '/profile': '프로필',
    '/settings': '워크스페이스 정보',
  };

  const currentPageName = pageNameMap[pathname];

  return (
    <header className='flex justify-between items-center h-16 border-b px-4'>
      <div className='flex shrink-0 items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink asChild>
                <Link to='/'>
                  {workspace?.name ?? '워크스페이스 선택 안됨'}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Avatar>
        <Link to='/profile'>
          <AvatarImage
            src={profile?.profile_image || undefined}
            alt={profile?.name ?? '사용자'}
          />
          <AvatarFallback>
            {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Link>
      </Avatar>
    </header>
  );
}
