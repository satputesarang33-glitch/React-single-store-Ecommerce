import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// 1. Import Global Store Provider & hook
import { StoreProvider, useStore } from './context/StoreContext';

// 2. Import Helper Route Components
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';

// 3. Import All Public Storefront Pages
import { StorefrontHome } from './pages/StorefrontHome';
import { ShopCatalog } from './pages/ShopCatalog';
import { ProductDetail } from './pages/ProductDetail';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthStandalonePages';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPolicyPage, TermsPage } from './pages/PolicyPages';
import { NotFoundPage } from './pages/NotFoundPage';

// 4. Import Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductEditor } from './pages/AdminProductEditor';
import { AdminLoginPage } from './pages/AdminLoginPage';

// 5. Import Global Overlay Components
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { SearchModal } from './components/SearchModal';
import { CurrencyModal } from './components/CurrencyModal';
import { AuthModal } from './components/AuthModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { OrderDetailsModal } from './components/OrderDetailsModal';

/**
 * Main Application View Controller
 * Declarative URL routing powered by react-router-dom.
 */
const AppContent = () => {
  const { isGoogleModalOpen, closeGoogleModal, openAuthModal, loginWithGoogle } = useStore();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authAction = params.get('auth');
    if (authAction === 'login' || authAction === 'signin') {
      openAuthModal('login');
    } else if (authAction === 'register' || authAction === 'signup') {
      openAuthModal('register');
    } else if (authAction === 'google') {
      loginWithGoogle();
    }
  }, [location.search, openAuthModal, loginWithGoogle]);

  return (
    <div className="app-container">
      {/* Auto-scroll to top on route navigation */}
      <ScrollToTop />

      {/* Main URL Routes */}
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<StorefrontHome />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/shop" element={<ShopCatalog />} />
        <Route path="/category/:category" element={<ShopCatalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Authentication & Patron Profile */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />

        {/* Informational & Policies */}
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Backoffice Management */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminDashboard initialTab="orders" /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute requireAdmin><AdminDashboard initialTab="inventory" /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute requireAdmin><AdminDashboard initialTab="customers" /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><AdminDashboard initialTab="categories" /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminDashboard initialTab="settings" /></ProtectedRoute>} />
        <Route path="/admin/editor" element={<ProtectedRoute requireAdmin><AdminProductEditor /></ProtectedRoute>} />
        <Route path="/admin/editor/:id" element={<ProtectedRoute requireAdmin><AdminProductEditor /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Interactive Drawers & Overlays */}
      <CartDrawer />
      <SearchModal />
      <CurrencyModal />
      <AuthModal />
      <GoogleAuthModal isOpen={isGoogleModalOpen} onClose={closeGoogleModal} />
      <MobileNavDrawer />
      <OrderDetailsModal />
      <Toast />
    </div>
  );
};

/**
 * Root App Component
 * Wraps the application in BrowserRouter and StoreProvider for unified routing and state access.
 */
export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  );
}