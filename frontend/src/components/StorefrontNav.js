import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BagIcon, HeartIcon, SearchIcon, UserIcon, ChevronDownIcon } from './Icons';

// Import dedicated component stylesheet
import './StorefrontNav.css';

/**
 * ============================================================================
 * StorefrontNav Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Top-level navigation header for the storefront.
 *   Provides:
 *   1. Brand identity and home link
 *   2. Category browsing shortcuts (All Goods, Sneakers, Smart Watches, etc.)
 *   3. Search input pill with instant ⌘K / Ctrl+K keyboard shortcut trigger
 *   4. Currency region selector
 *   5. Patron Account dropdown (Profile, Orders, Wishlist, Sign Out, Admin Console)
 *   6. Wishlist quick-link with saved count badge
 *   7. Cart drawer trigger with live item count and subtotal
 *   8. Mobile hamburger drawer button
 */
export const StorefrontNav = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    setIsSearchOpen,
    openShopCatalog,
    openSearchResults,
    openAccount,
    openOrdersPage,
    openWishlist,
    orders = [],
    wishlist = [],
    formatPrice,
    currency,
    setIsCurrencyModalOpen,
    CURRENCY_CONFIG,
    currentUser,
    openAuthModal,
    logout,
    setIsMobileNavOpen
  } = useStore();

  // Local state for header quick-search and account dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Step 1: Automatically close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Step 2: Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      openSearchResults(searchTerm.trim());
      setSearchTerm('');
    } else {
      setIsSearchOpen(true);
    }
  };

  // Category navigation items
  const navCategories = [
    { label: 'All Goods', action: () => openShopCatalog('ALL'), view: 'shop' },
    { label: 'Sneakers', action: () => openShopCatalog('Premium Sneakers'), view: 'shop' },
    { label: 'Smart Watches', action: () => openShopCatalog('Smart Watches'), view: 'shop' },
    { label: 'Backpacks', action: () => openShopCatalog('Backpacks'), view: 'shop' },
    { label: 'Headphones', action: () => openShopCatalog('Headphones'), view: 'shop' },
    { label: 'Fitness', action: () => openShopCatalog('Fitness Accessories'), view: 'shop' }
  ];

  return (
    <header className="storefront-header glass-nav">
      <div className="container storefront-nav-container">
        
        {/* ── Section 1: Mobile Hamburger & Brand Identity ── */}
        <div className="storefront-brand-group">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            className="storefront-hamburger-btn mobile-only-btn"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* UrbanCart Brand Logo */}
          <div 
            onClick={() => setActiveView('storefront')}
            className="storefront-logo-link"
            title="UrbanCart — Home"
          >
            <div className="storefront-logo-badge">UC</div>
            <div>
              <div className="storefront-logo-text">URBANCART</div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Desktop Category Links ── */}
        <nav className="desktop-nav-links" aria-label="Main Navigation">
          {navCategories.map((item, idx) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={idx}
                onClick={item.action}
                className={`storefront-nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Section 3: Search, Account, Wishlist & Cart Actions ── */}
        <div className="storefront-actions-group">
          
          {/* 3a. Quick Search Input Pill */}
          <form onSubmit={handleSearchSubmit} className="search-input-pill">
            <SearchIcon size={14} style={{ color: '#8c8c88', marginRight: '8px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
            <kbd 
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="search-kbd-hint"
              title="Press ⌘K or Ctrl+K to search"
            >
              ⌘K
            </kbd>
          </form>

          {/* 3b. Mobile Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="mobile-search-icon"
            title="Search"
            aria-label="Search"
          >
            <SearchIcon size={18} />
          </button>

          {/* 3c. Account Sign In / Patron Profile Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                title="Patron Account"
                className={`nav-pill-btn ${isUserDropdownOpen || activeView === 'account' ? 'active' : ''}`}
                style={{ padding: '4px 12px 4px 5px' }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=60'}
                  alt={currentUser.name}
                  className="nav-avatar"
                />
                <span className="user-name-label" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDownIcon size={12} style={{ color: '#6b7280', marginLeft: '2px' }} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="nav-pill-btn"
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </button>
            )}

            {/* Dropdown Menu Panel */}
            {isUserDropdownOpen && currentUser && (
              <div className="nav-user-dropdown">
                <div className="nav-user-header">
                  <div className="nav-user-name">{currentUser.name}</div>
                  <div className="nav-user-email">{currentUser.email}</div>
                  <div className="nav-user-tier">{currentUser.memberTier || 'ATELIER PATRON'}</div>
                </div>

                <button
                  onClick={() => { setIsUserDropdownOpen(false); openAccount(); }}
                  className="nav-dropdown-item"
                >
                  <span>Patron Account &amp; Profile</span>
                  <span style={{ color: '#9ca3af' }}>›</span>
                </button>

                <button
                  onClick={() => { setIsUserDropdownOpen(false); openOrdersPage(); }}
                  className="nav-dropdown-item"
                >
                  <span>My Orders &amp; Tracking ({orders.length})</span>
                  <span style={{ color: '#9ca3af' }}>›</span>
                </button>

                <button
                  onClick={() => { setIsUserDropdownOpen(false); setActiveView('wishlist'); }}
                  className="nav-dropdown-item"
                >
                  <span>Curated Wishlist ({wishlist.length})</span>
                  <span style={{ color: '#9ca3af' }}>›</span>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { setIsUserDropdownOpen(false); setActiveView('admin_dashboard'); }}
                    className="nav-dropdown-item"
                    style={{ backgroundColor: '#f9fafb', fontWeight: 700, margin: '4px 0' }}
                  >
                    <span>OPS Admin Console</span>
                    <span style={{ fontSize: '0.625rem' }}>↗</span>
                  </button>
                )}

                <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '6px 0' }} />

                <button
                  onClick={() => { setIsUserDropdownOpen(false); logout(); }}
                  className="nav-dropdown-item danger"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* 3d. Currency Switcher Pill */}
          <button
            type="button"
            onClick={() => setIsCurrencyModalOpen(true)}
            title={`Active Currency: ${currency} (${CURRENCY_CONFIG?.[currency]?.symbol || '₹'}) • Click to change region`}
            aria-label={`Active Currency: ${currency}, click to change`}
            data-testid="nav-currency-switcher"
            className="nav-pill-btn"
            style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span aria-hidden="true" style={{ color: '#047857', fontWeight: 800 }}>{CURRENCY_CONFIG?.[currency]?.symbol || '₹'}</span>
            <span>{currency}</span>
            <ChevronDownIcon size={12} style={{ color: '#6b7280', marginLeft: '2px' }} aria-hidden="true" />
          </button>

          {/* 3e. Curated Wishlist Button */}
          <button
            onClick={openWishlist}
            title={currentUser ? `Curated Wishlist (${wishlist.length} saved items)` : 'Sign in to access your Curated Wishlist'}
            aria-label={currentUser ? `Curated Wishlist (${wishlist.length} saved items)` : 'Sign in to access your Curated Wishlist'}
            className={`nav-wishlist-btn ${activeView === 'wishlist' ? 'active' : ''}`}
          >
            <HeartIcon size={18} filled={activeView === 'wishlist'} />
            {currentUser && wishlist.length > 0 && (
              <span
                className="nav-wishlist-badge"
                title={`${wishlist.length} items saved in your Curated Wishlist`}
                style={{ position: 'absolute', top: '-2px', right: '-2px' }}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 3f. Shopping Bag Pill Button */}
          <button
            onClick={() => {
              if (!currentUser) {
                openAuthModal('login');
                return;
              }
              setIsCartOpen(true);
            }}
            aria-label={`Shopping Bag, ${currentUser ? cartCount : 0} items, total ${formatPrice(currentUser ? cartSubtotal : 0)}`}
            className="nav-pill-btn nav-cart-btn"
          >
            <BagIcon size={15} />
            <span className="nav-cart-badge">
              {currentUser ? cartCount : 0}
            </span>
            <span className="cart-pill-divider">|</span>
            <span className="cart-pill-price">
              {formatPrice(currentUser ? cartSubtotal : 0)}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};
