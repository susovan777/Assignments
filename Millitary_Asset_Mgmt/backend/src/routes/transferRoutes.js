import express from 'express';
import { auditLog } from '../middleware/auditLogger.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  createTransfer,
  getTransfers,
  getTransfer,
} from '../controllers/transferController.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTransfers)
  .post(
    protect,
    authorize('admin', 'base_commander', 'logistics_officer'),
    auditLog('transfer', 'Transfer'),
    createTransfer
  );

router.get('/:id', protect, getTransfer);

export default router;
