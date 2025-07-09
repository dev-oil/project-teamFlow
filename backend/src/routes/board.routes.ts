import express from 'express';
import * as boardController from '../controllers/board.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verifyAccessToken, boardController.getBoard);
router.post('/', verifyAccessToken, boardController.createBox);

router.post('/:boxId/card', verifyAccessToken, boardController.createCard);

export default router;
