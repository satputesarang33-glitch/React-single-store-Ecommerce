import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../Controller/productController.js';
import { optionalAuth } from '../Middleware/authMiddleware.js';

const router = express.Router();

// GET all products with filtering & search
router.get('/', getProducts);

// GET individual product by ID or SKU
router.get('/:id', getProductById);

// POST create product
router.post('/', optionalAuth, createProduct);

// PUT update product
router.put('/:id', optionalAuth, updateProduct);

// DELETE remove product
router.delete('/:id', optionalAuth, deleteProduct);

export default router;
