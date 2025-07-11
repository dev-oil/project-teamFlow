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

router.post(
  '/:cardId/files',
  verifyAccessToken,
  upload.array('files', 5),
  boardController.uploadFiles
);

export default router;
