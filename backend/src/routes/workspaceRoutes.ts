import express from 'express';

import {
  getWorkspaces,
  getWorkspace,
} from '../controllers/workspaceController';

const router = express.Router();

router.get('/:userId/workspace', getWorkspaces);
router.get('/:userId/workspace/:workspaceId', getWorkspace);

export default router;
