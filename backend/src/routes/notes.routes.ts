import express from 'express';
import * as notesController from '../controllers/notes.controller';

const router = express.Router({ mergeParams: true });

router.get('/', notesController.getNotes);
router.get('/:noteId', notesController.getNoteById);
router.post('/', notesController.createNote);
router.put('/:noteId', notesController.updateNote);
router.delete('/:noteId', notesController.deleteNote);

export default router;
