import express from 'express';
import { findUserWorkspaces } from '../services/workspace.service';

const router = express.Router();

// 예: GET /api/1/workspace
router.get('/:userId/workspace', async (req, res) => {
  const { userId } = req.params;

  try {
    const workspaces = await findUserWorkspaces(parseInt(userId));
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({
      message: '워크스페이스를 가져오는데 실패했습니다.',
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
