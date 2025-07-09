import { Request, Response } from 'express';
import * as workspaceService from '../services/workspace.service';

/** 워크스페이스 생성 */
export const createWorkspace = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const result = await workspaceService.createNewWorkspace(
      req.user!.userId,
      name
    );
    res.status(200).json(result);
  } catch (err: unknown) {
    res.status(500).json({
      title: err,
      description: '워크스페이스 생성 실패',
    });
  }
};

/**  워크스페이스 리스트 */
export const getWorkspaces = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  try {
    const workspaces = await workspaceService.findUserWorkspaces(userId);
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: '워크스페이스 목록 조회 실패' });
  }
};

/**  워크스페이스 한개 */
export const getWorkspace = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = parseInt(req.params.workspaceId);
  try {
    const workspace = await workspaceService.findUserWorkspace(
      userId,
      workspaceId
    );
    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
    }
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ error: '워크스페이스 조회 실패' });
  }
};

/** 멤버 조회 */
export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 워크스페이스 ID가 아닙니다.' });
    return;
  }

  try {
    const members = await workspaceService.fetchMembersByWorkspaceId(
      workspaceId
    );
    res.json(members);
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : '서버 오류 발생',
    });
  }
};

/** 멤버 추방 */
export const removeMember = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = Number(req.params.userId);

  if (!workspaceId || !userId) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }

  try {
    await workspaceService.deleteMember(workspaceId, userId);
    res.status(200).json({ message: '멤버가 성공적으로 추방되었습니다.' });
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : '멤버 추방 실패',
    });
  }
};

/**  워크스페이스 이름 조회 */
export const getWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }

  try {
    const workspace = await workspaceService.getWorkspaceNameById(workspaceId);
    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
      return;
    }

    res.json({ name: workspace.name });
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : '서버 오류 발생',
    });
  }
};

/**  워크스페이스 이름 변경 */
export const updateWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: '유효한 워크스페이스 이름을 입력해주세요.' });
    return;
  }

  try {
    const updated = await workspaceService.renameWorkspace(workspaceId, name);
    res.status(200).json({
      message: '워크스페이스 이름이 변경되었습니다.',
      workspace: updated,
    });
  } catch (error) {
    console.error('워크스페이스 이름 변경 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
    return;
  }
};

/**  워크스페이스 삭제 */
export const deleteWorkspace = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const userId = req.user!.userId;

  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }
  try {
    await workspaceService.deleteWorkspace(workspaceId, userId);
    res.json({ success: true });
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : '서버 오류 발생',
    });
  }
};
