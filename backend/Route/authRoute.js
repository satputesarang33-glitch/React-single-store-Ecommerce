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

const router = express.Router();

// Public Authentication Endpoints
router.get('/config', getAuthConfig);
router.post('/register', register);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/google', loginGoogle);
router.post('/send-verification-code', sendOtp);
router.post('/verify-code', verifyOtp);
router.post('/reset-password', resetPassword);

// Authenticated Endpoints
router.get('/me', verifyToken, getMe);
router.patch('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);
router.post('/logout', logout);

export default router;
