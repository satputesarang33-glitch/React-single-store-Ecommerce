import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'urbancart_redux_wishlist';

// Safe LocalStorage Reader
const loadInitialWishlist = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load wishlist from localStorage', e);
  }
  return null;
};

// Safe LocalStorage Saver
const saveWishlistToStorage = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist wishlist to localStorage', e);
  }
};

const defaultWishlistItems = [
  {
    id: 'wl-1',
    productId: 'uc-tm-044',
    category: 'HOROLOGY & TECH',
    title: 'Chronos Minimal Ceramic Watch',
    finish: 'Obsidian Matte',
    price: 290.00,
    compareAtPrice: 320.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop',
    badge: 'LIMITED EDITION',
    capsule: 'Studio Essentials'
  },
  {
    id: 'wl-2',
    productId: 'uc-fw-086',
    category: 'FOOTWEAR STUDIO',
    title: 'Mono Classic Low-Top Sneaker',
    finish: 'Chalk White / Raw Gum',
    price: 160.00,
    compareAtPrice: 190.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop',
    badge: 'CURATED PICK',
    capsule: 'Studio Essentials'
  }
];

const initialItems = loadInitialWishlist() || defaultWishlistItems;

const initialState = {
  items: initialItems
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // 1. Add to wishlist
    addToWishlist: (state, action) => {
      const product = action.payload;
      const targetId = product.productId || product.id;
      const exists = state.items.some(
        (i) => i.productId === targetId || i.id === targetId
      );

      if (!exists) {
        const itemToAdd = {
          ...product,
          id: product.id || `wl-${Date.now()}`,
          productId: targetId,
          price: Number(product.price) || 0,
          title: product.title || product.name || 'Atelier Item',
          image: product.image || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500'
        };
        state.items.push(itemToAdd);
        saveWishlistToStorage(state.items);
      }
    },

    // 2. Remove from wishlist
    removeFromWishlist: (state, action) => {
      const targetId = typeof action.payload === 'object'
        ? (action.payload.productId || action.payload.id)
        : action.payload;

      state.items = state.items.filter(
        (i) => i.id !== targetId && i.productId !== targetId
      );
      saveWishlistToStorage(state.items);
    },

    // 3. Toggle wishlist
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const targetId = product.productId || product.id;
      const index = state.items.findIndex(
        (i) => i.productId === targetId || i.id === targetId
      );

      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        const itemToAdd = {
          ...product,
          id: product.id || `wl-${Date.now()}`,
          productId: targetId,
          price: Number(product.price) || 0,
          title: product.title || product.name || 'Atelier Item',
          image: product.image || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500'
        };
        state.items.push(itemToAdd);
      }
      saveWishlistToStorage(state.items);
    },

    // 4. Clear wishlist
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    }
  }
});

// Actions
export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectWishlistTotalValue = (state) =>
  state.wishlist.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

// Check whether product is in wishlist
export const selectIsInWishlist = (state, productId) => {
  if (!productId || !state?.wishlist?.items) return false;
  return state.wishlist.items.some(
    (item) => item.productId === productId || item.id === productId
  );
};

export default wishlistSlice.reducer;
