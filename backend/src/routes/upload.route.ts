// routes/upload.route.ts
import express from 'express';
import { uploadProfileImage } from '../controllers/upload.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';
import { uploadProfile } from '../middlewares/upload.middleware';

const router = express.Router();

router.post(
  '/profile/upload',
  verifyAccessToken,
  uploadProfile.single('file'),
  uploadProfileImage
);

export default router;
