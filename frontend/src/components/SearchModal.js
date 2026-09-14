import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { SearchIcon, CloseIcon, ChevronRightIcon, BagIcon } from './Icons';

// Import dedicated component stylesheet
import './SearchModal.css';

/**
 * ============================================================================
 * SearchModal Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Spotlight search overlay (Cmd+K / Ctrl+K) providing instant product preview,
 *   quick navigation, trending keywords, and direct add-to-bag capability.
 * 
 * State:
 *   - query: User's real-time search string
 *   - filtered: Dynamically filtered product list matching title, category, brand, or SKU
 */
export const SearchModal = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    openProductDetail,
    openSearchResults,
    addToCart,
    formatPrice
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Step 1: Global keyboard listeners for Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Step 2: Auto-focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Step 3: Real-time filtered product list
  const filtered = query.trim()
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.sku?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (id) => {
    setIsSearchOpen(false);
    openProductDetail(id);
  };

  const trendingTags = ['Low-Top Sneaker', 'Ceramic Watch', 'Daypack', 'Heavyweight Tee', 'Leather Wallet', 'Eyewear'];

  return (
    <div 
      className="search-modal-backdrop"
      onClick={() => setIsSearchOpen(false)}
    >
      <div 
        className="search-modal-surface"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Search Input Bar ── */}
        <div className="search-modal-input-bar">
          <SearchIcon size={20} style={{ color: '#9ca3af' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search archival products, materials, SKUs..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) {
                openSearchResults(query.trim());
              }
            }}
            className="search-modal-input"
          />
          {query && (
            <button onClick={() => setQuery('')} className="search-modal-clear-btn" title="Clear search">
              <CloseIcon size={16} />
            </button>
          )}
          <kbd className="search-modal-esc-badge">
            ESC
          </kbd>
        </div>

        {/* ── Content Results or Trending Tags ── */}
        <div className="search-modal-results">
          {query.trim() ? (
            <div>
              <div className="search-modal-section-title">
                MATCHING PRODUCTS ({filtered.length})
              </div>

              {filtered.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                  No curated goods match "{query}".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filtered.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.id)}
                      className="search-result-item"
                    >
                      <div className="search-result-left">
                        <img
                          src={p.images?.[0]?.url || ''}
                          alt={p.title}
                          className="search-result-thumb"
                        />
                        <div>
                          <div className="search-result-title">
                            {p.title}
                          </div>
                          <div className="search-result-meta">
                            {p.category} • {p.brand}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="search-result-price">
                          {formatPrice(p.price)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p, p.colorways?.[0]?.name || '', p.sizes?.[0]?.size || 'Default', 1);
                          }}
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            backgroundColor: '#f3f4f6',
                            color: '#111827',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          title="Quick Add to Bag"
                        >
                          <BagIcon size={13} />
                        </button>
                        <ChevronRightIcon size={14} style={{ color: '#9ca3af' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="search-modal-section-title">
                TRENDING ATELIER ARCHIVES
              </div>
              <div className="search-trending-tags">
                {trendingTags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(tag);
                      openSearchResults(tag);
                    }}
                    className="search-tag-chip"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
