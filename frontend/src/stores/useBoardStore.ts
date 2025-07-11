import { create } from 'zustand';

import type { BoxtypeWithCards } from '@/types/board';

type BoardStore = {
  boxes: BoxtypeWithCards[];
  setBoxes: (b: BoxtypeWithCards[]) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  boxes: [],
  setBoxes: (b) => set({ boxes: b }),
}));
