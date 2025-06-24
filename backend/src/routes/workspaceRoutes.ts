// backend/src/routes/workspaceRoutes.ts
import express from 'express';
import {  
  getWorkspaceName,
  updateWorkspaceName,
  getWorkspaceMembers, } from '../controllers/workspaceController';

const router = express.Router();

router.put('/:id/name', updateWorkspaceName); // 컨트롤러 등록
router.get('/:id/name', getWorkspaceName);
router.get('/:id/members', getWorkspaceMembers); 

export default router;