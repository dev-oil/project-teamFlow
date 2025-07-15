import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchNotes } from '@/api/notes';
import { deleteNote } from '@/api/notes';
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
import { useAuthStore } from '@/stores/useAuthStore';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import type { Note } from '@/types/note';

export function NotesPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { workspace } = useWorkspaceStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', workspace?.id],
    queryFn: () => fetchNotes(accessToken!, workspace!.id),
    enabled: !!accessToken && !!workspace?.id,
  });

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setOpen(true);
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm('이 회의록을 정말 삭제하시겠습니까?')) return;

    try {
      await deleteNote(accessToken!, workspace.id, noteId);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    } catch (err) {
      alert('삭제 실패');
      console.error(err);
    }
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
        <Button onClick={() => navigate('/notes/create')}>
          + 회의록 추가하기
        </Button>
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
              key={note.id}
              className='relative grid grid-cols-3 items-center px-4 py-3 border-t hover:bg-gray-50 group cursor-pointer'
              onClick={() => handleNoteClick(note)}
              role='button'
              tabIndex={0}
              aria-label={`회의록 ${note.title} 열기`}
            >
              <div className='truncate'>{note.title}</div>
              <div>{note.users?.name}</div>
              <div className='flex justify-between items-center gap-2 text-sm text-gray-500 relative'>
                {new Date(note.created_at).toLocaleDateString('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                })}

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
                      <DropdownMenuItem
                        onClick={() => {
                          navigate(`/notes/edit/${note.id}`);
                        }}
                      >
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(note.id)}>
                        삭제하기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side='right'
          className='w-full max-w-[480px] md:max-w-[720px] p-6'
        >
          <SheetHeader className='mb-4 px-0'>
            <SheetTitle className='text-xl font-semibold'>
              {selectedNote?.title ?? '회의록 상세'}
            </SheetTitle>
          </SheetHeader>

          <div className='space-y-6 text-sm text-gray-800'>
            <div className='space-y-1'>
              <p className='text-xs text-gray-500'>작성자</p>
              <p className='font-medium'>{selectedNote?.users?.name}</p>
            </div>

            <div className='space-y-1'>
              <p className='text-xs text-gray-500'>작성일</p>
              <p className='font-medium'>
                {selectedNote?.created_at &&
                  new Date(selectedNote.created_at).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
            </div>

            <div className='space-y-2'>
              <p className='text-xs text-gray-500'>본문 내용</p>
              <div className='bg-gray-100 p-3 rounded-md whitespace-pre-wrap leading-relaxed text-[15px] text-gray-900 max-h-[55vh] overflow-y-auto'>
                {selectedNote?.content || '내용이 없습니다.'}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
