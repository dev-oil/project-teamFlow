// backend/src/routes/workspaceRoutes.ts
import express from 'express';
import { updateWorkspaceName } from '../controllers/workspaceController';

const router = express.Router();

router.put('/:id/name', updateWorkspaceName); // 컨트롤러 등록

export default router;