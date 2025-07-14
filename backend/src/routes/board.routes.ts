import express from 'express';
import multer from 'multer';
import * as boardController from '../controllers/board.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

// 파일 업로드 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

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
router.put('/order', verifyAccessToken, boardController.updateOrder);
router.put('/:cardId/pin', verifyAccessToken, boardController.togglePin);
router.post('/sync', boardController.manualSync);

router.post(
  '/:cardId/files',
  verifyAccessToken,
  upload.array('files', 5),
  boardController.uploadFiles
);

export default router;
