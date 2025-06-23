import { Router } from 'express';
import { register } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
// router.get('/verify', verifyEmail);

export default router;
