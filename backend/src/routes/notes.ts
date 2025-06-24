import { Router } from 'express';
import { getNotes } from '../controllers/notesController';

const router = Router();

router.get('/notes', getNotes);

export default router;
