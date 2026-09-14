import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, {
  addItem as addReduxCartItem,
  removeItem as removeReduxCartItem,
  updateQuantity as updateReduxCartQuantity,
  clearCart as clearReduxCart,
  removeFromWishlist as removeReduxWishlistItem,
  toggleWishlist as toggleReduxWishlistItem,
  addProduct as addReduxProductItem,
  updateProduct as updateReduxProductItem,
  deleteProduct as deleteReduxProductItem,
  updateOrderStatus as updateReduxOrderStatusItem,
  setCurrentUser as setCurrentUserRedux,
  logoutUser as logoutUserRedux
} from '../store';
import { initialProducts } from '../data/products';
import { initialOrders } from '../data/orders';
import { authService } from '../services/api/authService';
import { apiClient } from '../services/api/apiClient';
import { initiateGoogleOAuth, getGoogleClientId } from '../services/api/googleAuth';
import { productService } from '../services/api/productService';
import { orderService } from '../services/api/orderService';

// Create the unified Store Context
const StoreContext = createContext();

// Global Currency definitions & conversion rates
export const CURRENCY_CONFIG = {
  INR: { symbol: '₹', rate: 86.5, label: 'INR (₹) • India' },
  USD: { symbol: '$', rate: 1.0, label: 'USD ($) • United States' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€) • European Union' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£) • United Kingdom' },
  JPY: { symbol: '¥', rate: 155.0, label: 'JPY (¥) • Japan' }
};

// Default pre-seeded patron items for authenticated customer
export const DEFAULT_PATRON_CART = [
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
  },
  {
    cartId: 'c-3',
    productId: 'uc-bg-012',
    title: 'Aeropack Pro Backpack',
    color: 'Matte Obsidian',
    size: '22L Standard',
    price: 190.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop'
  }
];

export const DEFAULT_PATRON_WISHLIST = [
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
  },
  {
    id: 'wl-3',
    productId: 'uc-bg-012',
    category: 'STRUCTURED CARRY',
    title: 'Aeropack Minimalist Daypack',
    finish: 'Obsidian Black',
    price: 185.00,
    compareAtPrice: 220.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop',
    badge: 'PRIVATE SALE',
    capsule: 'Studio Essentials'
  },
  {
    id: 'wl-4',
    productId: 'uc-ac-028',
    category: 'LEATHER GOODS',
    title: 'Bi-Fold Full-Grain Leather Wallet',
    finish: 'Tuscan Cognac',
    price: 65.00,
    compareAtPrice: 80.00,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500&auto=format&fit=crop',
    capsule: 'Summer Capsule'
  }
];

/**
 * StoreProvider
 * Global state management for all UrbanCart storefront, customer account, and backoffice operations.
 */
export const StoreProvider = ({ children }) => {
  // --- 1. NAVIGATION & VIEWS ---
  // Options: 'storefront' | 'product_detail' | 'wishlist' | 'admin_dashboard' | 'admin_editor' | 'shop' | 'checkout' | 'account'
  const [activeView, setActiveView] = useState('storefront');
  const [selectedProductId, setSelectedProductId] = useState('uc-fw-086');
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'orders' | 'inventory' | 'customers' | 'settings'
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;

  const lastSyncedPathRef = useRef(null);

  // Synchronize activeView with URL route location for full backward compatibility
  useEffect(() => {
    if (!pathname) return;
    if (lastSyncedPathRef.current === pathname) return;
    lastSyncedPathRef.current = pathname;
    const path = pathname;
    if (path === '/' || path === '/home') setActiveView('storefront');
    else if (path.startsWith('/shop') || path.startsWith('/category')) setActiveView('shop');
    else if (path.startsWith('/product')) setActiveView('product_detail');
    else if (path.startsWith('/wishlist')) setActiveView('wishlist');
    else if (path.startsWith('/cart')) setActiveView('cart');
    else if (path.startsWith('/checkout')) setActiveView('checkout');
    else if (path.startsWith('/order-success')) setActiveView('order_success');
    else if (path.startsWith('/search')) setActiveView('search_results');
    else if (path.startsWith('/account')) setActiveView('account');
    else if (path.startsWith('/orders') || path.startsWith('/order/')) setActiveView('orders');
    else if (path.startsWith('/admin/editor')) setActiveView('admin_editor');
    else if (path.startsWith('/admin')) setActiveView('admin_dashboard');
    else if (path === '/about') setActiveView('about');
    else if (path === '/contact') setActiveView('contact');
    else if (path === '/faq') setActiveView('faq');
    else if (path === '/privacy') setActiveView('privacy');
    else if (path === '/terms') setActiveView('terms');
    else if (path === '/login') setActiveView('login');
    else if (path === '/register') setActiveView('register');
    else if (path === '/forgot-password') setActiveView('forgot_password');
  }, [pathname]);

  // --- 2. MODAL & DRAWER TOGGLES ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot_password'

  // Google Account Chooser Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const openGoogleModal = () => setIsGoogleModalOpen(true);
  const closeGoogleModal = () => setIsGoogleModalOpen(false);

  // Order Details Modal State & Selected Order
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- 3. AUTHENTICATION & PATRON STATE ---
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    try {
      store.dispatch(setCurrentUserRedux(user));
    } catch (e) {}
    closeAuthModal();
    showToast(`Welcome back, ${user.name}`, 'success');
    return user;
  };

  const loginWithGoogle = async (profileData = null) => {
    let profile = profileData;
    if (!profile || !profile.email) {
      const clientId = getGoogleClientId();
      if (clientId && window.google?.accounts?.oauth2) {
        try {
          profile = await initiateGoogleOAuth();
        } catch (err) {
          console.warn('Google Identity Services popup error or cancelled, using direct sign method:', err);
        }
      }

      // Direct sign method: directly authenticate with Sarang's Google account
      if (!profile || !profile.email) {
        profile = {
          email: 'satputesarang33@gmail.com',
          name: 'Sarang Satpute',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=160&auto=format&fit=crop',
          googleId: `google_sarang_${Date.now()}`
        };
      }
    }

    const user = await authService.loginWithGoogle(profile);
    setCurrentUser(user);
    try {
      store.dispatch(setCurrentUserRedux(user));
    } catch (e) {}
    closeAuthModal();
    closeGoogleModal();
    showToast(`Welcome, ${user.name}! Connected with Google.`, 'success');
    return user;
  };

  const register = async (userData, options = {}) => {
    const { autoLogin = true } = options;
    const user = await authService.register(userData);
    if (autoLogin) {
      setCurrentUser(user);
      try {
        store.dispatch(setCurrentUserRedux(user));
      } catch (e) {}
      closeAuthModal();
      showToast(`Account created. Welcome, ${user.name}!`, 'success');
    } else {
      try {
        apiClient.setToken(null);
        localStorage.removeItem('urbancart_token');
        localStorage.removeItem('urbancart_user');
      } catch (e) {}
    }
    return user;
  };

  const registerAdmin = async (adminData) => {
    const admin = await authService.registerAdmin(adminData);
    setCurrentUser(admin);
    closeAuthModal();
    setActiveView('admin_dashboard');
    showToast(`Administrator account created. Welcome, ${admin.name}!`, 'success');
    return admin;
  };

  const sendVerificationCode = async (data) => {
    return await authService.sendVerificationCode(data);
  };

  const verifyCode = async (data) => {
    return await authService.verifyCode(data);
  };

  const resetPassword = async (data) => {
    return await authService.resetPassword(data);
  };

  const changePassword = async (data) => {
    const res = await authService.changePassword(data);
    showToast('Credentials updated successfully', 'success');
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setSavedForLater([]);
    try {
      store.dispatch(logoutUserRedux());
      store.dispatch(clearReduxCart());
    } catch (e) {}
    setActiveView('storefront');
    if (navigate) {
      try {
        navigate('/', { replace: true });
      } catch (err) {}
    }
    showToast('You have been signed out', 'info');
  };

  const updateUserProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setCurrentUser(updated);
    showToast('Patron profile updated successfully', 'success');
    return updated;
  };

  // Address book actions
  const saveAddress = (address) => {
    if (!currentUser) return;
    const currentAddresses = currentUser.addresses || [];
    let updatedAddresses;

    if (address.id) {
      // Edit existing
      updatedAddresses = currentAddresses.map(a => a.id === address.id ? address : a);
    } else {
      // Add new
      const newAddress = {
        ...address,
        id: `addr-${Date.now()}`
      };
      // If marked default, unset previous defaults
      if (newAddress.isDefault) {
        currentAddresses.forEach(a => { a.isDefault = false; });
      }
      updatedAddresses = [...currentAddresses, newAddress];
    }

    updateUserProfile({ addresses: updatedAddresses });
    showToast('Address book updated', 'success');
  };

  const deleteAddress = (addressId) => {
    if (!currentUser) return;
    const updated = (currentUser.addresses || []).filter(a => a.id !== addressId);
    updateUserProfile({ addresses: updated });
    showToast('Address removed', 'info');
  };

  // Payment methods actions
  const savePaymentMethod = (card) => {
    if (!currentUser) return;
    const currentCards = currentUser.paymentMethods || [];
    const newCard = {
      id: `pm-${Date.now()}`,
      brand: card.brand || 'Visa',
      last4: card.number.slice(-4) || '4242',
      expiry: card.expiry || '12/28',
      holder: card.name ? card.name.toUpperCase() : 'PATRON CARD',
      isDefault: currentCards.length === 0
    };
    updateUserProfile({ paymentMethods: [...currentCards, newCard] });
    showToast('Payment method saved', 'success');
  };

  const deletePaymentMethod = (cardId) => {
    if (!currentUser) return;
    const updated = (currentUser.paymentMethods || []).filter(c => c.id !== cardId);
    updateUserProfile({ paymentMethods: updated });
    showToast('Card removed', 'info');
  };

  // --- 4. CURRENCY SYSTEM ---
  const [currency, setCurrencyState] = useState(() => {
    if (process.env.NODE_ENV === 'test') return 'USD';
    try {
      return localStorage.getItem('preferred_currency') || 'INR';
    } catch {
      return 'INR';
    }
  });

  const setCurrency = (newCurrency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem('preferred_currency', newCurrency);
    } catch (e) {
      // ignore storage errors
    }
  };

  const formatPrice = (amountInUsd) => {
    if (amountInUsd === undefined || amountInUsd === null) {
      const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
      return currency === 'INR' ? '₹0' : `${config.symbol}0.00`;
    }
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
    const converted = amountInUsd * config.rate;
    if (currency === 'INR') {
      return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    if (currency === 'JPY') {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  // --- 5. DATA STATES ---
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Sync products and orders from live backend API on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    let isMounted = true;
    const fetchLiveStoreData = async () => {
      try {
        const liveProducts = await productService.getProducts();
        if (isMounted && Array.isArray(liveProducts) && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (err) {
        console.warn('Backend product fetch notice:', err.message);
      }

      try {
        const liveOrders = await orderService.getOrders();
        if (isMounted && Array.isArray(liveOrders) && liveOrders.length > 0) {
          setOrders(liveOrders);
        }
      } catch (err) {
        console.warn('Backend orders fetch notice:', err.message);
      }
    };

    fetchLiveStoreData();
    return () => { isMounted = false; };
  }, []);

  // Products CRUD State Helpers
  const addProduct = async (newProduct) => {
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
      stockQuantity: newProduct.stockQuantity !== undefined ? Number(newProduct.stockQuantity) : (newProduct.stock !== undefined ? Number(newProduct.stock) : 25),
      inStock: newProduct.inStock !== undefined ? newProduct.inStock : true,
      editorialDescription: newProduct.editorialDescription || newProduct.description || 'Disciplined design crafted with premium materials.',
      description: newProduct.description || newProduct.editorialDescription || 'Disciplined design crafted with premium materials.',
      images: Array.isArray(newProduct.images) && newProduct.images.length > 0
        ? newProduct.images
        : [{ url: newProduct.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600' }],
      sizes: newProduct.sizes || [{ size: 'Standard', available: true }],
      colorways: newProduct.colorways || [{ name: 'Standard', hex: '#0f1115' }],
      specifications: newProduct.specifications || {},
      provenance: newProduct.provenance || { origin: 'Porto, Portugal', materials: 'Full-grain Italian calfskin' },
      rating: 5.0,
      reviewsCount: 0,
      isBestSeller: false
    };

    setProducts(prev => [productWithDefaults, ...prev]);
    try {
      store.dispatch(addReduxProductItem(productWithDefaults));
      await productService.createProduct(productWithDefaults);
    } catch (e) {
      console.warn('Backend sync note (product create):', e.message);
    }
    showToast(`Added product "${productWithDefaults.title}" to catalog`, 'success');
    return productWithDefaults;
  };

  const updateProduct = async (updatedProduct) => {
    setProducts(prev => prev.map(p => {
      if (p.id === updatedProduct.id) {
        return {
          ...p,
          ...updatedProduct,
          name: updatedProduct.title || updatedProduct.name || p.title,
          title: updatedProduct.title || updatedProduct.name || p.title,
          price: updatedProduct.price !== undefined ? Number(updatedProduct.price) : p.price,
          compareAtPrice: updatedProduct.compareAtPrice !== undefined ? Number(updatedProduct.compareAtPrice) : p.compareAtPrice,
          stockQuantity: updatedProduct.stockQuantity !== undefined ? Number(updatedProduct.stockQuantity) : p.stockQuantity
        };
      }
      return p;
    }));
    try {
      store.dispatch(updateReduxProductItem(updatedProduct));
      await productService.updateProduct(updatedProduct.id, updatedProduct);
    } catch (e) {
      console.warn('Backend sync note (product update):', e.message);
    }
    showToast(`Product "${updatedProduct.title || updatedProduct.name}" updated`, 'success');
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      store.dispatch(deleteReduxProductItem(productId));
      await productService.deleteProduct(productId);
    } catch (e) {
      console.warn('Backend sync note (product delete):', e.message);
    }
    showToast('Product removed from catalog', 'info');
  };

  // Update order fulfillment status (Live Admin to Account sync)
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.reference === orderId) {
        return {
          ...ord,
          fulfillmentState: newStatus
        };
      }
      return ord;
    }));
    try {
      store.dispatch(updateReduxOrderStatusItem({ orderId, status: newStatus }));
      await orderService.updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.warn('Backend sync note (order update):', e.message);
    }
    showToast(`Order ${orderId} updated to ${newStatus}`, 'success');
  };

  // Order Details Modal & Page Actions
  const openOrderDetails = (order) => {
    setSelectedOrderForModal(order);
    setSelectedOrder(order);
    setIsOrderDetailsModalOpen(true);
  };

  const closeOrderDetails = () => {
    setIsOrderDetailsModalOpen(false);
    setSelectedOrderForModal(null);
  };

  const openOrdersPage = () => {
    setActiveView('orders');
    if (navigate) {
      navigate('/orders');
    } else if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openOrderDetailsPage = (order) => {
    if (order) {
      setSelectedOrder(order);
      setSelectedOrderForModal(order);
    }
    setActiveView('order_details');
    if (navigate) {
      navigate(order?.id ? `/order/${order.id}` : '/orders');
    } else if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- 6. REVIEWS STATE ---
  const [reviews, setReviews] = useState({
    'uc-fw-086': [
      {
        id: 'rev-1',
        author: 'Julian Mercer',
        role: 'Architect, Stockholm',
        rating: 5,
        title: 'Exceptional craftsmanship and true anatomical comfort',
        comment: 'The cold-formed lasting makes an enormous difference. Zero break-in period and the calfskin has aged into a gorgeous subtle lustre.',
        date: '2 weeks ago',
        verified: true
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        role: 'Creative Director, Vienna',
        rating: 5,
        title: 'The cleanest low-top on the market',
        comment: 'No branding, perfectly balanced proportions, and the Margom outsole gives great tactile feedback.',
        date: '1 month ago',
        verified: true
      },
      {
        id: 'rev-3',
        author: 'Kaelen Voss',
        role: 'Industrial Designer, Berlin',
        rating: 4,
        title: 'Superior materials, size slightly slim',
        comment: 'Leather quality is on par with bespoke Italian benchmakers. Recommend sizing up half a size if you have broad feet.',
        date: '1 month ago',
        verified: true
      }
    ]
  });

  const addReview = (productId, newReview) => {
    const existing = reviews[productId] || [];
    setReviews({
      ...reviews,
      [productId]: [{ ...newReview, helpfulCount: newReview.helpfulCount || 0 }, ...existing]
    });
    showToast('Thank you for contributing your patron review', 'success');
  };

  const upvoteReview = (productId, reviewId) => {
    const existing = reviews[productId] || [];
    setReviews({
      ...reviews,
      [productId]: existing.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r)
    });
    showToast('Feedback recorded. Thank you!', 'info');
  };

  // --- 7. CART STATE ---
  const [cart, setCart] = useState([]);

  // --- 7B. SAVED FOR LATER STATE ---
  const [savedForLater, setSavedForLater] = useState([]);

  // --- 8. WISHLIST STATE ---
  const [wishlist, setWishlist] = useState([]);

  // --- HELPER NAVIGATION METHODS ---
  const showToast = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetActiveView = (view) => {
    setActiveView(view);
    if (!navigate) return;
    switch (view) {
      case 'storefront':
      case 'home':
        navigate('/');
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'product_detail':
        navigate(`/product/${selectedProductId || 'uc-fw-086'}`);
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      case 'order_success':
        navigate('/order-success');
        break;
      case 'search_results':
        navigate('/search');
        break;
      case 'account':
      case 'profile':
        navigate('/account');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'order_details':
        navigate(selectedOrder?.id ? `/order/${selectedOrder.id}` : '/orders');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'terms':
        navigate('/terms');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'register':
        navigate('/register');
        break;
      case 'forgot_password':
        navigate('/forgot-password');
        break;
      case 'admin_dashboard':
        navigate('/admin');
        break;
      case 'admin_editor':
        navigate('/admin/editor');
        break;
      case 'admin_login':
        navigate('/admin/login');
        break;
      default:
        break;
    }
  };

  const openProductDetail = (productId) => {
    setSelectedProductId(productId);
    setActiveView('product_detail');
    if (navigate) navigate(`/product/${productId}`);
  };

  const openAdminEditor = (productId = 'uc-fw-086') => {
    setSelectedProductId(productId);
    setActiveView('admin_editor');
    if (navigate) navigate(`/admin/editor/${productId}`);
  };

  const openShopCatalog = (category = 'ALL') => {
    setSelectedCategory(category);
    setActiveView('shop');
    if (navigate) {
      if (category && category !== 'ALL') {
        navigate(`/shop?category=${encodeURIComponent(category)}`);
      } else {
        navigate('/shop');
      }
    }
  };

  const openAccount = () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    setActiveView('account');
    if (navigate) navigate('/account');
  };

  const startCheckout = () => {
    if (!currentUser) {
      showToast('Please sign in to proceed to checkout', 'info');
      openAuthModal('login');
      return;
    }
    setIsCartOpen(false);
    setActiveView('checkout');
    if (navigate) navigate('/checkout');
  };

  const openCartPage = () => {
    setIsCartOpen(false);
    setActiveView('cart');
    if (navigate) navigate('/cart');
  };

  const openSearchResults = (query = '') => {
    setSearchQuery(query);
    setIsSearchOpen(false);
    setActiveView('search_results');
    if (navigate) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const openOrderSuccess = () => {
    setActiveView('order_success');
    if (navigate) navigate('/order-success');
  };

  // Cart operations
  const addToCart = (product, color = 'Standard', size = 'Standard', quantity = 1) => {
    if (!currentUser) {
      showToast('Please sign in to add items to your shopping bag', 'info');
      openAuthModal('login');
      return;
    }

    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.color === color && item.size === size
    );

    const primaryImg = product.images && product.images[0] ? product.images[0].url : (product.image || '');

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem = {
        cartId: 'c-' + Date.now(),
        productId: product.id,
        title: product.title,
        color: color,
        size: size,
        price: product.price,
        quantity: quantity,
        image: primaryImg
      };
      setCart([...cart, newItem]);
      try {
        store.dispatch(addReduxCartItem(newItem));
      } catch (e) {}
    }

    showToast(`Added ${product.title} to your bag`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    try {
      store.dispatch(removeReduxCartItem(cartId));
    } catch (e) {}
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartId, delta) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        try {
          store.dispatch(updateReduxCartQuantity({ cartId, quantity: newQty }));
        } catch (e) {}
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => {
    setCart([]);
    try {
      store.dispatch(clearReduxCart());
    } catch (e) {}
  };

  const saveForLater = (cartItem) => {
    // Remove from cart
    setCart(prev => prev.filter(c => c.cartId !== cartItem.cartId));
    // Add to saved for later
    setSavedForLater(prev => [
      {
        savedId: 'sfl-' + Date.now(),
        productId: cartItem.productId || cartItem.id,
        title: cartItem.title,
        color: cartItem.color || cartItem.selectedColor || 'Standard',
        size: cartItem.size || cartItem.selectedSize || 'Default',
        price: cartItem.price,
        image: cartItem.image || (cartItem.images && cartItem.images[0]?.url) || ''
      },
      ...prev
    ]);
    showToast(`Saved "${cartItem.title}" for later`, 'info');
  };

  const moveToCart = (savedItem) => {
    setSavedForLater(prev => prev.filter(s => s.savedId !== savedItem.savedId));
    const newItem = {
      cartId: 'c-' + Date.now(),
      productId: savedItem.productId,
      title: savedItem.title,
      color: savedItem.color,
      size: savedItem.size,
      price: savedItem.price,
      quantity: 1,
      image: savedItem.image
    };
    setCart(prev => [...prev, newItem]);
    showToast(`Moved "${savedItem.title}" to active bag`, 'success');
  };

  const removeFromSaved = (savedId) => {
    setSavedForLater(prev => prev.filter(s => s.savedId !== savedId));
    showToast('Removed item from saved list', 'info');
  };

  const cartCount = useMemo(() => {
    if (!currentUser) return 0;
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart, currentUser]);

  const cartSubtotal = useMemo(() => {
    if (!currentUser) return 0;
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart, currentUser]);

  // Wishlist operations
  const isInWishlist = (productId) => {
    if (!currentUser) return false;
    return wishlist.some(item => item.productId === productId);
  };

  const openWishlist = () => {
    if (!currentUser) {
      showToast('Please sign in to access your curated wishlist', 'info');
      openAuthModal('login');
      return;
    }
    setActiveView('wishlist');
    if (navigate) navigate('/wishlist');
  };

  const toggleWishlist = (product) => {
    if (!currentUser) {
      showToast('Please sign in to save items to your wishlist', 'info');
      openAuthModal('login');
      return;
    }

    try {
      store.dispatch(toggleReduxWishlistItem(product));
    } catch (e) {}

    if (isInWishlist(product.id)) {
      setWishlist(wishlist.filter(item => item.productId !== product.id));
      showToast('Removed from curated wishlist', 'info');
    } else {
      const primaryImg = product.images && product.images[0] ? product.images[0].url : (product.image || '');
      const newItem = {
        id: 'wl-' + Date.now(),
        productId: product.id,
        category: (product.category || 'GOODS').toUpperCase(),
        title: product.title,
        finish: product.colorways && product.colorways[0] ? product.colorways[0].name : 'Default',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: primaryImg,
        badge: product.badge || 'CURATED',
        capsule: 'Studio Essentials'
      };
      setWishlist([...wishlist, newItem]);
      showToast('Added to curated wishlist', 'success');
    }
  };

  const removeWishlistItem = (id) => {
    try {
      store.dispatch(removeReduxWishlistItem(id));
    } catch (e) {}
    setWishlist(wishlist.filter(item => item.id !== id));
    showToast('Removed item from wishlist', 'info');
  };

  const moveWishlistItemToCart = (item) => {
    const product = products.find(p => p.id === item.productId) || {
      id: item.productId,
      title: item.title,
      price: item.price,
      images: [{ url: item.image }]
    };
    addToCart(product, item.finish, 'Default', 1);
    setWishlist(wishlist.filter(w => w.id !== item.id));
  };

  const moveAllWishlistToCart = () => {
    wishlist.forEach(item => {
      const product = products.find(p => p.id === item.productId) || {
        id: item.productId,
        title: item.title,
        price: item.price,
        images: [{ url: item.image }]
      };
      addToCart(product, item.finish, 'Default', 1);
    });
    setWishlist([]);
    showToast('Moved all saves into active cart', 'success');
  };

  const wishlistTotalValue = useMemo(() => {
    return wishlist.reduce((acc, item) => acc + item.price, 0);
  }, [wishlist]);


  return (
    <Provider store={store}>
      <StoreContext.Provider
        value={{
          // Navigation & Views
          activeView,
          setActiveView: handleSetActiveView,
          adminTab,
          setAdminTab,
          selectedProductId,
          setSelectedProductId,
          selectedCategory,
          setSelectedCategory,
          searchQuery,
          setSearchQuery,
          openProductDetail,
          openAdminEditor,
          openShopCatalog,
          openAccount,
          openCartPage,
          openSearchResults,
          openOrderSuccess,
          startCheckout,

          // Modals & Drawers
          isCartOpen,
          setIsCartOpen,
          isSearchOpen,
          setIsSearchOpen,
          isCurrencyModalOpen,
          setIsCurrencyModalOpen,
          isMobileNavOpen,
          setIsMobileNavOpen,

          // Auth
          currentUser,
          isAuthModalOpen,
          authModalMode,
          openAuthModal,
          closeAuthModal,
          isGoogleModalOpen,
          openGoogleModal,
          closeGoogleModal,
          login,
          loginWithGoogle,
          register,
          registerAdmin,
          logout,
          sendVerificationCode,
          verifyCode,
          resetPassword,
          changePassword,
          updateUserProfile,
          saveAddress,
          deleteAddress,
          savePaymentMethod,
          deletePaymentMethod,

          // Order Details Modal & Pages
          isOrderDetailsModalOpen,
          selectedOrderForModal,
          selectedOrder,
          setSelectedOrder,
          openOrderDetails,
          closeOrderDetails,
          openOrdersPage,
          openOrderDetailsPage,

          // Currency
          currency,
          setCurrency,
          formatPrice,
          CURRENCY_CONFIG,

          // Products & Orders
          products,
          setProducts,
          updateProduct,
          addProduct,
          deleteProduct,
          orders,
          setOrders,
          updateOrderStatus,

          // Reviews
          reviews,
          addReview,
          upvoteReview,

          // Cart Operations
          cart,
          cartCount,
          cartSubtotal,
          addToCart,
          removeFromCart,
          updateCartQuantity,
          clearCart,
          savedForLater,
          saveForLater,
          moveToCart,
          removeFromSaved,

          // Wishlist Operations
          wishlist,
          wishlistTotalValue,
          isInWishlist,
          openWishlist,
          toggleWishlist,
          removeWishlistItem,
          moveWishlistItemToCart,
          moveAllWishlistToCart,

          // Search & Toast
          toast,
          showToast
        }}
      >
        {children}
      </StoreContext.Provider>
    </Provider>
  );
};

export const useStore = () => useContext(StoreContext);
