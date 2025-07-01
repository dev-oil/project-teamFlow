import { Request, Response } from 'express';
import { boxes } from '../mock/boxes';
import { cards } from '../mock/cards';

export function getBoard(req: Request, res: Response) {
  // 차후 업데이트
  // const { workspace } = req.query;

  // if (!workspace || typeof workspace !== 'string') {
  //   res.status(400).json({ message: '워크스페이스 이름이 필요합니다.' });
  //   return;
  // }

  const workspaceId = 'ws-1';

  const filterBoxes = boxes.filter((box) => box.workspaces_id == workspaceId);

  const enriched = filterBoxes.map((box) => ({
    ...box,
    cards: cards.filter((card) => card.boxes_id == box.id),
  }));

  res.json({ workspaceId, boxes: enriched });
}
