//controllers/workspaceController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 워크스페이스 이름 조회
export const getWorkspaceName = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
     res.status(400).json({ error: '유효한 ID가 아닙니다.' });
    return;
  }

   try {
    const workspace = await prisma.workspaces.findUnique({
      where: { id },
    });

    if (!workspace) {
      res.status(404).json({ error: '워크스페이스를 찾을 수 없습니다.' });
      return;
    }
    res.json({ name: workspace.name });
    return;
    
  } catch (error) {
    console.error('워크스페이스 이름 조회 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
    return;

  }
};


// 워크스페이스 이름 변경
export const updateWorkspaceName = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.id, 10);
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

    res
      .status(200)
      .json({
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

//멤버 조회
export const getWorkspaceMembers = async (req: Request, res: Response) => {
  const workspaceId = parseInt(req.params.id, 10);
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