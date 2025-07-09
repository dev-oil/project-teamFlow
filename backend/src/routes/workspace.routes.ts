import express from 'express';

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaceName,
  getWorkspaces,
  removeMember,
  updateWorkspaceName,
} from '../controllers/workspace.controller';

import { verifyAccessToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:workspaceId/members', getWorkspaceMembers); // 멤버 조회
router.delete('/:workspaceId/members/:userId', removeMember); // 멤버 추방

router.post('/', verifyAccessToken, createWorkspace);
router.get('/:workspaceId/name', getWorkspaceName); //워크스페이스 이름 불러오기
router.put('/:workspaceId/name', updateWorkspaceName); // 워크스페이스 이름 수정
router.delete('/:workspaceId', deleteWorkspace); // 워크스페이스 삭제

router.get('/', verifyAccessToken, getWorkspaces); // 유저의 전체 워크스페이스
router.get('/:workspaceId', verifyAccessToken, getWorkspace); // 특정 워크스페이스

export default router;
