//controllers/workspaceController.ts
import { Request, Response } from 'express';
import {
  fetchMembersByWorkspaceId,
  deleteMember,
  getWorkspaceNameById,
  renameWorkspace,
  removeWorkspace,
} from '../services/workspace.service';

const parseIdParam = (param: string): number | null => {
  const id = parseInt(param, 10);
  return isNaN(id) ? null : id;
};

/** 멤버 조회 */ 
export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const workspaceId = parseIdParam(req.params.workspaceId);
  if (!workspaceId) {
     res.status(400).json({ error: '유효한 워크스페이스 ID가 아닙니다.' });
     return;
  }

  try {
    const members = await fetchMembersByWorkspaceId(workspaceId);
    res.json(members);
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : '서버 오류 발생' });
  }
};

/** 멤버 추방 */  
export const removeMember = async (req: Request, res: Response) => {
  const workspaceId = parseIdParam(req.params.workspaceId);
  const userId = parseIdParam(req.params.userId);
  if (!workspaceId || !userId) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  } 

  try {
    await deleteMember(workspaceId, userId);
    res.status(200).json({ message: '멤버가 성공적으로 추방되었습니다.' });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : '멤버 추방 실패' });
  }
};

/**  워크스페이스 이름 조회 */  
export const getWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseIdParam(req.params.workspaceId);
  if (!workspaceId) {
     res.status(400).json({ error: '유효한 ID가 아닙니다.' });
     return;
  } 

  try {
    const workspace = await getWorkspaceNameById(workspaceId);
    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
      return;
    } 

    res.json({ name: workspace.name });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : '서버 오류 발생' });
  }
};

/**  워크스페이스 이름 변경 */   
export const updateWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseIdParam(req.params.workspaceId);
  const { name } = req.body;

  if (!workspaceId || !name || typeof name !== 'string') {
    res.status(400).json({ error: '유효한 워크스페이스 이름을 입력해주세요.' });
   return;
  }

  try {
    const updated = await renameWorkspace(workspaceId, name);
    res.status(200).json({
      message: '워크스페이스 이름이 변경되었습니다.',
      workspace: updated,
    });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : '서버 오류 발생' });
  }
};

/**  워크스페이스 삭제 */  
export const deleteWorkspace = async (req: Request, res: Response) => {
  const workspaceId = parseIdParam(req.params.workspaceId);
  if (!workspaceId) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  } 

  try {
    await removeWorkspace(workspaceId);
    res.json({ success: true });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : '서버 오류 발생' });
  }
};