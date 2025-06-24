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
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function Header() {
  const { workspace } = useWorkspaceStore();
  const location = useLocation();

  const pathname = location.pathname;

  const pageNameMap: Record<string, string> = {
    '/': '홈',
    '/dashboard': '작업보드',
    '/notes': '회의록',
    '/calendar': '달력',
    '/profile': '프로필',
    '/settings': '워크스페이스 설정',
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
                <Link to='/'>{workspace}</Link>
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
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Link>
      </Avatar>
    </header>
  );
}
