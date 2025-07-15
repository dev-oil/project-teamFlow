import express from 'express';
import * as cardController from '../controllers/card.controller';

import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

// router.get('/:workspaceId/cards', verifyAccessToken, cardController.getWorkspaceCards);
// router.put('/:workspaceId/cards/:cardId', verifyAccessToken, cardController.updateCard);

router.get('/', verifyAccessToken, cardController.getCards);
router.get('/:cardId', verifyAccessToken, cardController.getCardById);
router.put('/:cardId', verifyAccessToken, cardController.updateCard);

router.get('/events/end_dates', verifyAccessToken, cardController.getEndDates);
export default router;
