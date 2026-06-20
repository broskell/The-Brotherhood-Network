import express from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';

const router = express.Router();

// Public routes with rate limit protection
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.post('/logout', protect, authController.logout);
router.post('/logout-all', protect, authController.logoutAllDevices);
router.get('/me', protect, authController.getMe);

export default router;
