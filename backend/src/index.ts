import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import taskRouter from './routes/task';
import authRouter from './routes/auth.routes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// test용 taskRouter
app.use('/api', taskRouter);

// test용
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

// 로그인
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
