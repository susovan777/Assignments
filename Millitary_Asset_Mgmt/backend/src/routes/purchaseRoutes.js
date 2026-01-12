import express from 'express';
import { auditLog } from '../middlewares/auditLogger.js';
import {
  createPurchase,
  getPurchases,
  getPurchase,
} from '../controllers/purchaseController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getPurchases)
  .post(
    protect,
    authorize('admin', 'base_commander', 'logistics_officer'),
    auditLog('purchase', 'Purchase'),
    createPurchase
  );

router.get('/:id', protect, getPurchase);

export default router;
