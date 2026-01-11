import { configDotenv } from 'dotenv';
import app from './app.js';

configDotenv();

const port = process.env.port || 5000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();