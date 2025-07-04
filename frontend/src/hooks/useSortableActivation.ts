// // hooks/useSortableWithActivation.ts
// import {
//   useSortable,
//   type UseSortableArguments,
// } from '@dnd-kit/sortable';

// import {
//   useDraggable,
//   type DraggableSyntheticListeners,
//   type DragActivationConstraint,
// } from '@dnd-kit/core';

// /**
//  * useSortable + activationConstraint 가능하도록 확장
//  */
// export function useSortableWithActivationConstraint(
//   args: UseSortableArguments & { activationConstraint?: DragActivationConstraint }
// ) {
//   const { activationConstraint, ...sortableArgs } = args;

//   const sortable = useSortable(sortableArgs);

//   // useSortable 내부에서 넘겨받은 attributes와 listeners를 다시 전달
//   const draggable = useDraggable({
//     id: args.id,
//     data: args.data,
//     disabled: sortable.disabled,
//     attributes: sortable.attributes,
//     listeners: sortable.listeners as DraggableSyntheticListeners,
//     activationConstraint, // 핵심 포인트!
//   });

//   return {
//     ...sortable,
//     attributes: draggable.attributes,
//     listeners: draggable.listeners,
//   };
// }

// hooks/useSortableWithActivation.ts
import {
  useDraggable,
  type PointerActivationConstraint,
  type UseDraggableArguments,
} from '@dnd-kit/core';
import { useSortable, type UseSortableArguments } from '@dnd-kit/sortable';

interface UseDraggableWithConstraint extends UseDraggableArguments {
  activationConstraint?: PointerActivationConstraint;
}

export function useSortableActivation(
  args: UseSortableArguments & {
    activationConstraint?: PointerActivationConstraint;
  }
) {
  const { activationConstraint, ...sortableArgs } = args;

  const sortable = useSortable(sortableArgs);

  const draggable = useDraggable({
    id: args.id,
    data: args.data, // optional but useful
    activationConstraint, // 핵심 옵션
  } as UseDraggableWithConstraint);

  return {
    ...sortable,
    attributes: draggable.attributes,
    listeners: draggable.listeners,
  };
}
