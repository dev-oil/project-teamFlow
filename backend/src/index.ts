import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import formidable from 'express-formidable';
import path from 'path';

import authRouter from './routes/auth.routes';
import boardRouter from './routes/board.routes';
import boxRouter from './routes/box.routes'; // 캘린더 - 카테고리
import holidaysRoutes from './routes/calendar.routes'; // 캘린더 - 공휴일
import cardRouter from './routes/card.routes'; // 캘린더
import invitationRouter from './routes/invitation.routes'; // 초대
import notesRouter from './routes/notes.routes';
import profileRouter from './routes/profile.routes'; //프로필
import uploadRoutes from './routes/upload.route'; //업로드
import { prisma } from './db/prisma';
import { OrderFromRedisToDB } from './services/board.service';
import workspaceRouter from './routes/workspace.routes'; //워크스페이스 설정
import { connRedis } from './utils/redis';

const app = express();
const PORT = 1004;

(async () => await connRedis())();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'teamflow-gold.vercel.app',
    ],
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

// 작업보드
app.use('/api/workspace/:workspaceId/board', boardRouter);

app.use(express.json());

// 워크스페이스
app.use('/api/workspaces', workspaceRouter); // 워크스페이스
app.use('/api/workspace/:workspaceId/notes', formidable(), notesRouter); // 워크스페이스 내 노트

// 초대
app.use('/api/invite', invitationRouter);

// 로그인
app.use('/api/auth', authRouter);

//캘린더
app.use('/api/workspaces/:workspaceId/boxes', boxRouter);
app.use('/api/workspaces/:workspaceId/cards', cardRouter);
app.use('/api/holidays', holidaysRoutes);

//프로필
app.use('/api', profileRouter);

//업로드
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); // 정적 파일 제공
app.use('/api', uploadRoutes);

// Redis - DB 자동 동기화
async function setupAutoSync() {
  try {
    const workspaces = await prisma.workspaces.findMany({
      select: { id: true },
    });

    const SYNC_INTERVAL = 1000 * 60 * 60 * 6; // 6시간

    workspaces.forEach((ws) => {
      setInterval(async () => {
        try {
          await OrderFromRedisToDB(ws.id);
        } catch (err) {
          console.error(`[SYNC] Workspace ${ws.id} 동기화 실패`, err);
        }
      }, SYNC_INTERVAL);
    });
  } catch (err) {
    console.error('워크스페이스 조회 실패:', err);
  }
}

app.listen(PORT, () => {
  setupAutoSync();
  console.log(`Backend running on http://localhost:${PORT}`);
});
