import { Router } from 'express';
import { login, register, verifyEmail } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);

export default router;
