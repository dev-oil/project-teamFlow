import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import taskRouter from './routes/task';
import authRouter from './routes/auth.routes';
import invitationRouter from './routes/invitationRoutes'; // 초대 토큰
import workspaceRouter from './routes/workspaceRoutes'; //웍스 이름 변경
import userRouter from './routes/userRoutes'; //이메일 존재 여부 확인
import { connRedis } from './utils/redis';

const app = express();
const PORT = 3001;

(async () => await connRedis())();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/invitations', invitationRouter); //초대 토큰
app.use('/api/workspaces', workspaceRouter); //웍스 이름 변경
app.use('/api/users', userRouter); //이메일 존재 여부 확인

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
