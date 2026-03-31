import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/urlController.js';

const uploadRouter = express.Router();

const storage = multer.memoryStorage(); // keep files in memory
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/', upload.single('file'), uploadFile);

export default uploadRouter;
