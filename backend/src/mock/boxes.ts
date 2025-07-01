import type { Box } from '../types/board';

export const boxes: Box[] = [
  {
    id: 'box-1',
    workspaces_id: 'ws-1',
    order: 1,
    title: 'To Do',
    created_at: '2025-06-20T10:00:00.000Z',
    updated_at: '2025-06-20T10:00:00.000Z',
  },
  {
    id: 'box-2',
    workspaces_id: 'ws-1',
    order: 2,
    title: 'In Progress',
    created_at: '2025-06-20T11:00:00.000Z',
    updated_at: '2025-06-20T11:00:00.000Z',
  },
  {
    id: 'box-3',
    workspaces_id: 'ws-1',
    order: 3,
    title: 'Done',
    created_at: '2025-06-20T12:00:00.000Z',
    updated_at: '2025-06-20T12:00:00.000Z',
  },

  {
    id: 'box-4',
    workspaces_id: 'ws-2',
    order: 1,
    title: '디자인 초안',
    created_at: '2025-06-21T10:00:00.000Z',
    updated_at: '2025-06-21T10:00:00.000Z',
  },
  {
    id: 'box-5',
    workspaces_id: 'ws-2',
    order: 2,
    title: '피드백 대기',
    created_at: '2025-06-21T11:00:00.000Z',
    updated_at: '2025-06-21T11:00:00.000Z',
  },

  {
    id: 'box-6',
    workspaces_id: 'ws-3',
    order: 1,
    title: '백로그',
    created_at: '2025-06-22T09:00:00.000Z',
    updated_at: '2025-06-22T09:00:00.000Z',
  },
];
