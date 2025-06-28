// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { checkUserEmail } from '../controllers/userController'; 

const router = Router();
router.post('/check-email', checkUserEmail);
export default router;