import cors from 'cors';
import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import purchaseRoutes from './src/routes/purchaseRoutes.js';
import transferRoutes from './src/routes/transferRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import assignmentRoutes from './src/routes/assignementRoutes.js';

const app = express();

// _______________ MIDDLEWARE _______________ //

// Allow frontend to talk to backend
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded data into JavaScript object
app.use(express.urlencoded({ extended: true }));

// _______________ ROUTES _______________ //

// Base URL
app.get('/', (req, res) => {
  res.status(200).send('<h1>🛡️ Welcome to Millitary Asset Management Server</h1>')
})

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Military Asset Management API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);

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
