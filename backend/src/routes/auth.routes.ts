import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller';

/** 로그인 라우터 */
const router = Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// router.post('/reset', resetPassword);

// 미들 웨어 적용 예
// router.get('/me', verifyAccessToken, getMyProfile);

export default router;
