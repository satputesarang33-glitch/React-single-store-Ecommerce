import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HeartIcon, BagIcon, StarIcon, EyeIcon } from './Icons';

// Import dedicated component stylesheet
import './ProductCard.css';

/**
 * ============================================================================
 * ProductCard Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Displays a single product item in a clean editorial grid.
 *   Provides instant interactions: hover zoom, wishlist toggle, quick add-to-bag,
 *   and quick view modal trigger.
 * 
 * Props:
 *   - product: Object containing id, title, price, compareAtPrice, images, category, rating, etc.
 *   - onQuickView: Function callback invoked when user clicks the quick view icon.
 * 
 * Store Connections (useStore):
 *   - openProductDetail: Navigates to full product detail page
 *   - toggleWishlist: Adds or removes product from user's wishlist
 *   - isInWishlist: Boolean check if product is currently saved
 *   - addToCart: Directly places the default colorway/size into cart
 *   - formatPrice: Converts number to localized currency string (e.g., $120.00)
 */
export const ProductCard = ({ product, onQuickView }) => {
  const { openProductDetail, toggleWishlist, isInWishlist, addToCart, formatPrice } = useStore();
  
  // Local state for hover transition (shows secondary preview image on hover)
  const [isHovered, setIsHovered] = useState(false);

  // Derive product attributes safely
  const selectedColor = product.colorways && product.colorways.length > 0 ? product.colorways[0].name : '';
  const isSaved = isInWishlist(product.id);
  const primaryImage = product.images && product.images.length > 0 ? product.images[0].url : '';
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1].url : primaryImage;

  // Calculate discount percentage if original price is higher
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  // Step 1: Quick Add to Bag handler
  const handleQuickAdd = (e) => {
    e.stopPropagation(); // Prevent opening product detail page
    const defaultSize = product.sizes && product.sizes[0] ? product.sizes[0].size : 'Default';
    addToCart(product, selectedColor, defaultSize, 1);
  };

  // Step 2: Quick View modal handler
  const handleQuickViewClick = (e) => {
    e.stopPropagation(); // Prevent card click event bubbling
    if (onQuickView) {
      onQuickView(product);
    } else {
      openProductDetail(product.id);
    }
  };

  return (
    <div 
      className="product-card-clean"
      onClick={() => openProductDetail(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') openProductDetail(product.id);
      }}
    >
      {/* ── Visual Photography Area ── */}
      <div className="product-card-image-wrap">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.title}
          className="product-card-image"
          loading="lazy"
        />

        {/* Minimalist Single Badge (Discount % or Category Badge) */}
        {discountPercent ? (
          <span className="product-card-badge-minimal">
            -{discountPercent}%
          </span>
        ) : product.badge ? (
          <span className="product-card-badge-minimal product-card-badge-tag">
            {product.badge}
          </span>
        ) : null}

        {/* Subtle Wishlist Heart Button */}
        <button
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="product-card-wishlist-btn"
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon size={15} filled={isSaved} color={isSaved ? '#e11d48' : '#374151'} />
        </button>

        {/* Quick Action Hover Bar */}
        <div className="product-card-hover-actions">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="product-card-quick-add-btn"
            title="Add to Bag"
          >
            <BagIcon size={14} />
            <span>Add to Bag</span>
          </button>
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="product-card-quick-view-btn"
            title="Quick View"
            aria-label="Quick View"
          >
            <EyeIcon size={14} />
          </button>
        </div>
      </div>

      {/* ── Product Information & Pricing ── */}
      <div className="product-card-details">
        <span className="product-card-category">{product.category}</span>
        
        <h3 className="product-card-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-card-bottom-row">
          <div className="product-card-price-group">
            <span className="product-card-price">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <del aria-label={`Original price ${formatPrice(product.compareAtPrice)}`} className="product-card-compare-price">
                {formatPrice(product.compareAtPrice)}
              </del>
            )}
          </div>

          {product.rating && (
            <div className="product-card-rating">
              <StarIcon size={11} filled color="#f59e0b" />
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
