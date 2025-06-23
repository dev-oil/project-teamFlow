// backend/src/routes/workspaceRoutes.ts
import express from 'express';
import { updateWorkspaceName, getWorkspaceName } from '../controllers/workspaceController';

const router = express.Router();

router.put('/:id/name', updateWorkspaceName); // 컨트롤러 등록
router.get('/:id/name', getWorkspaceName)

export default router;