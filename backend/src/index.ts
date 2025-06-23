import express from 'express';
import cors from 'cors';

import taskRouter from './routes/task';
import invitationRouter from './routes/invitation'; // 초대 토큰
import workspaceRouter from './routes/workspaceRoutes'; //웍스 이름 변경

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// test용 taskRouter
app.use('/api', taskRouter);
app.use('/api/invitations', invitationRouter); //초대 토큰
app.use('/api/workspaces', workspaceRouter); //웍스 이름 변경

// test용
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});