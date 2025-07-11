//upload.middleware.ts
import multer from 'multer';
import path from 'path';

// uploads 폴더에 저장되도록 설정
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user!.userId}.jpg`);
  },
});

export const upload = multer({ storage });