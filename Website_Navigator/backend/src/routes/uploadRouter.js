import express from 'express';
import multer from 'multer';
import { getUrls, uploadFile } from '../controllers/urlController.js';

const uploadRouter = express.Router();

const storage = multer.memoryStorage(); // keep files in memory
const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    cb(null, allowed.includes(file.mimetype));
  },
});

uploadRouter.get('/latest', getUrls) // get urls if exists
uploadRouter.post('/upload', upload.single('file'), uploadFile); // upload file

export default uploadRouter;
