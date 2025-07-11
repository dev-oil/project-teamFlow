//box.routes.ts
import express from 'express';
import * as boxController from '../controllers/box.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', verifyAccessToken, boxController.getBoxes);
router.get('/:boxId', verifyAccessToken, boxController.getBoxById);
router.patch('/:boxId', verifyAccessToken, boxController.editBoxName);
router.delete('/:boxId', verifyAccessToken, boxController.deleteBox);
export default router;
