import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Footer } from '../components/Footer';
import {
  RotateCcwIcon,
  SearchIcon,
  FilterIcon,
  CloseIcon,
  StarIcon
} from '../components/Icons';

/**
 * ShopCatalog Component — Minimalist Editorial Experience
 * Clean, uncluttered layout with modern typography, refined sidebar, and elegant product cards.
 */
const CATEGORIES = [
  'ALL',
  'Premium Sneakers',
  'Casual T-Shirts',
  'Smart Watches',
  'Backpacks',
  'Headphones',
  'Sunglasses',
  'Wallets',
  'Fitness Accessories'
];

export const ShopCatalog = () => {
  const {
    products,
    setActiveView,
    formatPrice,
    selectedCategory,
    setSelectedCategory
  } = useStore();

  // Search state
  const [catalogSearch, setCatalogSearch] = useState('');

  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search') || searchParams.get('q');

  // Sync category from URL parameter
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory && setSelectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl, selectedCategory, setSelectedCategory]);

  // Sync search query from URL parameter
  useEffect(() => {
    if (searchFromUrl !== null && searchFromUrl !== undefined && searchFromUrl !== catalogSearch) {
      setCatalogSearch(searchFromUrl);
    }
  }, [searchFromUrl, catalogSearch]);

  // Filters state
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(350);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sorting state: 'popularity' | 'newest' | 'price-asc' | 'price-desc'
  const [sortBy, setSortBy] = useState('popularity');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mobile Filter Drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // 1. Calculate count per category
  const categoryCounts = useMemo(() => {
    const counts = { ALL: products.length };
    CATEGORIES.forEach(cat => {
      if (cat !== 'ALL') {
        counts[cat] = products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
      }
    });
    return counts;
  }, [products]);

  // 2. Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      if (catalogSearch.trim()) {
        const query = catalogSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        const matchSub = p.subtitle?.toLowerCase().includes(query);
        if (!matchTitle && !matchCat && !matchSub) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Price filter
      if (p.price > maxPrice) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && (p.rating || 0) < minRating) {
        return false;
      }

      // Stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    });
  }, [products, catalogSearch, selectedCategory, maxPrice, minRating, inStockOnly]);

  // 3. Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
    }
    // popularity / default
    return list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }, [filteredProducts, sortBy]);

  // 4. Pagination calculations
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, validCurrentPage, itemsPerPage]);

  const startIndex = totalItems === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(validCurrentPage * itemsPerPage, totalItems);

  // Clear / Reset all filters
  const handleClearFilters = () => {
    setCatalogSearch('');
    setSelectedCategory('ALL');
    setMaxPrice(350);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    catalogSearch.trim() !== '' ||
    selectedCategory !== 'ALL' ||
    maxPrice < 350 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '28px 0 80px 0' }}>
        <div className="container">
          {/* Subtle Clean Breadcrumb */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#9ca3af',
            marginBottom: '16px'
          }}>
            <span
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              onClick={() => setActiveView('storefront')}
              onMouseOver={e => e.currentTarget.style.color = '#111827'}
              onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
            >
              Home
            </span>
            <span>/</span>
            <span
              style={{ cursor: 'pointer', color: selectedCategory === 'ALL' ? '#111827' : '#9ca3af', fontWeight: selectedCategory === 'ALL' ? 600 : 400 }}
              onClick={() => { setSelectedCategory('ALL'); setCurrentPage(1); }}
            >
              Shop
            </span>
            {selectedCategory !== 'ALL' && (
              <>
                <span>/</span>
                <span style={{ color: '#111827', fontWeight: 600 }}>{selectedCategory}</span>
              </>
            )}
          </nav>

          {/* Clean Catalog Header & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '1px solid #f0f0ed',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.875rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#111827',
                margin: 0
              }}>
                {selectedCategory === 'ALL' ? 'Shop All Products' : selectedCategory}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '6px', marginBottom: 0 }}>
                Carefully crafted essentials curated for effortless everyday living.
              </p>
            </div>

            {/* Top Toolbar: Search, Mobile Filter Toggle, and Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* Inline Search Input */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '7px 12px',
                border: '1px solid #e5e7eb',
                width: '210px',
                transition: 'border-color 0.15s ease'
              }}>
                <SearchIcon size={14} style={{ color: '#9ca3af', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={catalogSearch}
                  onChange={(e) => {
                    setCatalogSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    fontSize: '0.75rem',
                    color: '#111827',
                    width: '100%'
                  }}
                />
                {catalogSearch && (
                  <button
                    onClick={() => setCatalogSearch('')}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                  >
                    <CloseIcon size={12} style={{ color: '#9ca3af' }} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="mobile-filter-toggle-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                <FilterIcon size={14} />
                <span>Filters {hasActiveFilters ? '•' : ''}</span>
              </button>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 500 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '7px 12px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    cursor: 'pointer'
                  }}
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main 2-Column Catalog Layout */}
          <div className="catalog-layout">
            {/* ======================================================= */}
            {/* DESKTOP FILTER SIDEBAR — MINIMALIST                      */}
            {/* ======================================================= */}
            <aside className="catalog-filter-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Header & Clear Filter */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f0f0ed' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Filters
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.color = '#111827'}
                    onMouseOut={e => e.currentTarget.style.color = '#6b7280'}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Filter by Category */}
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '8px' }}>
                  CATEGORIES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentPage(1);
                        }}
                        className={`catalog-cat-item ${isSelected ? 'active' : ''}`}
                      >
                        <span>{cat}</span>
                        <span className="catalog-cat-count">
                          ({categoryCounts[cat] || 0})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Filter by Price Range */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280' }}>
                    PRICE
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                    Up to {formatPrice(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ width: '100%', accentColor: '#111827', cursor: 'pointer' }}
                />

                {/* Clean Price Presets */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {[
                    { label: 'All', val: 350 },
                    { label: 'Under $100', val: 100 },
                    { label: 'Under $150', val: 150 },
                    { label: 'Under $200', val: 200 }
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => {
                        setMaxPrice(preset.val);
                        setCurrentPage(1);
                      }}
                      className={`catalog-price-preset ${maxPrice === preset.val ? 'active' : ''}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Filter by Rating */}
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '6px' }}>
                  CUSTOMER RATING
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {[
                    { rating: 0, label: 'All Ratings' },
                    { rating: 4.8, label: '4.8 & above' },
                    { rating: 4.5, label: '4.5 & above' },
                    { rating: 4.0, label: '4.0 & above' }
                  ].map(r => (
                    <div
                      key={r.rating}
                      onClick={() => {
                        setMinRating(r.rating);
                        setCurrentPage(1);
                      }}
                      className={`catalog-rating-item ${minRating === r.rating ? 'active' : ''}`}
                    >
                      <div style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        border: minRating === r.rating ? '4px solid #111827' : '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        flexShrink: 0
                      }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {r.rating > 0 && <StarIcon size={11} filled color="#f59e0b" />}
                        <span>{r.label}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. In-Stock Filter */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    style={{ accentColor: '#111827', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#4b5563',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#111827'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <RotateCcwIcon size={12} />
                  <span>Reset All Filters</span>
                </button>
              )}
            </aside>

            {/* ======================================================= */}
            {/* PRODUCT GRID & PAGINATION AREA                          */}
            {/* ======================================================= */}
            <div>
              {/* Product Count & Active Filters Pills Strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {/* Product Count */}
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  Showing <strong style={{ color: '#111827' }}>{startIndex}–{endIndex}</strong> of <strong style={{ color: '#111827' }}>{totalItems}</strong> products
                </span>

                {/* Active Filter Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {catalogSearch && (
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>"{catalogSearch}"</span>
                      <CloseIcon size={10} style={{ cursor: 'pointer' }} onClick={() => setCatalogSearch('')} />
                    </span>
                  )}

                  {selectedCategory !== 'ALL' && (
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{selectedCategory}</span>
                      <CloseIcon size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('ALL')} />
                    </span>
                  )}

                  {maxPrice < 350 && (
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>≤ {formatPrice(maxPrice)}</span>
                      <CloseIcon size={10} style={{ cursor: 'pointer' }} onClick={() => setMaxPrice(350)} />
                    </span>
                  )}

                  {minRating > 0 && (
                    <span style={{
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{minRating}★+</span>
                      <CloseIcon size={10} style={{ cursor: 'pointer' }} onClick={() => setMinRating(0)} />
                    </span>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              {paginatedProducts.length === 0 ? (
                <div style={{
                  padding: '70px 20px',
                  textAlign: 'center',
                  backgroundColor: '#fafaf9',
                  borderRadius: '12px',
                  border: '1px dashed #d1d5db'
                }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '8px' }}>🔍</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
                    No products matched your criteria
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '4px 0 16px 0' }}>
                    Try adjusting your category, search keywords, price slider, or rating filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.75rem' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="catalog-products-grid">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '44px',
                  paddingTop: '24px',
                  borderTop: '1px solid #f0f0ed'
                }}>
                  {/* Previous Page Button */}
                  <button
                    type="button"
                    disabled={validCurrentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: validCurrentPage === 1 ? '#f9fafb' : '#ffffff',
                      color: validCurrentPage === 1 ? '#9ca3af' : '#111827',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ‹ Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        border: validCurrentPage === pageNum ? '1px solid #111827' : '1px solid #e5e7eb',
                        backgroundColor: validCurrentPage === pageNum ? '#111827' : '#ffffff',
                        color: validCurrentPage === pageNum ? '#ffffff' : '#111827',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Page Button */}
                  <button
                    type="button"
                    disabled={validCurrentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: validCurrentPage === totalPages ? '#f9fafb' : '#ffffff',
                      color: validCurrentPage === totalPages ? '#9ca3af' : '#111827',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: validCurrentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================= */}
      {/* MOBILE FILTER DRAWER                                    */}
      {/* ======================================================= */}
      {isMobileFiltersOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '340px',
            height: '100%',
            backgroundColor: '#ffffff',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0ed', paddingBottom: '12px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>
                Filters
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Categories */}
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', color: '#6b7280' }}>
                CATEGORIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`catalog-cat-item ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    <span>{cat}</span>
                    <span className="catalog-cat-count">({categoryCounts[cat] || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280' }}>MAX PRICE</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="40"
                max="350"
                step="10"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#111827' }}
              />
            </div>

            {/* Rating */}
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, marginBottom: '6px', color: '#6b7280' }}>RATING</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { rating: 0, label: 'All Ratings' },
                  { rating: 4.8, label: '4.8 & above' },
                  { rating: 4.5, label: '4.5 & above' },
                  { rating: 4.0, label: '4.0 & above' }
                ].map(r => (
                  <div
                    key={r.rating}
                    onClick={() => setMinRating(r.rating)}
                    className={`catalog-rating-item ${minRating === r.rating ? 'active' : ''}`}
                  >
                    <div style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      border: minRating === r.rating ? '4px solid #111827' : '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      flexShrink: 0
                    }} />
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="btn-primary"
                style={{ padding: '11px', fontSize: '0.8125rem', width: '100%' }}
              >
                Apply Filters ({totalItems} Results)
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  padding: '9px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* QUICK VIEW MODAL                                        */}
      {/* ======================================================= */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
};
