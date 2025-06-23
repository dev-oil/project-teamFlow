import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
