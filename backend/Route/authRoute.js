import express from 'express';
import {
  register,
  registerAdmin,
  login,
  loginGoogle,
  getMe,
  updateProfile,
  sendOtp,
  verifyOtp,
  resetPassword,
  changePassword,
  logout,
  getAuthConfig
} from '../Controller/authController.js';
import { verifyToken } from '../Middleware/authMiddleware.js';
import { authLimiter } from '../Middleware/rateLimitMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints (rate-limited against brute force)
router.get('/config', getAuthConfig);
router.post('/register', authLimiter, register);
router.post('/register-admin', authLimiter, registerAdmin);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, loginGoogle);
router.post('/send-verification-code', authLimiter, sendOtp);
router.post('/verify-code', authLimiter, verifyOtp);
router.post('/reset-password', authLimiter, resetPassword);

// Authenticated Endpoints
router.get('/me', verifyToken, getMe);
router.patch('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);
router.post('/logout', logout);

export default router;
