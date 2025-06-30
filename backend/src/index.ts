import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import taskRouter from './routes/task';
import authRouter from './routes/auth.routes';
import invitationRouter from './routes/invitation.routes'; // 초대 
import workspaceRouter from './routes/workspace.routes'; //워크스페이스 설정


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/invite', invitationRouter); //초대 
app.use('/api/workspaces', workspaceRouter); //워크스페이스 설정

// test용
app.use('/api', taskRouter);
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// 로그인
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
