import { configDotenv } from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

configDotenv();

const port = process.env.PORT || 5000;

// Connect to DB
connectDB(process.env.MONGO_URI);

const startServer = () => {
  try {
    app.listen(port, () => {
      console.log('🚀 Server started at port', port);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer()
