import { Router } from 'express';
import { getBoard } from '../controllers/board.controller';

const router = Router();

router.get('/', getBoard);

export default router;
