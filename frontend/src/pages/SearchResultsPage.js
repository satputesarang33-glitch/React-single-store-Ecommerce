import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { SearchIcon, ChevronRightIcon } from '../components/Icons';

/**
 * SearchResultsPage Component
 * Dedicated full search results page with live query input, category pills, and products grid.
 */
export const SearchResultsPage = () => {
  const { products, searchQuery, setSearchQuery, setActiveView } = useStore();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || searchParams.get('search');

  const [localQuery, setLocalQuery] = useState(queryParam !== null ? queryParam : (searchQuery || ''));
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (queryParam !== null && queryParam !== undefined && queryParam !== localQuery) {
      setLocalQuery(queryParam);
      if (setSearchQuery) setSearchQuery(queryParam);
    }
  }, [queryParam, localQuery, setSearchQuery]);

  const categories = ['ALL', 'Premium Sneakers', 'Casual T-Shirts', 'Smart Watches', 'Backpacks', 'Headphones', 'Sunglasses', 'Wallets', 'Fitness Accessories'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(localQuery);
    }
  };

  const effectiveQuery = queryParam !== null && queryParam !== undefined ? queryParam : (searchQuery || localQuery);

  // Filter products by search text and selected category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = effectiveQuery.toLowerCase().trim();
      const matchesText =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.editorialDescription && p.editorialDescription.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesText && matchesCat;
    });
  }, [products, effectiveQuery, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '32px 0 80px 0' }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Search Results</span>
          </nav>

          {/* Search Header Form */}
          <div style={{
            backgroundColor: '#fafaf9',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '36px'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              {effectiveQuery ? `Search Results for "${effectiveQuery}"` : 'Search UrbanCart Catalogue'}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '20px' }}>
              Showing {sortedProducts.length} matching lifestyle goods across our active ateliers.
            </p>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '600px' }}>
              <div style={{
                position: 'relative',
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ position: 'absolute', left: '14px', color: '#9ca3af' }}>
                  <SearchIcon size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search sneakers, watches, bags, headphones, sunglasses..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '9999px',
                    padding: '12px 20px 12px 42px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.8125rem', borderRadius: '9999px' }}
              >
                SEARCH
              </button>
            </form>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: selectedCategory === cat ? '#0f1115' : '#ffffff',
                    color: selectedCategory === cat ? '#ffffff' : '#4b5563',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>
              {sortedProducts.length} Items Found
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280' }}>
              <span>SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#fafaf9',
              borderRadius: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                No results found matching your query.
              </p>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '20px' }}>
                Try searching for broader terms like "sneakers", "backpack", "watch", or "headphones".
              </p>
              <button
                onClick={() => {
                  setLocalQuery('');
                  setSelectedCategory('ALL');
                }}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.75rem' }}
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="catalog-products-grid">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
