// backend/src/routes/workspaceRoutes.ts
import express from 'express';
import {  
  getWorkspaceName,
  removeMember,
  updateWorkspaceName,
  getWorkspaceMembers,
  deleteWorkspace  } from '../controllers/workspace.controller';

const router = express.Router();

router.get('/:workspaceId/members', getWorkspaceMembers); // 멤버 조회
router.delete('/:workspaceId/members/:userId', removeMember); // 멤버 추방

router.get('/:workspaceId/name', getWorkspaceName); //워크스페이스 이름 불러오기
router.put('/:workspaceId/name', updateWorkspaceName); // 워크스페이스 이름 수정
router.delete('/:workspaceId', deleteWorkspace); // 워크스페이스 삭제

export default router;


