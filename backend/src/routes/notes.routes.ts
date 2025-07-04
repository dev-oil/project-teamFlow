import express from 'express';
import * as notesController from '../controllers/notes.controller';

import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verifyAccessToken, notesController.getNotes);
router.get('/:noteId', verifyAccessToken, notesController.getNoteById);
router.post('/', verifyAccessToken, notesController.createNote);
router.put('/:noteId', verifyAccessToken, notesController.updateNote);
router.delete('/:noteId', verifyAccessToken, notesController.deleteNote);

export default router;
