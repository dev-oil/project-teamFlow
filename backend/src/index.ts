import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notesRouter from './routes/notes.routes';
import authRouter from './routes/auth.routes';
import invitationRouter from './routes/invitation.routes'; // 초대
import workspaceRouter from './routes/workspace.routes'; //워크스페이스 설정
import { connRedis } from './utils/redis';
import getBoard from './routes/board';

// test용 라우터
import testWorkspaceRouter from './routes/testWorkspace.routes';

const app = express();
const PORT = 3001;

(async () => await connRedis())();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/invite', invitationRouter); //초대
app.use('/api/workspaces', workspaceRouter); //워크스페이스 설정
// 라우터 설정
// app.use('/api/workspaces/:workspaceId/notes', notesRouter);
app.use('/api/:userId/workspace/:workspaceId/notes', notesRouter); // 차후 상단처럼 수정 (userId 지우고)

// test용 라우터
app.use('/api', testWorkspaceRouter); // "/api/1/workspace"

// 로그인
app.use('/api/auth', authRouter);

// 작업보드
app.use('/api/board', getBoard);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
