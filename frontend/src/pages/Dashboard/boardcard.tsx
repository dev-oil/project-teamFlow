import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pin } from 'lucide-react';

import { useModalStore } from '@/stores/useModalStore';
import type { Boxtype, Cardtype } from '@/types/board';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

type BoardcardProps = {
  box: Boxtype;
  card: Cardtype;
  togglePin: (cardId: string) => void;
};

export function Boardcard({ box, card, togglePin }: BoardcardProps) {
  // const [pinned, setPinned] = useState(card.pinned);
  // cards.sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const formatMD = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: card.pinned,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // 드래그 중엔 반투명 처리
    // visibility: isDragging ? 'hidden' : 'visible',
    zIndex: isDragging ? 0 : 1, // 드래그 중 카드가 밑으로 깔리게
  };

  const { openModal } = useModalStore();

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div
        className='relative cursor-pointer text-left w-full block'
        role='button'
        tabIndex={0}
        onClick={() => openModal('edit', box, card)}
      >
        <div
          className={`w-[10px] h-full rounded-l-md absolute`}
          style={{ backgroundColor: card.color }}
        />

        <Card className='w-full rounded-md'>
          <CardHeader className='pl-[26px] pr-[16px] max-w-[270px]'>
            <CardTitle className='text-lg break-words whitespace-normal'>
              {card.title}
            </CardTitle>
            <CardAction>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  // setPinned((prev) => !prev);
                  togglePin(card.id);
                }}
              >
                {card.pinned ? (
                  <Pin className='opacity-100 fill-rose-500 text-rose-500' />
                ) : (
                  <Pin className='opacity-20 fill-gray-700 text-gray-700' />
                )}
              </button>
            </CardAction>
            <CardDescription className='truncate'>
              {card.description}
            </CardDescription>
          </CardHeader>
          <CardContent className='pl-[26px] pr-[16px]'>
            <div className='flex justify-between items-center'>
              {card.start_date && card.end_date && (
                <div>
                  {card.start_date === card.end_date
                    ? formatMD(card.start_date)
                    : `${formatMD(card.start_date)} ~ ${formatMD(card.end_date)}`}
                </div>
              )}
              <div className='flex flex-row flex-wrap items-center gap-12'>
                <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 '>
                  {card.assignee?.length
                    ? card.assignee.map((user) => (
                        <Avatar key={user.id}>
                          <AvatarImage
                            src={user.profile_image}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
