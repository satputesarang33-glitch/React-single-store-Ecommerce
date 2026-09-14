import React from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, SearchIcon } from './Icons';

// Import dedicated component stylesheet
import './MobileNavDrawer.css';

/**
 * ============================================================================
 * MobileNavDrawer Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Slide-out navigation drawer designed specifically for mobile screens (<900px).
 *   Features:
 *   1. Clean brand header and close button
 *   2. Search overlay trigger
 *   3. Editorial catalogue category navigation list
 *   4. Mobile patron account actions (Login / Register / Profile)
 *   5. Mobile region and currency selector
 */
export const MobileNavDrawer = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    setActiveView,
    openShopCatalog,
    openAccount,
    currentUser,
    openAuthModal,
    logout,
    setIsSearchOpen,
    setIsCurrencyModalOpen,
    currency,
    CURRENCY_CONFIG
  } = useStore();

  if (!isMobileNavOpen) return null;

  // Step 1: Nav click helper to close drawer before triggering action
  const handleNav = (action) => {
    setIsMobileNavOpen(false);
    action();
  };

  const categories = [
    { label: 'Shop All Lifestyle Archive', action: () => openShopCatalog('ALL') },
    { label: 'Premium Sneakers', action: () => openShopCatalog('Premium Sneakers') },
    { label: 'Casual T-Shirts', action: () => openShopCatalog('Casual T-Shirts') },
    { label: 'Smart Watches', action: () => openShopCatalog('Smart Watches') },
    { label: 'Backpacks', action: () => openShopCatalog('Backpacks') },
    { label: 'Headphones', action: () => openShopCatalog('Headphones') },
    { label: 'Sunglasses', action: () => openShopCatalog('Sunglasses') },
    { label: 'Wallets', action: () => openShopCatalog('Wallets') },
    { label: 'Fitness Accessories', action: () => openShopCatalog('Fitness Accessories') },
    { label: 'Curated Wishlist', action: () => setActiveView('wishlist') }
  ];

  return (
    <div
      onClick={() => setIsMobileNavOpen(false)}
      className="mobile-nav-backdrop"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="mobile-nav-surface"
      >
        {/* ── Header ── */}
        <div className="mobile-nav-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: '#0f1115',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
              borderRadius: '4px'
            }}>
              UC
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '-0.02em', color: '#0f1115' }}>
              URBANCART
            </span>
          </div>

          <button
            onClick={() => setIsMobileNavOpen(false)}
            style={{ padding: '6px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
            title="Close menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* ── Quick Search Trigger Bar ── */}
        <div style={{ padding: '16px 20px' }}>
          <div
            onClick={() => {
              setIsMobileNavOpen(false);
              setIsSearchOpen(true);
            }}
            className="mobile-nav-search-trigger"
          >
            <SearchIcon size={15} />
            <span>Search goods...</span>
          </div>
        </div>

        {/* ── Navigation Categories List ── */}
        <div className="mobile-nav-links-container">
          <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.12em', color: '#9ca3af', padding: '8px 12px' }}>
            EDITORIAL CATALOGUE
          </div>

          {categories.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNav(item.action)}
              className="mobile-nav-item-btn"
            >
              <span>{item.label}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>›</span>
            </button>
          ))}
        </div>

        {/* ── Patron Account Section ── */}
        <div className="mobile-nav-footer">
          {currentUser ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}
                  alt={currentUser.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#d97706', fontWeight: 700 }}>
                    {currentUser.memberTier || 'ATELIER PATRON'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => handleNav(openAccount)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  My Account &amp; Orders
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNav(() => setActiveView('admin_dashboard'))}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#0f1115',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    OPS Admin Console
                  </button>
                )}

                <button
                  onClick={() => { setIsMobileNavOpen(false); logout(); }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => { setIsMobileNavOpen(false); openAuthModal('login'); }}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.75rem' }}
              >
                Sign In to Atelier
              </button>
              <button
                onClick={() => { setIsMobileNavOpen(false); openAuthModal('register'); }}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.75rem' }}
              >
                Join Membership
              </button>
            </div>
          )}

          {/* Currency Switcher */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Active Currency:</span>
            <button
              onClick={() => { setIsMobileNavOpen(false); setIsCurrencyModalOpen(true); }}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#111827',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                cursor: 'pointer'
              }}
            >
              <span style={{ color: '#059669', fontWeight: 800 }}>{CURRENCY_CONFIG?.[currency]?.symbol || '₹'}</span>
              <span>{currency}</span>
              <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
