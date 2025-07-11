import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Loader2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { customFetch } from '@/lib/customFetch';
import { useModalStore } from '@/stores/useModalStore';
import type { BoxtypeWithCards } from '@/types/board';

import { Boardcard } from './boardcard';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

type BoardboxProps = {
  box: BoxtypeWithCards;
  togglePin: (cardId: string) => void;
  deleteBox: (deletedBoxId: string) => void;
  editBox: (editBoxId: string, title: string) => void;
};

export function Boardbox({
  box,
  togglePin,
  deleteBox,
  editBox,
}: BoardboxProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: box.id,
    });
  const { openModal } = useModalStore();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const orderedCards = [...box.cards].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return a.order - b.order;
  });

  const handleEditTitle = async () => {
    setIsLoading(true);
    try {
      const res = await customFetch(
        `/api/workspaces/${box.workspaces_id}/boxes/${box.id}`,
        { method: 'PATCH', body: JSON.stringify({ title: box.title }) }
      );
      const result = await res.json();
      if (res.ok) {
        editBox(box.id, result.title);
      } else {
        toast.warning(result.title, {
          description: result.description,
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
      setIsEdit(!isEdit);
    }
  };

  const handleDeleteBox = async () => {
    setIsLoading(true);
    try {
      const res = await customFetch(
        `/api/workspaces/${box.workspaces_id}/boxes/${box.id}`,
        { method: 'Delete' }
      );
      const result = await res.json();
      if (res.ok) {
        deleteBox(box.id);
        toast.success(result.title, {
          description: result.description,
        });
      } else {
        toast.warning(result.title, {
          description: result.description,
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
      setIsEdit(!isEdit);
    }
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Card className='max-w-100 min-w-xs !bg-neutral-50 rounded-md border-0'>
        <SortableContext
          items={orderedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <CardHeader>
            <CardTitle className='text-lg'>
              <div className='flex justify-between mb-2'>
                {isEdit ? (
                  <Input
                    type='text'
                    value={box.title}
                    onChange={(e) => editBox(box.id, e.target.value)}
                    className='mr-2'
                  />
                ) : (
                  box.title
                )}
                {isEdit ? (
                  <>
                    <Button
                      onClick={handleEditTitle}
                      disabled={isLoading}
                      className='mr-1'
                    >
                      {isLoading && (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      )}
                      수정
                    </Button>
                    <Button
                      onClick={handleDeleteBox}
                      disabled={isLoading}
                      variant='destructive'
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <button onClick={() => setIsEdit(!isEdit)}>
                    <Pencil className='w-5 h-5' />
                  </button>
                )}
              </div>
              <CardAction className='w-full'>
                <Button
                  className='text-m w-full'
                  variant='outline'
                  onClick={() => openModal('create', box)}
                >
                  + 카드 생성
                </Button>
              </CardAction>
            </CardTitle>
          </CardHeader>
          <CardContent className=' flex flex-col gap-6'>
            {orderedCards.length === 0 ? (
              <div className='p-4 border-dashed border-2 border-gray-400 rounded-md text-center text-sm text-gray-500'>
                카드를 추가해 주세요
              </div>
            ) : (
              orderedCards.map((card) => (
                <Boardcard
                  key={card.id}
                  box={box}
                  card={card}
                  togglePin={togglePin}
                  // updateCard={updateCard}
                />
              ))
            )}
          </CardContent>
        </SortableContext>
      </Card>
    </div>
  );
}
