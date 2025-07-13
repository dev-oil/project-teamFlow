//upload.middleware.ts
import multer from 'multer';
import path from 'path';

// uploads 폴더에 저장되도록 설정
const profileStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.user!.userId}.jpg`);
  },
});
export const uploadProfile = multer({ storage: profileStorage });

// 파일 업로드 multer 설정
export const uploadAttachment = multer({
  storage: multer.diskStorage({
    destination: 'uploads/attachments/',
    filename: (req, file, cb) => {
      const allowed = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.pdf',
        '.doc',
        '.docx',
        '.xls',
        '.xlsx',
        '.ppt',
        '.pptx',
        '.csv',
        '.zip',
      ];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext))
        cb(new Error('허용되지 않은 파일 형식입니다.'), '');
      cb(null, file.originalname + '-' + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
    },
  }),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
});
