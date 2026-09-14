import mongoose from 'mongoose';
import Product from '../Model/ProductModel.js';
import { seedProductsData } from '../Seed/seedData.js';

// In-memory products store for instant, zero-timeout resilience
let memoryProducts = JSON.parse(JSON.stringify(seedProductsData));

/**
 * Get all products with filtering & sorting
 * GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, maxPrice, search, sortBy } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (category && category !== 'ALL' && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price = { $lte: Number(maxPrice) };
      }

      if (search && search.trim()) {
        const q = search.trim();
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { name: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
          { subtitle: { $regex: q, $options: 'i' } },
          { editorialDescription: { $regex: q, $options: 'i' } }
        ];
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'price-asc') sortOptions = { price: 1 };
      else if (sortBy === 'price-desc') sortOptions = { price: -1 };
      else if (sortBy === 'rating') sortOptions = { rating: -1 };
      else if (sortBy === 'featured') sortOptions = { isBestSeller: -1, rating: -1 };

      const products = await Product.find(query).sort(sortOptions);
      return res.json(products);
    }

    // In-memory fallback
    let list = [...memoryProducts];

    if (category && category !== 'ALL' && category !== 'all') {
      list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      list = list.filter(p => Number(p.price) <= Number(maxPrice));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.subtitle || '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Get individual product by ID or SKU
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findOne({
        $or: [
          { id: id },
          { sku: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found.`
        });
      }

      return res.json(product);
    }

    // In-memory fallback
    const item = memoryProducts.find(p => p.id === id || p.sku === id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`
      });
    }

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;

    if (!productData.title && !productData.name) {
      return res.status(400).json({
        success: false,
        message: 'Product title/name is required.'
      });
    }

    if (productData.price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product price is required.'
      });
    }

    const productId = productData.id || `uc-${Date.now()}`;
    const sku = productData.sku || `UC-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      ...productData,
      id: productId,
      sku: sku,
      title: productData.title || productData.name,
      name: productData.name || productData.title,
      price: Number(productData.price) || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0
    };

    if (mongoose.connection.readyState === 1) {
      const dbProduct = await Product.create(newProduct);
      memoryProducts.unshift(newProduct);
      return res.status(201).json(dbProduct);
    }

    memoryProducts.unshift(newProduct);
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (mongoose.connection.readyState === 1) {
      let product = await Product.findOne({
        $or: [
          { id: id },
          { sku: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found.`
        });
      }

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined && key !== '_id' && key !== 'id') {
          product[key] = updateData[key];
        }
      });

      if (updateData.title && !updateData.name) product.name = updateData.title;
      if (updateData.name && !updateData.title) product.title = updateData.name;

      await product.save();
      return res.json(product);
    }

    // In-memory update
    const idx = memoryProducts.findIndex(p => p.id === id || p.sku === id);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`
      });
    }

    memoryProducts[idx] = { ...memoryProducts[idx], ...updateData };
    return res.json(memoryProducts[idx]);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const result = await Product.deleteOne({
        $or: [
          { id: id },
          { sku: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found.`
        });
      }

      memoryProducts = memoryProducts.filter(p => p.id !== id && p.sku !== id);
      return res.json({
        success: true,
        message: 'Product successfully deleted from catalog.',
        id
      });
    }

    // In-memory delete
    const initialLen = memoryProducts.length;
    memoryProducts = memoryProducts.filter(p => p.id !== id && p.sku !== id);
    if (memoryProducts.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`
      });
    }

    return res.json({
      success: true,
      message: 'Product successfully deleted from catalog.',
      id
    });
  } catch (error) {
    next(error);
  }
};

