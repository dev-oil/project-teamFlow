// api/board.ts
import { customFetch } from '@/lib/customFetch';
import { useAuthStore } from '@/stores/useAuthStore';
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
    assignee?: { id: string; name: string; profile_image: string }[];
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

// 카드 수정
export const updateCardApi = async (
  workspaceId: number,
  boxId: string,
  cardId: string,
  data: {
    title?: string;
    description?: string;
    color?: string;
    start_date?: string;
    end_date?: string;
    assignee?: { id: string; name: string; profile_image: string }[];
  }
): Promise<Cardtype> => {
  const res = await customFetch(
    `/api/workspace/${workspaceId}/board/${boxId}/${cardId}/edit`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  return res.json();
};

// 카드 삭제
export const deleteCardApi = async (
  workspaceId: number,
  boxId: string,
  cardId: string
) => {
  await customFetch(`/api/workspace/${workspaceId}/board/${boxId}/${cardId}`, {
    method: 'DELETE',
  });
};

// 첨부파일 업로드
export const uploadCardFiles = async (
  workspaceId: string,
  cardId: string,
  formData: FormData
) => {
  const res = await fetch(
    `/api/workspace/${workspaceId}/board/${cardId}/files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
      body: formData,
    }
  );

  if (!res.ok) throw new Error('파일 업로드 실패');
};

// 순서 저장
type OrderPayload = {
  cards?: { id: string; order: number }[];
  boxes?: { id: string; order: number }[];
};

export const persistOrder = async (
  workspaceId: number,
  cards?: { id: string; order: number }[],
  boxes?: { id: string; order: number }[]
) => {
  try {
    const payload: OrderPayload = {};
    if (cards) payload.cards = cards;
    if (boxes) payload.boxes = boxes;

    const res = await customFetch(`/api/workspace/${workspaceId}/board/order`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error('순서 저장 실패', await res.text());
    }
  } catch (err) {
    console.error('순서 저장 중 오류 발생:', err);
  }
};

// 핀 상태
export const togglePinApi = async (
  workspaceId: number,
  cardId: string,
  pinned: boolean
) => {
  return await customFetch(
    `/api/workspace/${workspaceId}/board/${cardId}/pin`,
    {
      method: 'PUT',
      body: JSON.stringify({ pinned }),
    }
  );
};
