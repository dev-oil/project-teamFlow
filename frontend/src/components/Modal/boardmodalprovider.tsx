import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useModalStore } from '@/stores/useModalStore';

import { Boardmodal } from './boardmodal';

export default function BoardModalProvider() {
  const { open, closeModal, mode, box, card } = useModalStore();

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeModal()}>
      <DialogContent>
        {box && (
          <Boardmodal
            key={card?.id ?? 'new'}
            mode={mode}
            box={box}
            card={card ?? undefined}
            open={open}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
