import { Request, Response } from 'express';
import {
  findUserWorkspaces,
  findUserWorkspace,
} from '../services/workspaceService';

export const getWorkspaces = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  try {
    const workspaces = await findUserWorkspaces(userId);
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: '워크스페이스 목록 조회 실패' });
  }
};

export const getWorkspace = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const workspaceId = parseInt(req.params.workspaceId);
  try {
    const workspace = await findUserWorkspace(userId, workspaceId);
    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
    }
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: '워크스페이스 조회 실패' });
  }
};
