import express from 'express';
import cors from 'cors';

import taskRouter from './routes/task';
//초대 토큰
import invitationRouter from './routes/invitation';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// test용 taskRouter
app.use('/api', taskRouter);

// test용
app.get('/api/ping', (_req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

//초대 토큰
app.use('/api', invitationRouter);
