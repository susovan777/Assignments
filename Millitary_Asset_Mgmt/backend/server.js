import app from './app.js';
import { configDotenv } from 'dotenv';
import connectDB from './src/config/db.js';

// Load env vars
configDotenv();

const port = process.env.port || 5000;
const mongoUri = process.env.MONGO_URI_LOCAL || process.env.MONGO_URI_ATLAS

// Connect to database
connectDB(mongoUri);

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🔗 API health check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
