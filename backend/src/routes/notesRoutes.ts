import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController';

const router = express.Router({ mergeParams: true });

router.get('/', getNotes);
router.get('/:noteId', getNoteById);
router.post('/', createNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;
