import express from 'express';
import cors from 'cors';

import noteRouter from './routes/notes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// noteRouter
app.use('/api', noteRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
