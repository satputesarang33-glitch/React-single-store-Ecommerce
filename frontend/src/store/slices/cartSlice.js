import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'urbancart_redux_cart';

// Calculation Helpers
export const calculateSubtotal = (items = []) => {
  return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
};

export const AVAILABLE_COUPONS = {
  URBAN20: { code: 'URBAN20', type: 'percentage', discountValue: 20, value: 20, desc: 'Seasonal Atelier Promo (20% OFF)' },
  WELCOME10: { code: 'WELCOME10', type: 'percentage', discountValue: 10, value: 10, desc: 'New Patron Welcome (10% OFF)' },
  SAVE25: { code: 'SAVE25', type: 'fixed', discountValue: 25, value: 25, desc: 'Fixed Credit ($25 OFF)' },
  FREESHIP: { code: 'FREESHIP', type: 'free_shipping', discountValue: 0, value: 0, desc: 'Complimentary Express Courier Shipping' }
};

export const calculateTotal = (
  subtotal = 0,
  threshold = 250,
  standardShipping = 15,
  taxRate = 0.08,
  appliedCoupon = null
) => {
  let discountAmount = 0;
  let shipping = subtotal >= threshold || subtotal === 0 ? 0 : standardShipping;

  if (appliedCoupon) {
    const val = Number(appliedCoupon.discountValue ?? appliedCoupon.value ?? appliedCoupon.discountPct ?? 0);
    if (appliedCoupon.type === 'percent' || appliedCoupon.type === 'percentage') {
      discountAmount = (subtotal * val) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, val);
    } else if (appliedCoupon.type === 'free_shipping') {
      shipping = 0;
    }
  }

  discountAmount = Math.round(discountAmount * 100) / 100;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

  return {
    discountAmount,
    shipping,
    tax,
    total
  };
};

// Safe LocalStorage Reader
const loadInitialCart = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
  }
  return null;
};

// Safe LocalStorage Saver
const saveCartToStorage = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist cart to localStorage', e);
  }
};

const defaultItems = [
  {
    cartId: 'c-1',
    productId: 'uc-fw-086',
    title: 'Mono Classic Low-Top Sneaker',
    color: 'Chalk White',
    size: '10.0',
    price: 160.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop'
  },
  {
    cartId: 'c-2',
    productId: 'uc-tm-044',
    title: 'Chronos Minimal Ceramic Watch',
    color: 'Obsidian Matte',
    size: '42mm Case',
    price: 290.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop'
  }
];

const initialItems = loadInitialCart() || defaultItems;
const initialSubtotal = calculateSubtotal(initialItems);
const initialCalculations = calculateTotal(initialSubtotal);

const initialState = {
  items: initialItems,
  subtotal: initialSubtotal,
  appliedCoupon: null,
  discountAmount: 0,
  shipping: initialCalculations.shipping,
  tax: initialCalculations.tax,
  total: initialCalculations.total
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. Add Item
    addItem: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex(
        (i) =>
          (i.cartId && item.cartId && i.cartId === item.cartId) ||
          (i.productId === item.productId &&
            i.size === item.size &&
            i.color === item.color)
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += (Number(item.quantity) || 1);
      } else {
        const newItem = {
          ...item,
          cartId: item.cartId || `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        };
        state.items.push(newItem);
      }

      // Recalculate Subtotal & Total
      state.subtotal = calculateSubtotal(state.items);
      const { discountAmount, shipping, tax, total } = calculateTotal(
        state.subtotal,
        250,
        15,
        0.08,
        state.appliedCoupon
      );
      state.discountAmount = discountAmount;
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;

      // Persist in localStorage
      saveCartToStorage(state.items);
    },

    // 2. Remove Item
    removeItem: (state, action) => {
      const cartId = typeof action.payload === 'object' ? action.payload.cartId : action.payload;
      state.items = state.items.filter((i) => i.cartId !== cartId && i.productId !== cartId);

      // Recalculate Subtotal & Total
      state.subtotal = calculateSubtotal(state.items);
      const { discountAmount, shipping, tax, total } = calculateTotal(
        state.subtotal,
        250,
        15,
        0.08,
        state.appliedCoupon
      );
      state.discountAmount = discountAmount;
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;

      // Persist in localStorage
      saveCartToStorage(state.items);
    },

    // 3. Update Quantity
    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const targetQty = Number(quantity);

      if (targetQty <= 0) {
        state.items = state.items.filter((i) => i.cartId !== cartId && i.productId !== cartId);
      } else {
        const item = state.items.find((i) => i.cartId === cartId || i.productId === cartId);
        if (item) {
          item.quantity = targetQty;
        }
      }

      // Recalculate Subtotal & Total
      state.subtotal = calculateSubtotal(state.items);
      const { discountAmount, shipping, tax, total } = calculateTotal(
        state.subtotal,
        250,
        15,
        0.08,
        state.appliedCoupon
      );
      state.discountAmount = discountAmount;
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;

      // Persist in localStorage
      saveCartToStorage(state.items);
    },

    // 4. Clear Cart
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.discountAmount = 0;
      state.shipping = 0;
      state.tax = 0;
      state.total = 0;

      // Clear localStorage
      saveCartToStorage([]);
    },

    // 5. Apply Coupon
    applyCoupon: (state, action) => {
      let coupon = null;
      if (typeof action.payload === 'string') {
        const code = action.payload.trim().toUpperCase();
        coupon = AVAILABLE_COUPONS[code] || null;
        if (!coupon) {
          state.couponError = 'Invalid coupon code';
          return;
        }
      } else if (action.payload && typeof action.payload === 'object') {
        coupon = action.payload;
      }
      state.couponError = null;
      state.appliedCoupon = coupon;
      const { discountAmount, shipping, tax, total } = calculateTotal(
        state.subtotal,
        250,
        15,
        0.08,
        state.appliedCoupon
      );
      state.discountAmount = discountAmount;
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;
    },

    // 6. Remove Coupon
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      const { shipping, tax, total } = calculateTotal(state.subtotal, 250, 15, 0.08, null);
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;
    },

    // Recalculate Subtotal and Total explicitly
    recalculateTotals: (state) => {
      state.subtotal = calculateSubtotal(state.items);
      const { discountAmount, shipping, tax, total } = calculateTotal(
        state.subtotal,
        250,
        15,
        0.08,
        state.appliedCoupon
      );
      state.discountAmount = discountAmount;
      state.shipping = shipping;
      state.tax = tax;
      state.total = total;
    }
  }
});

// Actions export
export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  recalculateTotals
} = cartSlice.actions;

// Selectors export
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectDiscountAmount = (state) => state.cart.discountAmount;
export const selectCartShipping = (state) => state.cart.shipping;
export const selectCartTax = (state) => state.cart.tax;
export const selectCartTotal = (state) => state.cart.total;

export default cartSlice.reducer;
