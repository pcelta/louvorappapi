import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const UPLOAD_DIR = './uploads/avatars';

export const avatarStorage = diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const code = req.params.code;
    const ext = extname(file.originalname) || '.png';
    cb(null, `${code}${ext}`);
  },
});