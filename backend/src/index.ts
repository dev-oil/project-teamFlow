import express from 'express';
import cors from 'cors';

import notesRouter from './routes/notesRoutes';
import workspaceRoutes from './routes/workspaceRoutes';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// noteRouter
app.use('/api', notesRouter);

// workspaceRouter
app.use('/api', workspaceRoutes);

// noteRouter
app.use('/api/:workspaceId/notes', notesRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
