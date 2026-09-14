import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

// Slices
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// Custom Typed Hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Re-export all slice actions and selectors for convenience
export * from './slices/cartSlice';
export * from './slices/wishlistSlice';
export * from './slices/authSlice';
export * from './slices/productsSlice';
export * from './slices/ordersSlice';
export * from './slices/uiSlice';

export default store;
