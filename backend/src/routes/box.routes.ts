//box.routes.ts
import express from 'express';
import * as boxController from '../controllers/box.controller';
import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

// 인증 미들웨어 적용!
//router.get('/workspaces/:workspaceId/boxes', verifyAccessToken, boxController.getBoxesByWorkspace);
router.get('/', verifyAccessToken, boxController.getBoxes);
router.get('/:boxId', verifyAccessToken, boxController.getBoxById);
export default router;

