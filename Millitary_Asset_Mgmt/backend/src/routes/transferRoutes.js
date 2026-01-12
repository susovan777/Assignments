import express from 'express';
import { auditLog } from '../middlewares/auditLogger.js';
import { protect, authorize } from '../middlewares/auth.js';
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
