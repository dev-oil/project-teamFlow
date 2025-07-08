import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/profile.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/profile', verifyAccessToken, getProfile); //조회
router.put('/profile', verifyAccessToken, updateProfile); //수정
router.put('/change-password', verifyAccessToken, changePassword); //비밀번호 변경
router.delete('/delete-account', verifyAccessToken, deleteAccount); //탈퇴

export default router;
