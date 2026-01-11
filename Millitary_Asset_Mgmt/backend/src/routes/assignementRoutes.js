import express from 'express';
import {
  createAssignment,
  getAssignments,
  returnAssignment,
  createExpenditure,
  getExpenditures,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { auditLog } from '../middleware/auditLogger.js';

const router = express.Router();

// Assignment routes
router
  .route('/')
  .get(protect, getAssignments)
  .post(
    protect,
    authorize('admin', 'base_commander'),
    auditLog('assignment', 'Assignment'),
    createAssignment
  );

router.put(
  '/:id/return',
  protect,
  authorize('admin', 'base_commander'),
  returnAssignment
);

// Expenditure routes
router
  .route('/expenditures')
  .get(protect, getExpenditures)
  .post(
    protect,
    authorize('admin', 'base_commander'),
    auditLog('expenditure', 'Expenditure'),
    createExpenditure
  );

export default router;
