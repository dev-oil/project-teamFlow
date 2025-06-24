import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers/auth.controller';

/** 로그인 라우터 */
const router = Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);

// 미들 웨어 적용 예
// router.get('/me', verifyAccessToken, getMyProfile);

export default router;
