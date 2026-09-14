import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { StarIcon, HeartIcon, BagIcon, ArrowRightIcon } from './Icons';

// Import dedicated component stylesheet
import './QuickViewModal.css';

/**
 * ============================================================================
 * QuickViewModal Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Interactive modal allowing users to inspect product photography, select sizes
 *   and colorways, and add to bag directly without leaving the shop catalog.
 * 
 * Props:
 *   - product: The selected product object
 *   - isOpen: Boolean controlling visibility
 *   - onClose: Callback to dismiss modal
 */
export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openProductDetail,
    formatPrice,
    showToast
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Step 1: Sync state whenever selected product changes
  React.useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedColor(product.colorways?.[0]?.name || '');
      setSelectedSize(product.sizes?.[0]?.size || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const isSaved = isInWishlist(product.id);
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800', title: 'Product' }];

  // Step 2: Handle adding item to cart
  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Added ${quantity}x "${product.title}" to your cart`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="820px">
      <div className="quickview-layout">
        
        {/* ── Left Column: Image Gallery ── */}
        <div>
          <div className="quickview-hero-img-box">
            <img
              src={images[activeImageIdx]?.url || images[0]?.url}
              alt={product.title}
              className="quickview-hero-img"
            />
            {discountPercent && (
              <span className="quickview-discount-tag">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="quickview-thumbnails-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`quickview-thumb-btn ${activeImageIdx === idx ? 'active' : ''}`}
                >
                  <img src={img.url} alt="" className="quickview-thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column: Details & Selectors ── */}
        <div className="quickview-details-column">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                {product.category}
              </span>
              <span style={{ fontSize: '0.6875rem', color: product.inStock ? '#059669' : '#d97706', fontWeight: 700 }}>
                {product.inStock ? '✓ In Stock' : 'Low Stock'}
              </span>
            </div>

            <h2 className="quickview-title">
              {product.title}
            </h2>

            {/* Rating Stars */}
            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={13} filled={i < Math.floor(product.rating)} />
                  ))}
                </div>
                <span style={{ fontWeight: 700, color: '#111827' }}>{product.rating}</span>
                <span style={{ color: '#6b7280' }}>({product.reviewsCount || 48} reviews)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="quickview-price-row">
            <span className="quickview-price">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="quickview-compare-price">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Subtitle / Description Snippet */}
          <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
            {product.subtitle || product.editorialDescription?.slice(0, 140) + '...'}
          </p>

          {/* Colorway Options */}
          {product.colorways && product.colorways.length > 0 && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Color: <span style={{ fontWeight: 500, color: '#6b7280' }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.colorways.map((cw, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(cw.name)}
                    className={`quickview-swatch-circle ${selectedColor === cw.name ? 'selected' : ''}`}
                    style={{ backgroundColor: cw.hex }}
                    title={cw.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Size: <span style={{ fontWeight: 500, color: '#6b7280' }}>{selectedSize}</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(s.size)}
                    className={`quickview-size-pill ${selectedSize === s.size ? 'selected' : ''}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Buttons */}
          <div className="quickview-actions-row">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff'
            }}>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '8px 12px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'transparent' }}
              >
                -
              </button>
              <span style={{ padding: '0 8px', fontSize: '0.875rem', fontWeight: 700 }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '8px 12px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'transparent' }}
              >
                +
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleAddToCart}
              className="quickview-add-bag-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <BagIcon size={16} />
              <span>Add to Cart</span>
            </Button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: isSaved ? '#fef2f2' : '#ffffff',
                color: isSaved ? '#e11d48' : '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isSaved ? 'In Wishlist' : 'Add to Wishlist'}
            >
              <HeartIcon size={18} filled={isSaved} />
            </button>
          </div>

          {/* Full Details Navigation */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <button
              onClick={() => {
                onClose();
                openProductDetail(product.id);
              }}
              style={{
                fontSize: '0.75rem',
                color: '#0f1115',
                fontWeight: 700,
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              <span>View Full Product Page &amp; Specifications</span>
              <ArrowRightIcon size={12} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
