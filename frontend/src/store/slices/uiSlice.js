import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeView: 'storefront',
  adminTab: 'overview',
  isCartOpen: false,
  isSearchOpen: false,
  isCurrencyModalOpen: false,
  isMobileNavOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login',
  currency: 'USD',
  toast: null
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setAdminTab: (state, action) => {
      state.adminTab = action.payload;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = Boolean(action.payload);
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setSearchOpen: (state, action) => {
      state.isSearchOpen = Boolean(action.payload);
    },
    setCurrencyModalOpen: (state, action) => {
      state.isCurrencyModalOpen = Boolean(action.payload);
    },
    setMobileNavOpen: (state, action) => {
      state.isMobileNavOpen = Boolean(action.payload);
    },
    openAuthModal: (state, action) => {
      state.authModalMode = action.payload || 'login';
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    showToast: (state, action) => {
      const { message, type = 'info' } = typeof action.payload === 'string'
        ? { message: action.payload, type: 'info' }
        : action.payload;
      state.toast = {
        id: Date.now(),
        message,
        type
      };
    },
    hideToast: (state) => {
      state.toast = null;
    }
  }
});

export const {
  setActiveView,
  setAdminTab,
  setCartOpen,
  toggleCart,
  setSearchOpen,
  setCurrencyModalOpen,
  setMobileNavOpen,
  openAuthModal,
  closeAuthModal,
  setCurrency,
  showToast,
  hideToast
} = uiSlice.actions;

export const selectActiveView = (state) => state.ui.activeView;
export const selectAdminTab = (state) => state.ui.adminTab;
export const selectIsCartOpen = (state) => state.ui.isCartOpen;
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen;
export const selectIsCurrencyModalOpen = (state) => state.ui.isCurrencyModalOpen;
export const selectIsMobileNavOpen = (state) => state.ui.isMobileNavOpen;
export const selectIsAuthModalOpen = (state) => state.ui.isAuthModalOpen;
export const selectAuthModalMode = (state) => state.ui.authModalMode;
export const selectCurrency = (state) => state.ui.currency;
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer;
