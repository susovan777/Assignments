import cors from 'cors'
import express from 'express';

const app = express();

// _______________ MIDDLEWARE _______________ //

// Allow frontend to talk to backend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// _______________ ROUTES _______________ //

// Health check
app.get('api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Military Asset Management API is running',
  });
});

// _______________ ERROR HANDLING _______________ //

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
