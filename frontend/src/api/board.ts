// api/board.ts
import { customFetch } from '@/lib/customFetch';
import type { BoxtypeWithCards, Cardtype } from '@/types/board';

export const fetchBoard = async (
  workspaceId: number
): Promise<BoxtypeWithCards[]> => {
  const res = await customFetch(`/api/workspace/${workspaceId}/board`, {});

  if (!res.ok) throw new Error('보드 데이터 불러오기 실패');

  const data = await res.json();
  const boxes = data as BoxtypeWithCards[];

  const sortedBoxes = boxes
    .map((box) => ({
      ...box,
      cards: box.cards.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);

  return sortedBoxes;
};

// 박스 생성
export const createBox = async (
  workspaceId: number,
  title: string
): Promise<BoxtypeWithCards[]> => {
  const res = await customFetch(`/api/workspace/${workspaceId}/board`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error('박스 생성 실패');
  return res.json();
};

// 카드 생성
export const createCard = async (
  workspaceId: number,
  boxId: string,
  data: {
    title: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    color?: string;
    assignees?: { id: string; name: string; profile_image: string }[];
    // file?: File[]
  }
): Promise<Cardtype> => {
  const res = await customFetch(
    `/api/workspace/${workspaceId}/board/${boxId}/card`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error('카드 생성 실패');

  return res.json();
};

// 첨부파일 업로드
export const uploadCardFiles = async (
  workspaceId: string,
  cardId: string,
  files: File[]
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await customFetch(
    `/api/workspace/${workspaceId}/board/${cardId}/files`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) throw new Error('파일 업로드 실패');
};
