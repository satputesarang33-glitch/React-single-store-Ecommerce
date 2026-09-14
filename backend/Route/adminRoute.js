import express from 'express';
import {
  getOperationalStats,
  getAdminOrders,
  updateAdminOrderStatus,
  getAdminCustomers,
  toggleProductStock,
  createAdminProduct,
  saveStoreSettings
} from '../Controller/adminController.js';
import { optionalAuth } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', getOperationalStats);
router.get('/orders', optionalAuth, getAdminOrders);
router.patch('/orders/:id/status', optionalAuth, updateAdminOrderStatus);
router.get('/customers', optionalAuth, getAdminCustomers);
router.patch('/products/:id/stock', optionalAuth, toggleProductStock);
router.post('/products', optionalAuth, createAdminProduct);
router.put('/settings', optionalAuth, saveStoreSettings);

export default router;
