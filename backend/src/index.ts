import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notesRouter from './routes/notesRoutes';
import workspaceRoutes from './routes/workspace.routes';
import authRouter from './routes/auth.routes';
import invitationRouter from './routes/invitationRoutes'; // 초대 토큰
import workspaceRouter from './routes/workspace.routes'; //웍스 이름 변경
import userRouter from './routes/userRoutes'; //이메일 존재 여부 확인

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// noteRouter
app.use('/api', notesRouter);

// workspaceRouter
app.use('/api', workspaceRoutes);

// noteRouter
app.use('/api/:workspaceId/notes', notesRouter);
app.use('/api/invitations', invitationRouter); //초대 토큰
app.use('/api/workspaces', workspaceRouter); //웍스 이름 변경
app.use('/api/users', userRouter); //이메일 존재 여부 확인

// 로그인
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
