// backend/src/routes/workspaceRoutes.ts
import express from 'express';
import {  
  getWorkspaceName,
  removeMember,
  updateWorkspaceName,
  getWorkspaceMembers,
deleteWorkspace  } from '../controllers/workspaceController';

const router = express.Router();

router.get('/:id/members', getWorkspaceMembers); // 멤버 조회
router.delete('/:workspaceId/members/:userId', removeMember); // 멤버 추방

router.get('/:id/name', getWorkspaceName); //워크스페이스 이름 불러오기
router.put('/:id/name', updateWorkspaceName); // 워크스페이스 이름 수정
router.delete('/:id', deleteWorkspace); // 워크스페이스 삭제

export default router;