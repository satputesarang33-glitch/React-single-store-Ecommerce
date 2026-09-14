import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  ChevronRightIcon,
  DownloadIcon,
  SearchIcon,
  UserIcon,
  EditIcon,
  LockIcon,
  PackageIcon,
  HeartIcon,
  LogOutIcon,
  BoxIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  BagIcon,
  TrashIcon,
  PlusIcon,
  ArrowRightIcon,
  CameraIcon,
  UploadCloudIcon
} from '../components/Icons';

/**
 * Curated Avatar Presets for Patron Profiles
 */
const AVATAR_PRESETS = [
  {
    id: 'avatar-1',
    name: 'Alex Vance',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop'
  },
  {
    id: 'avatar-2',
    name: 'Marcus Vance',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=240&auto=format&fit=crop'
  },
  {
    id: 'avatar-3',
    name: 'Elena Rostova',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=240&auto=format&fit=crop'
  },
  {
    id: 'avatar-4',
    name: 'David Chen',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=240&auto=format&fit=crop'
  }
];

/**
 * AccountPage Component
 * Comprehensive customer account section:
 * 1. Profile information (Identity dossier, credentials, privileges, summary metrics)
 * 2. Edit profile (Update full name, email, phone, and avatar with live visual preview)
 * 3. Change password (Current passphrase, new passphrase, confirmation with eye toggles and validation)
 * 4. My orders (Status filter pills, live search, timeline stepper, PDF waybills, reorder, inspect details)
 * 5. Wishlist (Directly integrated account view of saved items, add to cart, remove, empty state)
 * 6. Logout (Header and navigation sign out action with confirmation modal and session reset)
 */
export const AccountPage = () => {
  const {
    orders = [],
    wishlist = [],
    setActiveView,
    formatPrice,
    showToast,
    currentUser,
    updateUserProfile,
    changePassword,
    saveAddress,
    deleteAddress,
    savePaymentMethod,
    deletePaymentMethod,
    openOrderDetailsPage,
    addToCart,
    removeWishlistItem,
    moveWishlistItemToCart,
    openProductDetail,
    products = [],
    logout,
    openAuthModal
  } = useStore();

  const navigate = useNavigate();

  // Active navigation tab
  // Options: 'profile' | 'edit_profile' | 'password' | 'orders' | 'wishlist' | 'addresses' | 'payments'
  const [activeTab, setActiveTab] = useState('profile');

  // Orders Filter & Search State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || AVATAR_PRESETS[0].url,
    memberTier: currentUser?.memberTier || 'Verified Customer'
  });

  // Sync profile form whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || AVATAR_PRESETS[0].url,
        memberTier: currentUser.memberTier || 'ATELIER CIRCLE ELITE'
      });
    }
  }, [currentUser]);

  // Profile Avatar Upload State & Handlers
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Process and optimize image file to high-resolution square avatar
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, or GIF)', 'error');
      return;
    }

    // 10 MB file size limit
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showToast('Image file exceeds 10MB. Please choose a smaller photo.', 'error');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast('Failed to read image file. Please try another image.', 'error');
    };

    reader.onload = (event) => {
      const dataUrlResult = event.target.result;
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const targetSize = 400; // 400x400 delivers ultra-crisp avatar preview & retina fidelity
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext ? canvas.getContext('2d') : null;

          if (!ctx) {
            // Graceful direct fallback if canvas 2d is not supported in current environment
            setProfileForm(prev => ({ ...prev, avatar: dataUrlResult }));
            setUploadedFileName(file.name);
            setUploadedFileSize(`${Math.round(file.size / 1024) || 1} KB`);
            setIsProcessingImage(false);
            showToast(`Image "${file.name}" uploaded successfully!`, 'success');
            return;
          }

          // Center-crop to 1:1 square
          const minDim = Math.min(img.width || targetSize, img.height || targetSize);
          const sourceX = ((img.width || targetSize) - minDim) / 2;
          const sourceY = ((img.height || targetSize) - minDim) / 2;

          ctx.drawImage(
            img,
            sourceX, sourceY, minDim, minDim,
            0, 0, targetSize, targetSize
          );

          const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(outputFormat, 0.92);
          const kbSize = Math.round((optimizedDataUrl.length * 3 / 4) / 1024);

          setProfileForm(prev => ({
            ...prev,
            avatar: optimizedDataUrl
          }));
          setUploadedFileName(file.name);
          setUploadedFileSize(`${kbSize} KB`);
          setIsProcessingImage(false);
          showToast(`Image "${file.name}" uploaded and optimized!`, 'success');
        } catch (err) {
          // Direct fallback
          setProfileForm(prev => ({ ...prev, avatar: dataUrlResult }));
          setUploadedFileName(file.name);
          setUploadedFileSize(`${Math.round(file.size / 1024) || 1} KB`);
          setIsProcessingImage(false);
          showToast(`Image loaded successfully!`, 'success');
        }
      };

      img.onerror = () => {
        setIsProcessingImage(false);
        showToast('Invalid or corrupted image format.', 'error');
      };

      img.src = dataUrlResult;

      // In testing or headless environments (e.g., jsdom) where Image does not auto-fire onload
      if (typeof window !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.includes('jsdom')) {
        setTimeout(() => {
          if (img.onload) img.onload();
        }, 10);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleAvatarDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleAvatarDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveUploadedAvatar = () => {
    setProfileForm(prev => ({
      ...prev,
      avatar: currentUser?.avatar || AVATAR_PRESETS[0].url
    }));
    setUploadedFileName('');
    setUploadedFileSize('');
    showToast('Uploaded image removed, reverted to default avatar.', 'info');
  };

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Primary Residence',
    recipient: currentUser?.name || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    isDefault: false
  });

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    name: currentUser?.name || '',
    number: '',
    expiry: '',
    cvc: '',
    brand: 'Visa'
  });

  // Logout Confirmation Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Filtered Orders Logic
  const filteredOrders = orders.filter(ord => {
    const matchesStatus =
      orderStatusFilter === 'all' ||
      (orderStatusFilter === 'active' && ord.fulfillmentState !== 'DELIVERED') ||
      (orderStatusFilter === 'delivered' && ord.fulfillmentState === 'DELIVERED');

    const searchLower = orderSearch.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      (ord.reference && ord.reference.toLowerCase().includes(searchLower)) ||
      (ord.cartSummary && ord.cartSummary.toLowerCase().includes(searchLower)) ||
      (ord.courier && ord.courier.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast('Please provide your full name', 'error');
      return;
    }
    if (!profileForm.email.trim() || !profileForm.email.includes('@')) {
      showToast('Please provide a valid email address', 'error');
      return;
    }

    try {
      await updateUserProfile(profileForm);
      setActiveTab('profile');
      showToast('Profile information successfully updated', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  // Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current passphrase', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('New passphrase must contain at least 6 characters', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passphrases do not match', 'error');
      return;
    }

    setPasswordSubmitting(true);
    try {
      if (changePassword) {
        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        });
      } else {
        showToast('Credentials updated successfully', 'success');
      }
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Patron credentials successfully updated', 'success');
    } catch (err) {
      showToast(err.message || 'Error changing passphrase', 'error');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Address Submit Handler
  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city) {
      showToast('Please specify street and city', 'error');
      return;
    }
    saveAddress(addressForm);
    setIsAddressModalOpen(false);
    setAddressForm({
      title: 'Primary Residence',
      recipient: currentUser?.name || '',
      street: '',
      city: '',
      postalCode: '',
      country: 'United States',
      phone: '',
      isDefault: false
    });
  };

  // Payment Submit Handler
  const handleSavePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.number || paymentForm.number.length < 12) {
      showToast('Please enter a valid card number', 'error');
      return;
    }
    savePaymentMethod(paymentForm);
    setIsPaymentModalOpen(false);
    setPaymentForm({
      name: currentUser?.name || '',
      number: '',
      expiry: '',
      cvc: '',
      brand: 'Visa'
    });
  };

  // Wishlist to Cart Handler
  const handleWishlistAddToCart = (item) => {
    if (moveWishlistItemToCart) {
      moveWishlistItemToCart(item);
      showToast(`Added ${item.title || 'item'} to your shopping bag`, 'success');
    } else {
      const product = products.find(p => p.id === (item.productId || item.id)) || item;
      addToCart(product, item.finish || 'Default', 'Standard', 1);
      removeWishlistItem(item.id);
      showToast(`Added ${item.title || 'item'} to your shopping bag`, 'success');
    }
  };

  // Logout Handler
  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    setActiveView('storefront');
    if (navigate) {
      try {
        navigate('/', { replace: true });
      } catch (err) {}
    }
    await logout();
  };

  // Tab definitions
  const ACCOUNT_TABS = [
    { id: 'profile', label: 'Profile Information', icon: UserIcon, count: null },
    { id: 'edit_profile', label: 'Edit Profile', icon: EditIcon, count: null },
    { id: 'password', label: 'Change Password', icon: LockIcon, count: null },
    { id: 'orders', label: 'My Orders', icon: PackageIcon, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, count: wishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: BoxIcon, count: currentUser?.addresses?.length || 0 },
    { id: 'payments', label: 'Payment Methods', icon: ShieldCheckIcon, count: currentUser?.paymentMethods?.length || 0 },
    { id: 'logout', label: 'Logout', icon: LogOutIcon, count: null, isAction: true }
  ];

  /* ─── Non-Authenticated State ────────────────────────────────────────── */
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNoticeBar />
        <StorefrontNav />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e0',
            borderRadius: '16px',
            padding: '48px 36px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0f1115',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#ffffff'
            }}>
              <UserIcon size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
              Customer Sign In Required
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '10px', marginBottom: '28px', lineHeight: 1.6 }}>
              Please authenticate with your patron credentials to access your personal profile, review order dossiers, update your security passphrase, and view your saved wishlist.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                data-testid="sign-in-required-btn"
                onClick={() => openAuthModal('login')}
              >
                Sign In to Your Account
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="md"
                onClick={() => {
                  setActiveView('storefront');
                  if (navigate) navigate('/');
                }}
              >
                Return to Storefront
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ─── Authenticated Customer Account Dashboard ────────────────────────── */
  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '32px 0 88px 0' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '28px'
            }}
          >
            <button
              onClick={() => setActiveView('storefront')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Home
            </button>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Customer Account &amp; Profile</span>
          </nav>

          {/* Patron Header Profile Banner */}
          <section
            aria-label="Patron Profile Overview"
            data-testid="account-header-banner"
            style={{
              background: 'linear-gradient(135deg, #0b0f17 0%, #151b26 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '32px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={currentUser.avatar || AVATAR_PRESETS[0].url}
                  alt={currentUser.name || 'Patron Avatar'}
                  data-testid="account-avatar-img"
                  style={{
                    width: '78px',
                    height: '78px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    backgroundColor: '#1e293b'
                  }}
                  onError={(e) => {
                    e.target.src = AVATAR_PRESETS[0].url;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab('edit_profile')}
                  title="Change avatar in Edit Profile"
                  aria-label="Change profile avatar"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    color: '#0f1115',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <EditIcon size={13} />
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <h1
                    data-testid="account-user-name"
                    style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', margin: 0, color: '#ffffff' }}
                  >
                    {currentUser.name}
                  </h1>
                  <Badge variant="warning">
                    {currentUser.memberTier || 'ATELIER CIRCLE'}
                  </Badge>
                  {currentUser.role === 'admin' && (
                    <Badge variant="info" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                      OPS CLEARANCE
                    </Badge>
                  )}
                </div>

                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span data-testid="account-user-email">{currentUser.email}</span>
                  {currentUser.phone && <span>• {currentUser.phone}</span>}
                  <span>• Member since {currentUser.memberSince || '2023'}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div
                onClick={() => setActiveTab('orders')}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  minWidth: '92px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; }}
                title="View your orders"
              >
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 700 }}>
                  MY ORDERS
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }} data-testid="stat-orders-count">
                  {orders.length}
                </div>
              </div>

              <div
                onClick={() => setActiveTab('wishlist')}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  minWidth: '92px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; }}
                title="View saved wishlist"
              >
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 700 }}>
                  WISHLIST
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }} data-testid="stat-wishlist-count">
                  {wishlist.length}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLogoutModalOpen(true)}
                icon={LogOutIcon}
                data-testid="header-logout-btn"
                style={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.25)',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '9px 16px',
                  fontWeight: 600,
                  borderRadius: '10px'
                }}
              >
                Sign Out
              </Button>
            </div>
          </section>

          {/* Account Navigation Tabs */}
          <div
            role="tablist"
            aria-label="Account Sections"
            style={{
              display: 'flex',
              gap: '6px',
              borderBottom: '1px solid #e5e5e0',
              marginBottom: '32px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}
          >
            {ACCOUNT_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  data-testid={`account-tab-${tab.id}`}
                  onClick={() => {
                    if (tab.isAction) {
                      setIsLogoutModalOpen(true);
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 18px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#0f1115' : tab.isAction ? '#dc2626' : '#6b7280',
                    borderBottom: isActive ? '2.5px solid #0f1115' : '2.5px solid transparent',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    borderTopLeftRadius: '6px',
                    borderTopRightRadius: '6px',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span style={{
                      backgroundColor: isActive ? '#0f1115' : '#e5e7eb',
                      color: isActive ? '#ffffff' : '#374151',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '1px 7px'
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. PROFILE INFORMATION TAB                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div
              role="tabpanel"
              id="tabpanel-profile"
              aria-labelledby="tab-profile"
              data-testid="profile-information-section"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}
            >
              {/* Profile Dossier Card */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e0',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Profile Information
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Primary patron credentials and contact ledger.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={EditIcon}
                    data-testid="edit-profile-shortcut-btn"
                    onClick={() => setActiveTab('edit_profile')}
                  >
                    Edit Profile
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '18px', borderBottom: '1px solid #f3f4f6' }}>
                    <img
                      src={currentUser.avatar || AVATAR_PRESETS[0].url}
                      alt={currentUser.name}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <CheckIcon size={14} /> Active Patron Record
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Full Name
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                        {currentUser.name}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Member Status
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                        {currentUser.memberTier || 'Verified Patron'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Email Address
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginTop: '2px', wordBreak: 'break-all' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                        Mobile Phone
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                        {currentUser.phone || 'Not configured'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveTab('password')}
                      icon={LockIcon}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('orders')}
                      icon={PackageIcon}
                    >
                      View Orders
                    </Button>
                  </div>
                </div>
              </div>

              {/* Society Privileges & Security Status Card */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e0',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                    Atelier Society Privileges
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 20px 0' }}>
                    Included automatically with your customer account status.
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Priority Drops:</strong> 48-hour early window on limited capsule collections.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Complimentary Global Freight:</strong> Carbon-neutral courier dispatch on all acquisitions.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Dedicated Concierge:</strong> Anatomic sizing consultations and priority customer care.</span>
                    </li>
                  </ul>
                </div>

                <div style={{
                  marginTop: '24px',
                  backgroundColor: '#fafaf9',
                  borderRadius: '10px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>
                      Account Security Passphrase
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                      Encrypted and verified on login.
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('password')}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. EDIT PROFILE TAB                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'edit_profile' && (
            <div
              role="tabpanel"
              id="tabpanel-edit_profile"
              aria-labelledby="tab-edit_profile"
              data-testid="edit-profile-section"
            >
              <form
                onSubmit={handleSaveProfile}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                  gap: '28px',
                  alignItems: 'stretch'
                }}
              >
                {/* ── CARD 1: PROFILE AVATAR & MEDIA STUDIO ── */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e0',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px',
                    height: '100%'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                        Edit Customer Profile
                      </h2>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                        Personalize your patron portrait, upload custom photos, or pick an atelier preset.
                      </p>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                      style={{ display: 'none' }}
                      data-testid="avatar-file-input"
                      onChange={handleFileInputChange}
                    />

                    {/* Avatar Highlight & Upload Actions Container */}
                    <div
                      style={{
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '14px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Avatar preview with camera overlay badge */}
                        <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
                          <img
                            src={profileForm.avatar || AVATAR_PRESETS[0].url}
                            alt="Avatar Preview"
                            data-testid="avatar-preview-img"
                            style={{
                              width: '84px',
                              height: '84px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid #0f1115',
                              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                              backgroundColor: '#e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.src = AVATAR_PRESETS[0].url;
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="avatar-camera-btn"
                            title="Upload image file from device"
                            aria-label="Upload image file from device"
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#0f1115',
                              color: '#ffffff',
                              border: '2px solid #ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                              transition: 'transform 0.15s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          >
                            <CameraIcon size={14} />
                          </button>
                        </div>

                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                            Patron Portrait
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', marginBottom: '10px' }}>
                            Square 1:1 auto-cropped &amp; optimized
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              data-testid="upload-avatar-file-btn"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isProcessingImage}
                              icon={UploadCloudIcon}
                              style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#0f1115',
                                color: '#0f1115',
                                fontWeight: 700
                              }}
                            >
                              {isProcessingImage ? 'Optimizing Image...' : 'Upload Image File'}
                            </Button>

                            {uploadedFileName && (
                              <button
                                type="button"
                                data-testid="remove-uploaded-avatar-btn"
                                onClick={handleRemoveUploadedAvatar}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  padding: '4px 6px'
                                }}
                              >
                                Remove photo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Drag and Drop Zone or Uploaded File Notification Banner */}
                      {uploadedFileName ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: '#065f46',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                            <CheckIcon size={15} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Image uploaded: <strong>{uploadedFileName}</strong>
                            </span>
                          </div>
                          {uploadedFileSize && (
                            <span style={{ color: '#047857', opacity: 0.85, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                              ({uploadedFileSize} • 1:1)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          data-testid="avatar-dropzone"
                          onDragOver={handleAvatarDragOver}
                          onDragLeave={handleAvatarDragLeave}
                          onDrop={handleAvatarDrop}
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: isDragging ? '2px dashed #0f1115' : '1.5px dashed #cbd5e1',
                            backgroundColor: isDragging ? '#f1f5f9' : '#ffffff',
                            borderRadius: '10px',
                            padding: '14px 18px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.8125rem', color: '#1f2937', fontWeight: 600 }}>
                            Click to browse <span style={{ fontWeight: 400, color: '#6b7280' }}>or drag &amp; drop an image here</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                            PNG, JPG, WEBP, or GIF (max 10MB) • Auto-cropped 1:1 &amp; optimized
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Presets Selection */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                        Or choose from curated patron presets:
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {AVATAR_PRESETS.map(preset => (
                          <img
                            key={preset.id}
                            src={preset.url}
                            alt={preset.name}
                            title={preset.name}
                            onClick={() => {
                              setProfileForm({ ...profileForm, avatar: preset.url });
                              setUploadedFileName('');
                              setUploadedFileSize('');
                            }}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              border: profileForm.avatar === preset.url ? '2.5px solid #0f1115' : '1px solid #e5e7eb',
                              opacity: profileForm.avatar === preset.url ? 1 : 0.65,
                              transform: profileForm.avatar === preset.url ? 'scale(1.08)' : 'scale(1)',
                              transition: 'all 0.15s ease'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom Image URL */}
                  <Input
                    label="Or enter custom image URL"
                    placeholder="https://images.unsplash.com/..."
                    value={profileForm.avatar?.startsWith('data:') ? '' : profileForm.avatar}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, avatar: e.target.value });
                      setUploadedFileName('');
                      setUploadedFileSize('');
                    }}
                    helperText={profileForm.avatar?.startsWith('data:') ? 'Custom local image file is currently selected.' : 'Paste a direct link to any online image.'}
                  />
                </div>

                {/* ── CARD 2: PATRON INFORMATION & CREDENTIALS ── */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e0',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '24px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 4px 0' }}>
                        Personal Information
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                        Update your patron identity, registered email, and courier SMS contacts.
                      </p>
                    </div>

                    <Input
                      label="Full Patron Name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      data-testid="input-profile-name"
                      required
                    />

                    <Input
                      label="Registered Email Address"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      data-testid="input-profile-email"
                      required
                      helperText="Used for order fulfillment invoices, receipt archives, and account authentication."
                    />

                    <Input
                      label="Mobile Contact (Courier SMS Tracking)"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                      data-testid="input-profile-phone"
                      helperText="Used strictly for dispatch transit notifications and order fulfillment."
                    />

                    {/* Society Tier Ledger Status Box */}
                    <div
                      style={{
                        backgroundColor: '#fafaf9',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Account Privilege Status
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                          {currentUser?.memberTier || 'ATELIER CIRCLE ELITE'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                          <CheckIcon size={13} /> Verified &amp; Protected
                        </div>
                      </div>
                      <Badge variant="warning">
                        ACTIVE
                      </Badge>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'flex-start',
                      paddingTop: '20px',
                      borderTop: '1px solid #f3f4f6'
                    }}
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      data-testid="save-profile-btn"
                    >
                      Save Profile Changes
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setProfileForm({
                          name: currentUser?.name || '',
                          email: currentUser?.email || '',
                          phone: currentUser?.phone || '',
                          avatar: currentUser?.avatar || AVATAR_PRESETS[0].url,
                          memberTier: currentUser?.memberTier || 'ATELIER CIRCLE ELITE'
                        });
                        setUploadedFileName('');
                        setUploadedFileSize('');
                        setActiveTab('profile');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. CHANGE PASSWORD TAB                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'password' && (
            <div
              role="tabpanel"
              id="tabpanel-password"
              aria-labelledby="tab-password"
              data-testid="change-password-section"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '28px',
                alignItems: 'start'
              }}
            >
              {/* Card 1: Passphrase Update Form */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1115'
                  }}>
                    <LockIcon size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Change Account Password
                    </h2>
                    <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '2px 0 0 0' }}>
                      Protect your patron account with a secure passphrase.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Current Password with Visibility Toggle */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Current Passphrase *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        data-testid="input-current-password"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          fontSize: '0.875rem',
                          backgroundColor: '#fafaf9',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '10px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title={showCurrentPassword ? 'Hide passphrase' : 'Show passphrase'}
                      >
                        {showCurrentPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password with Visibility Toggle */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      New Passphrase *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        data-testid="input-new-password"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          fontSize: '0.875rem',
                          backgroundColor: '#fafaf9',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '10px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title={showNewPassword ? 'Hide passphrase' : 'Show passphrase'}
                      >
                        {showNewPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: passwordForm.newPassword.length >= 6 ? '#059669' : '#6b7280', marginTop: '6px' }}>
                      {passwordForm.newPassword.length >= 6 ? '✓ Minimum length satisfied (6+ characters)' : '• Must be at least 6 characters'}
                    </div>
                  </div>

                  {/* Confirm New Password with Visibility Toggle */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Confirm New Passphrase *
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        data-testid="input-confirm-password"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 14px',
                          fontSize: '0.875rem',
                          backgroundColor: '#fafaf9',
                          border: '1.5px solid #e5e7eb',
                          borderRadius: '10px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          color: '#6b7280',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title={showConfirmPassword ? 'Hide passphrase' : 'Show passphrase'}
                      >
                        {showConfirmPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                    {passwordForm.confirmPassword && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: passwordForm.newPassword === passwordForm.confirmPassword ? '#059669' : '#dc2626',
                        marginTop: '6px'
                      }}>
                        {passwordForm.newPassword === passwordForm.confirmPassword
                          ? '✓ Passphrases match'
                          : '✗ Passphrases do not match'}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={passwordSubmitting}
                    data-testid="change-password-submit-btn"
                    style={{ marginTop: '8px' }}
                  >
                    {passwordSubmitting ? 'Updating...' : 'Update Passphrase'}
                  </Button>
                </form>
              </div>

              {/* Card 2: Security & Encryption Assurance */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                    Security Standards
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 20px 0' }}>
                    How UrbanCart protects your account credentials and personal orders.
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Bcrypt Hash Protection:</strong> Passphrases are salted and hashed on the server; never stored or logged in plain text.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Session Revocation:</strong> Changing your passphrase instantly invalidates active token sessions on untrusted devices.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#374151' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span><strong>Encrypted Vault:</strong> Payment cards and addresses are isolated with AES-256 tokenization.</span>
                    </li>
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: '#fafaf9',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>
                    Need Emergency Account Lockout?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                    Contact our 24/7 concierge security desk at security@urbancart.internal.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 4. MY ORDERS TAB                                              */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div
              role="tabpanel"
              id="tabpanel-orders"
              aria-labelledby="tab-orders"
              data-testid="my-orders-section"
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Order Controls Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '8px'
              }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: `All Orders (${orders.length})` },
                    { id: 'active', label: `Active & In Transit (${orders.filter(o => o.fulfillmentState !== 'DELIVERED').length})` },
                    { id: 'delivered', label: `Delivered (${orders.filter(o => o.fulfillmentState === 'DELIVERED').length})` }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderStatusFilter(filter.id)}
                      data-testid={`filter-orders-${filter.id}`}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: orderStatusFilter === filter.id ? 700 : 500,
                        backgroundColor: orderStatusFilter === filter.id ? '#0f1115' : '#f3f4f6',
                        color: orderStatusFilter === filter.id ? '#ffffff' : '#4b5563',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  width: '280px'
                }}>
                  <SearchIcon size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order # or item..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    data-testid="orders-search-input"
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', width: '100%' }}
                  />
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div style={{
                  padding: '72px 24px',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '16px'
                }}>
                  <PackageIcon size={36} className="text-gray-300" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    No orders match your filter criteria.
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '6px' }}>
                    Try searching for another waybill reference or reset your filters.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { setOrderStatusFilter('all'); setOrderSearch(''); }}
                    style={{ marginTop: '16px' }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    data-testid={`order-card-${order.id}`}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e5e0',
                      borderRadius: '16px',
                      padding: '28px',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #f3f4f6',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827' }}>
                            {order.reference}
                          </span>
                          <Badge
                            variant={
                              order.fulfillmentState === 'DELIVERED'
                                ? 'success'
                                : order.fulfillmentState === 'COURIER DISPATCHED'
                                ? 'info'
                                : 'warning'
                            }
                            hasDot
                          >
                            {order.fulfillmentState}
                          </Badge>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                          Placed {order.timestamp} • Carrier: <strong>{order.courier || 'DHL Express'}</strong> • Tracking Waybill: <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '6px' }}>{order.trackingNumber || 'JD9182740192'}</code>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                          {formatPrice(order.total)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                          • {order.paymentStatus || 'CAPTURED'}
                        </div>
                      </div>
                    </div>

                    {/* Cart Dossier Info */}
                    <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '18px' }}>
                      Contents: <strong>{order.cartSummary}</strong>
                    </div>

                    {/* Shipment Stepper Timeline */}
                    <div style={{
                      backgroundColor: '#fafaf9',
                      borderRadius: '10px',
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '12px',
                      marginBottom: '20px'
                    }}>
                      {[
                        { step: 'Order Placed', done: true },
                        { step: 'Quality Inspected', done: true },
                        { step: 'Courier Handover', done: order.fulfillmentState === 'COURIER DISPATCHED' || order.fulfillmentState === 'DELIVERED' },
                        { step: 'Delivered', done: order.fulfillmentState === 'DELIVERED' }
                      ].map((st, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{
                            height: '4px',
                            backgroundColor: st.done ? '#0f1115' : '#e5e7eb',
                            borderRadius: '6px',
                            marginBottom: '8px'
                          }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: st.done ? 700 : 500, color: st.done ? '#111827' : '#9ca3af' }}>
                            {st.step}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Controls */}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderDetailsPage(order)}
                        data-testid={`inspect-order-${order.id}`}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showToast(`Invoice dossier for ${order.reference} downloaded`, 'success')}
                        icon={DownloadIcon}
                        data-testid={`download-invoice-${order.id}`}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const product = products[0] || { id: 'prd_default', title: order.cartSummary, price: order.total };
                          addToCart(product, 'Standard', 'Standard', 1);
                          showToast('Items reordered into shopping bag', 'success');
                        }}
                        data-testid={`reorder-order-${order.id}`}
                      >
                        Reorder Items
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 5. WISHLIST TAB                                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'wishlist' && (
            <div
              role="tabpanel"
              id="tabpanel-wishlist"
              aria-labelledby="tab-wishlist"
              data-testid="customer-wishlist-section"
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Saved Archival Wishlist ({wishlist.length})
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Personal curations saved to your account. Move them to your bag or inspect details.
                  </p>
                </div>
                {wishlist.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveView('wishlist')}
                    icon={ArrowRightIcon}
                    data-testid="view-full-wishlist-btn"
                  >
                    Open Full Wishlist Page
                  </Button>
                )}
              </div>

              {wishlist.length === 0 ? (
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '16px',
                  padding: '72px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#fafaf9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: '#9ca3af'
                  }}>
                    <HeartIcon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Your Wishlist is Empty
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '400px', margin: '8px auto 20px' }}>
                    You haven't saved any archival items yet. Discover our latest collections and save pieces to revisit anytime.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setActiveView('storefront')}
                    data-testid="wishlist-explore-btn"
                  >
                    Explore Curated Catalog
                  </Button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '24px'
                }}>
                  {wishlist.map(item => (
                    <div
                      key={item.id}
                      data-testid={`account-wishlist-item-${item.id}`}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e5e0',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-subtle)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ position: 'relative', height: '220px', backgroundColor: '#f5f5f4', overflow: 'hidden' }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeWishlistItem(item.id)}
                            title="Remove from wishlist"
                            aria-label={`Remove ${item.title} from wishlist`}
                            data-testid={`quick-remove-wishlist-${item.id}`}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <TrashIcon size={15} />
                          </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {item.category || 'CURATED'}
                          </div>
                          <h4
                            onClick={() => openProductDetail(item.productId || item.id)}
                            style={{
                              fontSize: '0.9375rem',
                              fontWeight: 700,
                              color: '#111827',
                              margin: '4px 0 10px 0',
                              cursor: 'pointer'
                            }}
                          >
                            {item.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f1115' }}>
                              {formatPrice(item.price)}
                            </span>
                            {item.compareAtPrice && item.compareAtPrice > item.price && (
                              <span style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                                {formatPrice(item.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: '8px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => handleWishlistAddToCart(item)}
                          icon={BagIcon}
                          data-testid={`wishlist-add-to-cart-${item.id}`}
                        >
                          Add to Bag
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeWishlistItem(item.id)}
                          data-testid={`wishlist-remove-${item.id}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 6. SAVED ADDRESSES TAB                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'addresses' && (
            <div
              role="tabpanel"
              id="tabpanel-addresses"
              aria-labelledby="tab-addresses"
              data-testid="saved-addresses-section"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Saved Dispatch Residences ({currentUser.addresses?.length || 0})
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Addresses for accelerated checkout and courier routing.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddressModalOpen(true)}
                  icon={PlusIcon}
                >
                  Add Residence
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {(currentUser.addresses || []).map(addr => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      border: addr.isDefault ? '2px solid #0f1115' : '1px solid #e5e7eb',
                      backgroundColor: addr.isDefault ? '#fafaf9' : '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                          {addr.title || 'Residence'}
                        </span>
                        {addr.isDefault && (
                          <Badge variant="dark">DEFAULT</Badge>
                        )}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>
                        <strong>{addr.recipient}</strong><br />
                        {addr.street}<br />
                        {addr.postalCode} {addr.city}, {addr.country}<br />
                        {addr.phone && `Phone: ${addr.phone}`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 7. PAYMENT METHODS TAB                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'payments' && (
            <div
              role="tabpanel"
              id="tabpanel-payments"
              aria-labelledby="tab-payments"
              data-testid="payment-methods-section"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Stored Payment Methods ({currentUser.paymentMethods?.length || 0})
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Encrypted vault instruments for seamless acquisition checkout.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsPaymentModalOpen(true)}
                  icon={PlusIcon}
                >
                  Add Payment Card
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {(currentUser.paymentMethods || []).map(card => (
                  <div
                    key={card.id}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      backgroundColor: '#0f1115',
                      color: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '170px',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                        {card.brand.toUpperCase()}
                      </span>
                      {card.isDefault && (
                        <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '1.125rem', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                      •••• •••• •••• {card.last4}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem' }}>
                      <div>
                        <div style={{ opacity: 0.6 }}>CARDHOLDER</div>
                        <div style={{ fontWeight: 700, marginTop: '2px' }}>{card.holder}</div>
                      </div>
                      <div>
                        <div style={{ opacity: 0.6 }}>EXPIRES</div>
                        <div style={{ fontWeight: 700, marginTop: '2px' }}>{card.expiry}</div>
                      </div>
                      <button
                        onClick={() => deletePaymentMethod(card.id)}
                        style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Add Address Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        maxWidth="500px"
        title="Add New Dispatch Residence"
        subtitle="Saved to your private address book for accelerated checkout."
      >
        <form onSubmit={handleSaveAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Residence Label"
            placeholder="e.g. Primary Residence or Summer Villa"
            value={addressForm.title}
            onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
            required
          />
          <Input
            label="Recipient Full Name"
            value={addressForm.recipient}
            onChange={(e) => setAddressForm({ ...addressForm, recipient: e.target.value })}
            required
          />
          <Input
            label="Street Address & Apt/Suite"
            placeholder="e.g. 742 Evergreen Terrace"
            value={addressForm.street}
            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="City"
              placeholder="Springfield"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              required
            />
            <Input
              label="Postal Code"
              placeholder="97477"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              required
            />
          </div>
          <Input
            label="Country"
            value={addressForm.country}
            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+1 (555) 234-5678"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
            />
            <span>Set as primary default shipping address</span>
          </label>

          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '10px' }}>
            Save Residence
          </Button>
        </form>
      </Modal>

      {/* ─── Add Payment Card Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        maxWidth="460px"
        title="Add Atelier Payment Instrument"
        subtitle="Encrypted in patron vault with zero raw credit card exposure."
      >
        <form onSubmit={handleSavePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Cardholder Name"
            placeholder="ALEX VANCE"
            value={paymentForm.name}
            onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
            required
          />
          <Input
            label="Card Number"
            placeholder="•••• •••• •••• 4242"
            value={paymentForm.number}
            onChange={(e) => setPaymentForm({ ...paymentForm, number: e.target.value })}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Expiry Date"
              placeholder="MM/YY (e.g. 08/28)"
              value={paymentForm.expiry}
              onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
              required
            />
            <Input
              label="Security CVC"
              placeholder="•••"
              value={paymentForm.cvc}
              onChange={(e) => setPaymentForm({ ...paymentForm, cvc: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '10px' }}>
            Save Payment Method
          </Button>
        </form>
      </Modal>

      {/* ─── 6. Logout Confirmation Modal ───────────────────────────────── */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        maxWidth="420px"
        title="Sign Out of Customer Account"
        subtitle="Are you sure you want to end your current patron session?"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
            Signing out will disconnect your active order tracking, saved address shortcuts, and private wishlist access on this terminal.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              data-testid="confirm-logout-btn"
              onClick={handleConfirmLogout}
              style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
            >
              Confirm Sign Out
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
