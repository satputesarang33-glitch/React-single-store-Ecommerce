import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

/**
 * ProtectedRoute Component
 * Route guard that ensures the user is authenticated.
 * If unauthenticated, triggers the auth modal or redirects to /login.
 */
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, showToast } = useStore();

  useEffect(() => {
    if (!currentUser && requireAdmin) {
      showToast('Administrator sign-in required', 'info');
    }
  }, [currentUser, requireAdmin, showToast]);

  if (!currentUser) {
    const redirectTarget = requireAdmin ? '/admin/login' : '/';
    return <Navigate to={redirectTarget} replace />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
