import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../Controller/orderController.js';
import { optionalAuth } from '../Middleware/authMiddleware.js';

const router = express.Router();

// GET all orders
router.get('/', optionalAuth, getOrders);

// GET single order by ID or reference
router.get('/:id', optionalAuth, getOrderById);

// POST place order
router.post('/', optionalAuth, createOrder);

// PATCH update order fulfillment state
router.patch('/:id/status', optionalAuth, updateOrderStatus);

export default router;
