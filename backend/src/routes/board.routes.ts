import express from 'express';
import * as boardController from '../controllers/board.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { uploadAttachment } from '../middlewares/upload.middleware';

const router = express.Router({ mergeParams: true });
router.post(
  '/:cardId/files',
  verifyAccessToken,
  uploadAttachment.array('newFiles', 5), // ✅ 파일만 multer로 처리
  boardController.uploadFiles
);
router.use(express.json({ limit: '100mb' }));

router.get('/', verifyAccessToken, boardController.getBoard);
router.post('/', verifyAccessToken, boardController.createBox);
router.post('/:boxId/card', verifyAccessToken, boardController.createCard);

router.put(
  '/:boxId/:cardId/edit',
  verifyAccessToken,
  boardController.patchCard
);
router.delete('/:boxId/:cardId', verifyAccessToken, boardController.deleteCard);

// 작업보드 순서
router.post('/order', verifyAccessToken, boardController.createBox);

export default router;
