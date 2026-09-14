import { createSlice } from '@reduxjs/toolkit';
import { initialProducts } from '../../data/products';

const initialState = {
  items: initialProducts,
  selectedProductId: 'uc-fw-086',
  selectedCategory: 'ALL',
  searchQuery: '',
  loading: false,
  error: null
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      const newProduct = action.payload;
      const productWithDefaults = {
        id: newProduct.id || `uc-${Date.now()}`,
        sku: newProduct.sku || `UC-${Math.floor(100 + Math.random() * 900)}`,
        title: newProduct.title || newProduct.name || 'Untitled Specimen',
        name: newProduct.title || newProduct.name || 'Untitled Specimen',
        subtitle: newProduct.subtitle || '',
        category: newProduct.category || 'Accessories',
        brand: newProduct.brand || 'UrbanCart Atelier',
        price: Number(newProduct.price) || 0,
        compareAtPrice: newProduct.compareAtPrice ? Number(newProduct.compareAtPrice) : null,
        stockQuantity: newProduct.stockQuantity !== undefined ? Number(newProduct.stockQuantity) : 25,
        stock: newProduct.stockQuantity !== undefined ? Number(newProduct.stockQuantity) : 25,
        inStock: newProduct.inStock !== undefined ? newProduct.inStock : true,
        editorialDescription: newProduct.editorialDescription || newProduct.description || 'Disciplined design crafted with premium materials.',
        description: newProduct.description || newProduct.editorialDescription || 'Disciplined design crafted with premium materials.',
        images: Array.isArray(newProduct.images) && newProduct.images.length > 0
          ? newProduct.images
          : [{ url: newProduct.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600' }],
        sizes: newProduct.sizes || [{ size: 'Standard', available: true }],
        colorways: newProduct.colorways || [{ name: 'Standard', hex: '#0f1115' }],
        specifications: newProduct.specifications || {},
        rating: 5.0,
        reviewsCount: 0,
        isBestSeller: false
      };
      state.items.unshift(productWithDefaults);
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index > -1) {
        state.items[index] = {
          ...state.items[index],
          ...updated,
          name: updated.title || updated.name || state.items[index].title,
          title: updated.title || updated.name || state.items[index].title,
          price: updated.price !== undefined ? Number(updated.price) : state.items[index].price,
          compareAtPrice: updated.compareAtPrice !== undefined ? Number(updated.compareAtPrice) : state.items[index].compareAtPrice,
          stockQuantity: updated.stockQuantity !== undefined ? Number(updated.stockQuantity) : state.items[index].stockQuantity
        };
      }
    },
    deleteProduct: (state, action) => {
      const targetId = typeof action.payload === 'object' ? action.payload.id : action.payload;
      state.items = state.items.filter((p) => p.id !== targetId);
    },
    setSelectedProductId: (state, action) => {
      state.selectedProductId = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setProductSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  }
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProductId,
  setSelectedCategory,
  setProductSearchQuery
} = productsSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectSelectedProductId = (state) => state.products.selectedProductId;
export const selectSelectedProduct = (state) =>
  state.products.items.find((p) => p.id === state.products.selectedProductId) || state.products.items[0];
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectProductSearchQuery = (state) => state.products.searchQuery;

export default productsSlice.reducer;
