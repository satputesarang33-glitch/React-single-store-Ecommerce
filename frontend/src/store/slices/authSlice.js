import { createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/api/authService';

const initialUser = typeof window !== 'undefined' ? authService.getCurrentUser() : null;

const initialState = {
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  role: initialUser?.role || 'guest',
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.role = action.payload?.role || 'guest';
      state.error = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.role = 'guest';
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        };
      }
    },
    setAuthLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setCurrentUser,
  logoutUser,
  updateUserProfile,
  setAuthLoading,
  setAuthError,
  clearAuthError
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
