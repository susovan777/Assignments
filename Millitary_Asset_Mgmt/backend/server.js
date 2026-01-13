import app from './app.js';
import { configDotenv } from 'dotenv';
import connectDB from './src/config/db.js';

// Load env vars
configDotenv();

const port = process.env.port || 5000;
const mongoUri =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_ATLAS
    : process.env.MONGO_URI_LOCAL;

// Connect to database
connectDB(mongoUri);

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`
      );
      console.log(`🔗 Base API URL: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
