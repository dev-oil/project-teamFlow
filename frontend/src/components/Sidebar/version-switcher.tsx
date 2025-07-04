import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { WorkspaceListItem } from '@/types/workspace';

export function VersionSwitcher({
  versions,
}: {
  versions: WorkspaceListItem[];
}) {
  const { workspace, setWorkspace } = useWorkspaceStore();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <GalleryVerticalEnd className='size-4' />
              </div>
              <div className='flex flex-col gap-1 leading-none'>
                <span className='font-medium'>워크스페이스 선택하기</span>
                <span className='text-xs text-gray-500'>
                  {workspace?.name ?? '선택 안됨'}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width)'
            align='start'
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version.id}
                onSelect={() => setWorkspace(version)}
              >
                {version.name}{' '}
                {workspace?.id === version.id && <Check className='ml-auto' />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
