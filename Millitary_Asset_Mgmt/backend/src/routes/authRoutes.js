import express from 'express';
import { protect } from '../middlewares/auth.js';
import { login, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
