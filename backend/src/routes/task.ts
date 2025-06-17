import { Router } from 'express';
const router = Router();

router.get('/tasks', (req, res) => {
  res.json([{ id: 1, title: '할 일', done: false }]);
});

export default router;
