import { Request, Response } from 'express';
import {
  findUserWorkspaces,
  findUserWorkspace,
} from '../services/workspace.service';
import { prisma } from '../db/prisma';

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

//멤버 조회
export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 워크스페이스 ID가 아닙니다.' });
    return;
  }

  try {
    const members = await prisma.members.findMany({
      where: { workspaces_id: workspaceId },
      include: {
        users: true, // 유저 정보 포함
      },
    });

    const formatted = members.map((m) => ({
      id: m.id,
      users_id: m.users_id,
      workspaces_id: m.workspaces_id,
      role: m.role,
      user: {
        id: m.users.id,
        email: m.users.email,
        name: m.users.name,
        phone: m.users.phone,
        profile_image: m.users.profile_image,
        created_at: m.users.created_at,
        updated_at: m.users.updated_at,
      },
    }));

    res.json(formatted);
  } catch (error) {
    console.error('멤버 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};

//멤버 추방
export const removeMember = async (req: Request, res: Response) => {
  const workspaceId = Number(req.params.workspaceId);
  const userId = Number(req.params.userId);

  try {
    await prisma.members.deleteMany({
      where: {
        workspaces_id: workspaceId,
        users_id: userId,
      },
    });

    res.status(200).json({ message: '멤버가 성공적으로 추방되었습니다.' });
  } catch (error) {
    console.error('멤버 추방 오류:', error);
    res.status(500).json({ error: '멤버 추방 실패' });
  }
};

// 워크스페이스 이름 조회
export const getWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }

  try {
    const workspace = await prisma.workspaces.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
      return;
    }
    res.json({ name: workspace.name });
  } catch (error) {
    console.error('워크스페이스 이름 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};

// 워크스페이스 이름 변경
export const updateWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: '유효한 워크스페이스 이름을 입력해주세요.' });
    return;
  }

  try {
    const updated = await prisma.workspaces.update({
      where: { id: workspaceId },
      data: { name },
    });

    res.status(200).json({
      message: '워크스페이스 이름이 변경되었습니다.',
      workspace: updated,
    });
    return;
  } catch (error) {
    console.error('워크스페이스 이름 변경 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
    return;
  }
};

//워크스페이스 삭제
export const deleteWorkspace = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.workspaceId, 10);
  if (isNaN(workspaceId)) {
    res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }

  try {
    await prisma.workspaces.delete({ where: { id: workspaceId } });
    res.json({ success: true });
  } catch (error) {
    console.error('워크스페이스 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};
