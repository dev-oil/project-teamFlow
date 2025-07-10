// routes/upload.route.ts
import express from 'express';
import { upload } from '../middlewares/upload.middleware';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { uploadProfileImage } from '../controllers/upload.controller';

const router = express.Router();

router.post(
  '/profile/upload',
  verifyAccessToken,
  upload.single('file'),
  uploadProfileImage
);

export default router;