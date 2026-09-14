import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import {
  CloseIcon,
  BagIcon,
  ShareIcon,
  ChevronRightIcon,
  TrashIcon,
  SparklesIcon,
  HeartIcon,
} from '../components/Icons';

/* ─── Heart Filled Icon ───────────────────────────────────────────── */
const HeartFilledIcon = ({ size = 18, color = '#e11d48' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShoppingBagIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const SortIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="9" y2="18" />
  </svg>
);

/* ─── Badge color map ────────────────────────────────────────────── */
const BADGE_STYLES = {
  'LIMITED EDITION': { bg: '#0f1115', color: '#fff' },
  'CURATED PICK':    { bg: '#d97706', color: '#fff' },
  'PRIVATE SALE':    { bg: '#059669', color: '#fff' },
  'NEW ARRIVAL':     { bg: '#2563eb', color: '#fff' },
  'BEST SELLER':     { bg: '#7c3aed', color: '#fff' },
  'DEFAULT':         { bg: '#374151', color: '#fff' },
};

/* ─── Wishlist Card Component ────────────────────────────────────── */
export const WishlistCard = ({ item, onRemove, onAddToCart, onViewProduct, formatPrice }) => {
  const [addedFlash, setAddedFlash] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);

  const badgeStyle = BADGE_STYLES[item.badge] || BADGE_STYLES['DEFAULT'];

  const handleAddToCart = () => {
    onAddToCart(item);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  };

  const discount = item.compareAtPrice && item.compareAtPrice > item.price
    ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
    : null;

  return (
    <div
      className="wishlist-card"
      data-testid={`wishlist-card-${item.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Top Media Section */}
      <div>
        {/* Quick Remove Button in Top-Right Corner */}
        <button
          onClick={() => onRemove(item.id)}
          className="wishlist-btn-quick-remove"
          title="Quick remove from Wishlist"
          aria-label={`Quick remove ${item.title}`}
          data-testid={`quick-remove-${item.id}`}
        >
          <CloseIcon size={13} />
        </button>

        {/* Wishlist Active Badge Indicator */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}>
          <HeartFilledIcon size={16} color="#e11d48" />
        </div>

        {/* Discount Badge */}
        {discount && (
          <div style={{
            position: 'absolute',
            top: '48px',
            left: '12px',
            zIndex: 10,
            backgroundColor: '#059669',
            color: '#fff',
            fontSize: '0.625rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '3px 8px',
            borderRadius: '9999px',
            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
          }}>
            -{discount}% OFF
          </div>
        )}

        {/* Product Image Container */}
        <div
          className="wishlist-img-box"
          onClick={() => onViewProduct(item.productId)}
          title={`View details for ${item.title}`}
        >
          <img
            src={imgSrc || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop'}
            alt={item.title}
            onError={() => {
              setImgSrc('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop');
            }}
          />
          {item.badge && (
            <span style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.color,
              fontSize: '0.5625rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              {item.badge}
            </span>
          )}
        </div>

        {/* Product Information */}
        <div style={{
          padding: '16px 16px 8px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {/* Category */}
          <div style={{
            fontSize: '0.625rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: '#9ca3af',
            textTransform: 'uppercase',
          }}>
            {item.category || 'LIFESTYLE & GOODS'}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewProduct(item.productId)}
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.35,
              cursor: 'pointer',
              margin: 0,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#4b5563'}
            onMouseLeave={e => e.currentTarget.style.color = '#111827'}
          >
            {item.title}
          </h3>

          {/* Finish or Variant description */}
          {item.finish && (
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              fontWeight: 500,
            }}>
              {item.finish}
            </div>
          )}

          {/* Price & Compare Price */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginTop: '4px',
          }}>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.02em',
            }}>
              {formatPrice ? formatPrice(item.price) : `$${item.price.toFixed(2)}`}
            </span>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span style={{
                fontSize: '0.8125rem',
                color: '#9ca3af',
                textDecoration: 'line-through',
                fontWeight: 500,
              }}>
                {formatPrice ? formatPrice(item.compareAtPrice) : `$${item.compareAtPrice.toFixed(2)}`}
              </span>
            )}
          </div>

          {/* In-Stock Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#059669',
            marginTop: '2px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
            <span>In Stock • Ready to dispatch</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Remove from Wishlist */}
      <div style={{
        padding: '12px 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`wishlist-btn-cart ${addedFlash ? 'added' : ''}`}
          aria-label={`Add ${item.title} to cart`}
          data-testid={`add-to-cart-${item.id}`}
        >
          <BagIcon size={14} />
          <span>{addedFlash ? '✓ Added to Cart!' : 'Add to Cart'}</span>
        </button>

        {/* Remove from Wishlist Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="wishlist-btn-remove"
          title={`Remove ${item.title} from Wishlist`}
          aria-label={`Remove ${item.title} from Wishlist`}
          data-testid={`remove-from-wishlist-${item.id}`}
        >
          <TrashIcon size={14} />
          <span>Remove from Wishlist</span>
        </button>
      </div>
    </div>
  );
};

/* ─── Empty Wishlist State Component ─────────────────────────────── */
export const EmptyWishlist = ({ onShop, recommendedProducts = [], onAddToWishlist, onAddToCart, formatPrice }) => {
  return (
    <div style={{ width: '100%', paddingBottom: '32px' }}>
      <div className="wishlist-empty-card">
        {/* Soft Heart Illustration */}
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          backgroundColor: '#fff1f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '2px dashed #fecdd3',
          boxShadow: '0 8px 24px -4px rgba(225, 29, 72, 0.12)',
        }}>
          <HeartFilledIcon size={44} color="#e11d48" />
        </div>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.025em',
          marginBottom: '10px',
        }}>
          Your Wishlist is Empty
        </h2>

        <p style={{
          fontSize: '0.9375rem',
          color: '#6b7280',
          maxWidth: '440px',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}>
          You haven&apos;t saved any items to your wishlist yet. Discover our latest collections and save your favorite pieces to revisit anytime.
        </p>

        {/* Primary CTA: Explore Collection */}
        <button
          onClick={onShop}
          style={{
            padding: '13px 32px',
            borderRadius: '12px',
            backgroundColor: '#0f1115',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            letterSpacing: '0.01em',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(15, 17, 21, 0.2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#27272a';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 17, 21, 0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#0f1115';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 17, 21, 0.2)';
          }}
        >
          <ShoppingBagIcon size={17} />
          <span>Explore Collection</span>
        </button>
      </div>

      {/* Suggested / Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div style={{ marginTop: '36px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: '#d97706',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '4px',
              }}>
                <SparklesIcon size={13} />
                <span>Trending Picks For You</span>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
                Start Your Wishlist With These Essentials
              </h3>
            </div>
          </div>

          <div className="wishlist-rec-grid">
            {recommendedProducts.slice(0, 4).map(product => {
              const primaryImage = product.images && product.images[0] ? product.images[0].url : (product.image || '');
              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'}
                >
                  <div>
                    <div style={{
                      width: '100%',
                      paddingTop: '90%',
                      position: 'relative',
                      backgroundColor: '#f6f5f2',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={primaryImage}
                        alt={product.title}
                        style={{
                          position: 'absolute',
                          top: 0, left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                    <div style={{ padding: '14px 14px 6px 14px' }}>
                      <div style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase' }}>
                        {product.category}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#111827',
                        marginTop: '4px',
                        lineHeight: 1.3
                      }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
                        {formatPrice ? formatPrice(product.price) : `$${product.price.toFixed(2)}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '10px 14px 14px 14px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onAddToWishlist(product)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#111827',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#e11d48';
                        e.currentTarget.style.color = '#e11d48';
                        e.currentTarget.style.backgroundColor = '#fff1f2';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#111827';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }}
                    >
                      <HeartIcon size={13} />
                      <span>+ Wishlist</span>
                    </button>

                    <button
                      onClick={() => onAddToCart(product)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <BagIcon size={13} />
                      <span>Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main WishlistPage ──────────────────────────────────────────── */
export const WishlistPage = () => {
  const {
    currentUser,
    openAuthModal,
    wishlist,
    products,
    wishlistTotalValue,
    removeWishlistItem,
    moveWishlistItemToCart,
    moveAllWishlistToCart,
    toggleWishlist,
    addToCart,
    setActiveView,
    openProductDetail,
    openShopCatalog,
    showToast,
    formatPrice,
  } = useStore();

  const [sortBy, setSortBy] = useState('recent');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  /* Patron authentication gate */
  if (!currentUser) {
    return (
      <div className="wishlist-page" style={{ minHeight: '100vh', backgroundColor: '#fafaf9', display: 'flex', flexDirection: 'column' }}>
        <TopNoticeBar />
        <StorefrontNav />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e7e5e4',
            padding: '44px 32px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fff1f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#e11d48'
            }}>
              <HeartFilledIcon size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Sign In to View Wishlist
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Your saved items and private selections are synchronized with your account. Sign in to access your curated collection or save new pieces.
            </p>
            <button
              onClick={() => openAuthModal('login')}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '10px',
                backgroundColor: '#0f1115',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 17, 21, 0.2)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27272a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f1115'}
            >
              Sign In to Your Account →
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* Sort logic */
  const sortedItems = [...wishlist].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name')       return a.title.localeCompare(b.title);
    return 0; // recent — retain insertion order
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    showToast('Wishlist link copied to clipboard', 'info');
  };

  const handleClearAll = () => {
    wishlist.forEach(item => removeWishlistItem(item.id));
    setShowClearConfirm(false);
    showToast('Wishlist cleared', 'info');
  };

  const totalSavings = wishlist.reduce((acc, item) => {
    if (item.compareAtPrice && item.compareAtPrice > item.price) {
      acc += item.compareAtPrice - item.price;
    }
    return acc;
  }, 0);

  return (
    <div style={{ backgroundColor: '#fbfbfa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '36px 0 100px 0' }}>
        <div className="container">

          {/* ── Breadcrumb Navigation ── */}
          <nav aria-label="Breadcrumb" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '32px',
          }}>
            <span
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              onClick={() => setActiveView('storefront')}
              onMouseEnter={e => e.target.style.color = '#111827'}
              onMouseLeave={e => e.target.style.color = '#9ca3af'}
            >
              Home
            </span>
            <ChevronRightIcon size={11} />
            <span
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              onClick={() => openShopCatalog('ALL')}
              onMouseEnter={e => e.target.style.color = '#111827'}
              onMouseLeave={e => e.target.style.color = '#9ca3af'}
            >
              Shop
            </span>
            <ChevronRightIcon size={11} />
            <span style={{ color: '#111827', fontWeight: 600 }}>My Wishlist</span>
          </nav>

          {/* ── Page Header ── */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            paddingBottom: '28px',
            borderBottom: '1.5px solid #f0efe9',
            marginBottom: '32px',
          }}>
            {/* Title & Stats */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#e11d48',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                <HeartFilledIcon size={12} color="#e11d48" />
                <span>Curated Saved Items</span>
              </div>

              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '8px',
              }}>
                My Wishlist
              </h1>

              <p style={{
                fontSize: '0.9375rem',
                color: '#6b7280',
                fontWeight: 500,
                margin: 0,
              }}>
                {wishlist.length === 0
                  ? 'No items currently saved in your wishlist'
                  : `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later`}
                {totalSavings > 0 && (
                  <span style={{
                    marginLeft: '10px',
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}>
                    · Total potential savings: {formatPrice ? formatPrice(totalSavings) : `$${totalSavings.toFixed(2)}`}
                  </span>
                )}
              </p>
            </div>

            {/* Header Action Controls */}
            {wishlist.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Total Value Chip */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Total Value
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                    {formatPrice ? formatPrice(wishlistTotalValue) : `$${wishlistTotalValue.toFixed(2)}`}
                  </div>
                </div>

                {/* Share Wishlist */}
                <button
                  onClick={handleShare}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 16px',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#0f1115';
                    e.currentTarget.style.color = '#0f1115';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  <ShareIcon size={15} />
                  <span>Share</span>
                </button>

                {/* Clear All Wishlist */}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 14px',
                    border: '1.5px solid #fee2e2',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    color: '#e11d48',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                    e.currentTarget.style.borderColor = '#fca5a5';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#fee2e2';
                  }}
                >
                  <TrashIcon size={14} />
                  <span>Clear All</span>
                </button>

                {/* Add All to Cart */}
                <button
                  onClick={moveAllWishlistToCart}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#0f1115',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.01em',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(15, 17, 21, 0.2)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#27272a';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#0f1115';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <BagIcon size={15} />
                  <span>Add All to Cart</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Toolbar: Sort & Count ── */}
          {wishlist.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0 }}>
                Showing <strong style={{ color: '#111827' }}>{sortedItems.length}</strong> saved {sortedItems.length === 1 ? 'item' : 'items'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                padding: '6px 12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}>
                <SortIcon size={14} />
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#111827',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Product Grid or Empty State ── */}
          {wishlist.length === 0 ? (
            <EmptyWishlist
              onShop={() => openShopCatalog('ALL')}
              recommendedProducts={products || []}
              onAddToWishlist={toggleWishlist}
              onAddToCart={(p) => addToCart(p, 'Default', 'Default', 1)}
              formatPrice={formatPrice}
            />
          ) : (
            <div className="wishlist-grid">
              {sortedItems.map(item => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={removeWishlistItem}
                  onAddToCart={moveWishlistItemToCart}
                  onViewProduct={openProductDetail}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}

          {/* ── Continue Shopping Banner ── */}
          {wishlist.length > 0 && (
            <div style={{
              marginTop: '64px',
              padding: '36px 40px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0f1115 0%, #1f2937 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 12px 36px rgba(15, 17, 21, 0.15)',
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px',
                }}>
                  Looking for more additions to your wardrobe?
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                  margin: 0,
                  maxWidth: '540px',
                }}>
                  Explore our seasonal capsules and minimalist accessories crafted in small-batch atelier workshops.
                </p>
              </div>

              <button
                onClick={() => openShopCatalog('ALL')}
                style={{
                  padding: '13px 28px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  color: '#0f1115',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ShoppingBagIcon size={16} />
                <span>Explore Full Catalog</span>
              </button>
            </div>
          )}

        </div>
      </main>

      {/* ── Clear Confirmation Modal ── */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <TrashIcon size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Clear Entire Wishlist?
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px', lineHeight: 1.5 }}>
              Are you sure you want to remove all {wishlist.length} items from your wishlist? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowClearConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
