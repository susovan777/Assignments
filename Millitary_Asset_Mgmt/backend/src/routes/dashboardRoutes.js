import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getDashboardMetrics,
  getMovementDetails,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', protect, getDashboardMetrics);
router.get('/movements', protect, getMovementDetails);

export default router;
