import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import UidManager from './UidManager';

const UPLOAD_DIR = './uploads/logos';

export const logoStorage = diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname) || '.png';
    cb(null, `${UidManager.generateToken()}${ext}`);
  },
});