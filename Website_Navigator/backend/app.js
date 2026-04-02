import cors from 'cors';
import express from 'express';
import uploadRouter from './src/routes/uploadRouter.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    time: new Date().toLocaleString(),
  });
});

app.use('/api', uploadRouter);

app.use(errorHandler);

export default app;
