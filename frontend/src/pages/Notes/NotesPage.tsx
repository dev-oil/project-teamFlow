import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { fetchNotes } from '@/api/notes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { Note } from '@/types/note';

export function NotesPage() {
  const { workspace } = useWorkspaceStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [open, setOpen] = useState(false);

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', workspace],
    queryFn: () => fetchNotes(workspace),
    enabled: !!workspace,
  });

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  if (isLoading) return <div className='p-4'>불러오는 중...</div>;
  if (isError)
    return <div className='p-4 text-red-500'>데이터 불러오기 실패</div>;

  return (
    <div className='p-6 space-y-6 relative'>
      <h2 className='sr-only'>회의록</h2>

      <div className='flex gap-4 justify-between items-center'>
        <div className='flex items-center w-full'>
          <Input placeholder='회의록 검색…' />
        </div>
        <Button>+ 회의록 추가하기</Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <div className='grid grid-cols-3 bg-gray-100 text-sm font-semibold px-4 py-2'>
          <span>제목</span>
          <span>작성자</span>
          <span>작성일</span>
        </div>

        {notes.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>
            회의록이 없습니다.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.noteId}
              className='relative grid grid-cols-3 items-center px-4 py-3 border-t hover:bg-gray-50 group cursor-pointer'
              onClick={() => handleNoteClick(note)}
              role='button'
              tabIndex={0}
              aria-label={`회의록 ${note.title} 열기`}
            >
              <div className='truncate'>{note.title}</div>
              <div>{note.author}</div>
              <div className='flex justify-between items-center gap-2 text-sm text-gray-500 relative'>
                {new Date(note.createdAt).toLocaleDateString('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                })}

                {/* 더보기 버튼 */}
                <div
                  className='z-10'
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        더보기
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>수정하기</DropdownMenuItem>
                      <DropdownMenuItem>삭제하기</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 사이드 시트 */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='right' className='w-[400px]'>
          <SheetHeader>
            <SheetTitle>{selectedNote?.title ?? '회의록 상세'}</SheetTitle>
          </SheetHeader>
          <div className='mt-4 space-y-2 text-sm'>
            <p>
              <strong>작성자:</strong> {selectedNote?.author}
            </p>
            <p>
              <strong>작성일:</strong>{' '}
              {new Date(selectedNote?.createdAt ?? '').toLocaleString('ko-KR')}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
