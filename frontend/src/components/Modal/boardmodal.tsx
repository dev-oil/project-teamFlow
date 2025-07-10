import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import { uploadCardFiles } from '@/api/board';
import { useBoardData } from '@/hooks/useBoardData';
import { customFetch } from '@/lib/customFetch';
import type { Boxtype, Cardtype } from '@/types/board';
import { colorOptions, type ColorCode } from '@/types/colors';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

export type User = {
  id: string;
  name: string;
  image: string;
};

type BoardmodalProps = {
  mode: 'create' | 'edit';
  box?: Boxtype;
  card?: Cardtype;
  open: boolean;
};
type Usertype = {
  id: string;
  name: string;
  profile_image: string;
};

const acceptExtension = `
  .jpg,.jpeg,.png,.gif,
  .pdf,
  .doc,.docx,
  .xls,.xlsx,
  .ppt,.pptx,
  .csv,
  .zip
`;

const allowedExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'csv',
  'zip',
];

export function Boardmodal({ mode, box, card, open }: BoardmodalProps) {
  useEffect(() => {
    if (mode === 'edit' && card?.assignee) {
      setSelectedUserid(card.assignee.map((user) => user.id));
    }
  }, [mode, card]);

  // 제목
  const [cardtitle, setCardtitle] = useState(card?.title ?? '');
  // 색상
  const [selectedColor, setSelectedColor] = useState<ColorCode | null>(
    (card?.color as ColorCode) ?? null
  );
  // 일정
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (mode === 'edit' && card?.start_date && card?.end_date) {
      return {
        from: new Date(card.start_date),
        to: new Date(card.end_date),
      };
    }
    return undefined;
  });
  const formatDate = (date: Date) => date.toISOString().slice(0, 10); // '2025-06-20'
  // 설명
  const [description, setDescription] = useState(card?.description ?? '');
  // 담당자
  const [selectedUserid, setSelectedUserid] = useState<string[]>([]);

  const [users, setUsers] = useState<Usertype[]>([]); // user state 정의

  useEffect(() => console.log(box?.workspaces_id), [box?.workspaces_id]);
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        const res = await customFetch(
          `/api/workspaces/${box?.workspaces_id}/members`
        );

        const data = (await res.json()) as { user: Usertype }[];
        setUsers(data.map((d) => d.user));
      } catch (err) {
        console.error('멤버 조회 실패:', err);
      }
    };

    fetchUsers();
  }, [open, box?.workspaces_id]);

  // 첨부파일
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  // 첨부파일 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      const filteredFiles = newFiles.filter((file) => {
        console.log(typeof file);
        console.log(file);
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !allowedExtensions.includes(ext)) {
          toast.warning('허용되지 않은 파일 형식입니다', {
            description: file.name,
          });
          return false;
        }
        return true;
      });

      // 중복 방지 & 최대 5개 제한
      const mergedFiles = [...attachedFiles, ...filteredFiles]
        .filter(
          (file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
        )
        .slice(0, 5); // 최대 5개 제한
      setAttachedFiles(mergedFiles);
      e.target.value = ''; // 같은 파일 선택불가
    }
  };
  // 첨부파일 삭제
  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 카드 생성
  const { addCard } = useBoardData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!box?.id) {
      alert('박스 정보가 없습니다.');
      return;
    }
    console.log(box.id);

    if (!cardtitle.trim()) {
      alert('카드 제목을 입력해주세요.');
      return;
    }

    if (!selectedColor) {
      alert('색상을 선택해주세요.');
      return;
    }

    if (!range?.from || !range?.to) {
      alert('시작일과 종료일을 모두 선택해주세요.');
      return;
    }

    try {
      console.log('addCard 호출 전');
      const selectedAssignees = users
        .filter((u) => selectedUserid.includes(u.id))
        .map(({ id, name, profile_image }) => ({
          id,
          name,
          profile_image: profile_image,
        }));
      const newCard = await addCard(box.id, {
        title: cardtitle.trim(),
        description: description.trim() || undefined,
        color: selectedColor ?? undefined,
        start_date: range?.from ? formatDate(range.from) : undefined,
        end_date: range?.to ? formatDate(range.to) : undefined,
        assignee: selectedAssignees,
      });
      console.log('addCard 호출 후');
      // 성공 후 상태 반영은 useBoardData에서 이미 처리함

      // 2️⃣ 첨부파일 업로드 (파일이 있을 때만)
      if (attachedFiles.length > 0 && newCard) {
        await uploadCardFiles(box.workspaces_id, newCard.id, attachedFiles);
      }
    } catch {
      alert('카드 생성에 실패했습니다.');
    }
  };

  return (
    <>
      <DialogHeader className='flex-row'>
        <DialogTitle>
          {mode === 'create' ? '카드 작성' : '카드 상세/수정'}
        </DialogTitle>
        <DialogDescription>in {box?.title ?? '알 수 없음'}</DialogDescription>
      </DialogHeader>

      <form action='' className='grid gap-4' onSubmit={handleSubmit}>
        <div className='grid gap-4'>
          {/* 제목 영역 */}
          <div className='grid gap-3'>
            <Label htmlFor='title' className='font-semibold'>
              제목
            </Label>
            <Input
              id='title'
              name='title'
              type='text'
              placeholder='제목'
              value={cardtitle}
              onChange={(e) => setCardtitle(e.target.value)}
            />
          </div>

          <div className='flex flex-row justify-between'>
            {/* 색상 영역 */}
            <div className='grid gap-3'>
              <Label htmlFor='color' className='font-semibold'>
                색상
              </Label>
              <div className='flex items-center gap-2'>
                {colorOptions.map((color) => (
                  <div className='flex flex-col content-center gap-1'>
                    <button
                      key={color.code}
                      className={`w-6 h-6 rounded-full border-2 transition-colors ${
                        selectedColor === color.code
                          ? 'border-black scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => setSelectedColor(color.code)}
                      type='button'
                      title={color.name}
                    />
                    <label className='text-xs'>{color.name}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* 일정 영역 */}
            <div className='grid gap-3'>
              <Label htmlFor='dates' className='font-semibold'>
                일정
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    id='dates'
                    className='w-56 justify-between font-normal'
                  >
                    {range?.from && range?.to
                      ? `${formatDate(range.from)} - ${formatDate(range.to)}`
                      : 'YYYY-MM-DD'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='start'
                >
                  <Calendar
                    mode='range'
                    selected={range}
                    captionLayout='dropdown'
                    onSelect={(range) => {
                      setRange(range);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 설명 영역 */}
          <div className='grid gap-3'>
            <Label htmlFor='description' className='font-semibold'>
              설명
            </Label>
            <Textarea
              id='description'
              name='description'
              placeholder='카드에 대한 설명을 적어주세요'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Textarea>
          </div>

          {/* 담당자 영역 */}
          {/* 유저 연결 시 작업 */}
          <div className='grid gap-3'>
            <div className='flex flex-row justify-between'>
              <Label htmlFor='in_charge' className='font-semibold'>
                담당자
              </Label>
              <div className='flex items-center gap-3 text-xs'>
                <Label htmlFor='usercheck' className='text-gray-400'>
                  모두 선택하기
                </Label>
                <Checkbox
                  id='usercheck'
                  checked={selectedUserid.length == users.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUserid(users.map((u) => u.id));
                    } else {
                      setSelectedUserid([]);
                    }
                  }}
                />
              </div>
            </div>
            <div className='flex items-start gap-3'>
              {users.map((user) => {
                const isSelected = selectedUserid.includes(user.id);

                return (
                  <button
                    key={user.id}
                    type='button'
                    onClick={() => {
                      setSelectedUserid((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== user.id)
                          : [...prev, user.id]
                      );
                    }}
                  >
                    <span
                      className={`flex flex-col items-center grow transition-all ${isSelected ? 'opacity-100' : 'opacity-50 grayscale font-light '}`}
                    >
                      <Avatar>
                        <AvatarImage src={user.profile_image} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <strong className='text-xs pt-1 '>
                        {user.name ?? '?'}
                      </strong>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 첨부파일 영역 */}
          <div className='grid gap-3'>
            <div className='flex flex-row justify-between items-center'>
              <Label className='font-semibold'>첨부파일</Label>
              <Button variant='ghost' className='text-gray-400 text-xs'>
                모두 다운받기 +
              </Button>
            </div>
            <div className='flex items-end'>
              <Label
                htmlFor='file-upload'
                className='cursor-pointer border px-4 py-2 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 w-fit'
              >
                파일 선택
              </Label>
              <p className='text-gray-400 text-xs px-2 py-2 '>
                최대 5개까지 저장 가능합니다
              </p>
              <Input
                id='file-upload'
                type='file'
                accept={acceptExtension}
                multiple // 다중 업로드
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
            <div>
              <ul className='mt-2 space-y-2 text-sm'>
                {attachedFiles.map((file, index) => (
                  <li
                    key={index}
                    className='flex justify-between items-center border px-3 py-2 rounded-md bg-gray-50'
                  >
                    <span className='truncate'>{file.name}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveFile(index)}
                      className='text-red-500 text-xs ml-2'
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* </div> */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>삭제하기</Button>
          </DialogClose>
          <Button type='submit'>저장하기</Button>
        </DialogFooter>
      </form>
    </>
  );
}
