import { create } from 'zustand';

import type { Cardtype, Boxtype } from '@/types/board';

type ModalMode = 'create' | 'edit';

type ModalStore = {
  open: boolean;
  mode: ModalMode;
  box: Boxtype | null;
  card: Cardtype | null;

  openModal: (mode: ModalMode, box: Boxtype, card?: Cardtype | null) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  mode: 'create',
  box: null,
  card: null,

  openModal: (mode, box, card = null) =>
    set({
      open: true,
      mode,
      box,
      card,
    }),

  closeModal: () =>
    set({
      open: false,
      box: null,
      card: null,
    }),
}));
