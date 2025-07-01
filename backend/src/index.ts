import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notesRouter from './routes/notes.routes';
import authRouter from './routes/auth.routes';
import invitationRouter from './routes/invitationRoutes'; // 초대 토큰
import workspaceRouter from './routes/workspace.routes'; //웍스 이름 변경
import userRouter from './routes/userRoutes'; //이메일 존재 여부 확인
import getBoard from './routes/board';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// 라우터 설정
// app.use('/api/workspaces/:workspaceId/notes', notesRouter);
app.use('/api/:userId/workspace/:workspaceId/notes', notesRouter); // 차후 상단처럼 수정 (userId 지우고)
app.use('/api/invitations', invitationRouter); //초대 토큰
app.use('/api/workspaces', workspaceRouter); //웍스 이름 변경
app.use('/api/users', userRouter); //이메일 존재 여부 확인

// test용 라우터
import testWorkspaceRouter from './routes/testWorkspace.routes';
app.use('/api', testWorkspaceRouter); // "/api/1/workspace"

// 로그인
app.use('/api/auth', authRouter);

// 작업보드
app.use('/api/board', getBoard);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
