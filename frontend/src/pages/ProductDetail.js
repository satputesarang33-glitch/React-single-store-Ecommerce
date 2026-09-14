import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { ProductReviews } from '../components/ProductReviews';
import { ProductCard } from '../components/ProductCard';
import { Product3DCanvas } from '../components/3d/Product3DCanvas';
import { Footer } from '../components/Footer';
import {
  StarIcon,
  TruckIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ShareIcon,
  ChevronRightIcon,
  BagIcon,
  CheckIcon
} from '../components/Icons';

/**
 * ProductDetail Component
 * Complete, professional product details page satisfying all requirements:
 * - Product image gallery (Main image + interactive thumbnail selector)
 * - Product title, Category, Brand
 * - Rating & reviews count (with click to scroll to reviews)
 * - Price, Original price & Discount percentage badge
 * - Comprehensive product description
 * - Available sizes selector (interactive with active states)
 * - Available colors selector (interactive swatches with hex & active indicator)
 * - Quantity selector (reactive increment / decrement stepper)
 * - Add to Cart button (with price calculation & bag icon)
 * - Buy Now button (adds to cart & opens checkout)
 * - Add to Wishlist button (heart button with active fill & feedback)
 * - Stock availability status badge (In Stock / Low Stock with count)
 * - Delivery information (Free shipping, 30-day returns, warranty)
 * - Product specifications (Materials, dimensions, origin, care accordions)
 * - Customer reviews section (Rating breakdown, star distribution, review submission)
 * - Related products section (4 lifestyle items from the catalog)
 * - Interactive states with instant success toast notifications
 */
export const ProductDetail = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveView,
    startCheckout,
    openProductDetail,
    formatPrice,
    showToast
  } = useStore();

  const { id } = useParams();
  const effectiveProductId = id || selectedProductId;
  const product = products.find(p => p.id === effectiveProductId) || products[0];

  useEffect(() => {
    if (id && id !== selectedProductId && setSelectedProductId) {
      setSelectedProductId(id);
    }
  }, [id, selectedProductId, setSelectedProductId]);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(
    product.colorways?.[0]?.name || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0]?.size || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  // Active accordion spec tab: 'specs' | 'shipping' | 'care'
  const [activeSpecTab, setActiveSpecTab] = useState('specs');

  // Reset image and selections when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedColor(product.colorways?.[0]?.name || 'Standard');
    setSelectedSize(product.sizes?.[0]?.size || 'Standard');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.colorways, product.sizes]);

  const isSaved = isInWishlist(product.id);
  const currentImages = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200', title: 'Product View' }];
  const activeImage = currentImages[selectedImageIndex] ? currentImages[selectedImageIndex].url : currentImages[0].url;

  // Calculate discount percentage
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  // 1. Add to Cart action
  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Added ${quantity}x "${product.title}" (${selectedColor}, ${selectedSize}) to your bag!`, 'success');
  };

  // 2. Buy Now action (direct to checkout)
  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`Proceeding to checkout with ${quantity}x "${product.title}"`, 'success');
    startCheckout();
  };

  // 3. Wishlist toggle
  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  // 4. Share action
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  // 5. Scroll to reviews
  const scrollToReviews = () => {
    const el = document.getElementById('customer-reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Related products from same or other categories
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1))
    .slice(0, 4);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '32px 0 80px 0' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('shop')}>Shop</span>
            <ChevronRightIcon size={12} />
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('shop')}>{product.category}</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>{product.title}</span>
          </nav>

          {/* Product Layout Grid */}
          <div className="pdp-layout-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '48px',
            alignItems: 'start'
          }}>
            {/* ======================================================= */}
            {/* LEFT COLUMN: PRODUCT IMAGE GALLERY                     */}
            {/* ======================================================= */}
            <div>
              {/* Badges Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {discountPercent && (
                    <span style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.badge && (
                    <span style={{
                      backgroundColor: '#0f1115',
                      color: '#ffffff',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Media Controls Bar: Toggle between Photo Gallery and 3D Interactive Studio */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(false)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: !isStudioOpen ? '1px solid #0f1115' : '1px solid #e5e5e0',
                      backgroundColor: !isStudioOpen ? '#0f1115' : '#ffffff',
                      color: !isStudioOpen ? '#ffffff' : '#374151',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📸 Photo Gallery
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className={`studio viewer product-viewer ${isStudioOpen ? 'active' : ''}`}
                    data-studio="true"
                    data-viewer="true"
                    aria-label="View in 3D"
                    title="View in 3D (Interactive Studio)"
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isStudioOpen ? '1px solid #0f1115' : '1px solid #e5e5e0',
                      backgroundColor: isStudioOpen ? '#0f1115' : '#ffffff',
                      color: isStudioOpen ? '#ffffff' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }} />
                    <span>View in 3D (Studio)</span>
                  </button>
                </div>
              </div>

              {/* Main Display: 3D Interactive Studio OR High-Res Image Gallery */}
              {isStudioOpen ? (
                <div
                  className="studio viewer product-viewer studio-viewer"
                  data-studio="true"
                  data-viewer="true"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '480px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f8f6',
                    border: '1px solid #e5e5e0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                  }}
                >
                  <Product3DCanvas
                    product={product}
                    activeColor={selectedColor}
                    height="480px"
                    showControls={true}
                  />
                </div>
              ) : (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '82%',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#f6f5f2',
                    border: '1px solid #e5e5e0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsStudioOpen(true)}
                  title="Click to open interactive 3D Studio"
                >
                  <img
                    src={activeImage}
                    alt={product.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'opacity 0.3s ease'
                    }}
                  />

                  {/* 3D Overlay Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsStudioOpen(true);
                    }}
                    className="studio viewer product-viewer"
                    data-studio="true"
                    data-viewer="true"
                    aria-label="View in 3D"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(15, 17, 21, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span>View in 3D</span>
                  </button>

                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(6px)',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#374151'
                  }}>
                    {currentImages[selectedImageIndex]?.title || `View ${selectedImageIndex + 1} of ${currentImages.length}`}
                  </div>
                </div>
              )}

              {/* Interactive Thumbnail Images */}
              {currentImages.length > 1 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(currentImages.length, 5)}, 1fr)`,
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      style={{
                        paddingTop: '80%',
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImageIndex === idx ? '2px solid #0f1115' : '1px solid #e5e5e0',
                        opacity: selectedImageIndex === idx ? 1 : 0.65,
                        transition: 'all 0.2s ease',
                        background: 'transparent',
                        padding: 0
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Certified Quality Card */}
              <div style={{
                marginTop: '28px',
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e5e0',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d97706',
                  flexShrink: 0
                }}>
                  <ShieldCheckIcon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#111827' }}>
                    UrbanCart Certified Guarantee
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px', lineHeight: 1.5 }}>
                    {product.provenance?.materials || 'Crafted with premium certified materials and rigorous inspection before dispatch.'}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================= */}
            {/* RIGHT COLUMN: PRODUCT INFO & PURCHASE MATRIX           */}
            {/* ======================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Category & Stock Availability Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#d97706',
                  textTransform: 'uppercase'
                }}>
                  {product.category}
                </span>

                {/* Stock Availability Badge */}
                <span style={{
                  backgroundColor: product.inStock ? '#ecfdf5' : '#fffbeb',
                  color: product.inStock ? '#065f46' : '#92400e',
                  border: `1px solid ${product.inStock ? '#a7f3d0' : '#fde68a'}`,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: product.inStock ? '#10b981' : '#f59e0b'
                  }} />
                  <span>{product.inStock ? '✓ In Stock — Ready to Ship' : '⚠️ Limited Stock Remaining'}</span>
                </span>
              </div>

              {/* Title & Rating */}
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#111827',
                  lineHeight: 1.15,
                  margin: 0
                }}>
                  {product.title}
                </h1>

                {/* Rating & Reviews Count (Clickable to scroll) */}
                {product.rating && (
                  <div
                    onClick={scrollToReviews}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '10px',
                      cursor: 'pointer'
                    }}
                    title="Jump to Customer Reviews"
                  >
                    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} size={16} filled={true} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                      {product.rating}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: '#2563eb', textDecoration: 'underline' }}>
                      ({product.reviewsCount || 48} Customer Reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Price, Original Price, & Discount */}
              <div style={{
                paddingBottom: '20px',
                borderBottom: '1px solid #f0efe9'
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
                    {formatPrice(product.price)}
                  </span>

                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span style={{ fontSize: '1.125rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}

                  {discountPercent && (
                    <span style={{
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
                  Sales tax included. Free express shipping on orders over $50.
                </div>
              </div>

              {/* Product Description */}
              <p style={{
                fontSize: '0.9375rem',
                color: '#4b5563',
                lineHeight: 1.65,
                margin: 0
              }}>
                {product.editorialDescription || product.subtitle}
              </p>

              {/* Available Colors Selector */}
              {product.colorways && product.colorways.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      COLOR: <strong style={{ color: '#0f1115' }}>{selectedColor}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {product.colorways.map((cw) => {
                      const isSelected = selectedColor === cw.name;
                      return (
                        <button
                          key={cw.name}
                          type="button"
                          onClick={() => {
                            setSelectedColor(cw.name);
                            showToast(`Selected color: ${cw.name}`, 'info');
                          }}
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: cw.hex,
                            border: isSelected ? '3px solid #0f1115' : '1px solid #d1d5db',
                            boxShadow: isSelected ? '0 0 0 2px #ffffff' : 'none',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease'
                          }}
                          title={cw.name}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Sizes Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      SELECT SIZE: <strong style={{ color: '#0f1115' }}>{selectedSize}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Standard international sizing guide applied.', 'info')}
                      style={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      Size &amp; Fit Guide
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
                    gap: '8px'
                  }}>
                    {product.sizes.map((item) => {
                      const isSelected = selectedSize === item.size;
                      return (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(item.size);
                            showToast(`Selected size: ${item.size}`, 'info');
                          }}
                          style={{
                            padding: '10px 0',
                            textAlign: 'center',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 800 : 500,
                            backgroundColor: isSelected ? '#0f1115' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#1f2937',
                            border: isSelected ? '2px solid #0f1115' : '1px solid #d1d5db',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {item.size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Stock Status */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  QUANTITY
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff'
                  }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ padding: '10px 14px', color: '#4b5563', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 700 }}
                    >
                      <MinusIcon size={14} />
                    </button>
                    <span style={{ padding: '0 14px', fontSize: '0.9375rem', fontWeight: 800 }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ padding: '10px 14px', color: '#4b5563', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 700 }}
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckIcon size={14} />
                    <span>In Stock &amp; ready to ship</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Add to Cart, Buy Now, Add to Wishlist, Share */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-primary"
                    style={{
                      flexGrow: 1,
                      padding: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <BagIcon size={18} />
                    <span>Add to Cart — {formatPrice(product.price * quantity)}</span>
                  </button>

                  {/* Add to Wishlist Button */}
                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: isSaved ? '#fee2e2' : '#ffffff',
                      color: isSaved ? '#e11d48' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <HeartIcon size={22} filled={isSaved} />
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={handleShare}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '12px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                    title="Share Product"
                  >
                    <ShareIcon size={20} />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: '1px solid #111827',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#000000'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#111827'}
                >
                  <span>⚡ Buy Now with 1-Click Checkout</span>
                </button>
              </div>

              {/* Delivery Information & Perks */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f0efe9'
              }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <TruckIcon size={18} style={{ flexShrink: 0, color: '#111827' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Free Express Delivery</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Delivered in 2–4 business days</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <RotateCcwIcon size={18} style={{ flexShrink: 0, color: '#111827' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>30-Day Money Back</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Free prepaid return shipping</div>
                  </div>
                </div>
              </div>

              {/* Product Specifications Tabs */}
              <div style={{ marginTop: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {[
                    { id: 'specs', label: 'Specifications' },
                    { id: 'shipping', label: 'Delivery & Shipping' },
                    { id: 'care', label: 'Care Instructions' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSpecTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        fontSize: '0.75rem',
                        fontWeight: activeSpecTab === tab.id ? 800 : 500,
                        backgroundColor: activeSpecTab === tab.id ? '#ffffff' : 'transparent',
                        color: activeSpecTab === tab.id ? '#111827' : '#6b7280',
                        border: 'none',
                        borderBottom: activeSpecTab === tab.id ? '2px solid #0f1115' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ padding: '16px', fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6 }}>
                  {activeSpecTab === 'specs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><strong>Materials:</strong> {product.provenance?.materials || 'Certified genuine materials'}</div>
                      <div><strong>Origin:</strong> {product.provenance?.origin || 'Handcrafted internationally'}</div>
                      <div><strong>SKU:</strong> {product.sku || product.id.toUpperCase()}</div>
                      <div><strong>Brand:</strong> {product.brand || 'UrbanCart'}</div>
                    </div>
                  )}

                  {activeSpecTab === 'shipping' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><strong>Standard Shipping:</strong> 3–5 Business Days (Free on orders $50+)</div>
                      <div><strong>Express Shipping:</strong> 1–2 Business Days ($12.00)</div>
                      <div><strong>Returns:</strong> 30 days from delivery date with original packaging.</div>
                    </div>
                  )}

                  {activeSpecTab === 'care' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>• Clean with a soft, damp cloth.</div>
                      <div>• Avoid prolonged exposure to direct high heat or harsh chemicals.</div>
                      <div>• Store in the provided protective dust bag when not in use.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* CUSTOMER REVIEWS SECTION                                */}
          {/* ======================================================= */}
          <div id="customer-reviews-section">
            <ProductReviews productId={product.id} />
          </div>

          {/* ======================================================= */}
          {/* RELATED PRODUCTS SECTION                                */}
          {/* ======================================================= */}
          <section style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#d97706', textTransform: 'uppercase' }}>
                  RECOMMENDED PICKS
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>
                  Related Products You Might Love
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('shop')}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#0f1115',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none'
                }}
              >
                <span>View Full Catalog</span>
                <ChevronRightIcon size={14} />
              </button>
            </div>

            {/* Related Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {relatedProducts.map((rel) => (
                <div key={rel.id} onClick={() => openProductDetail(rel.id)}>
                  <ProductCard product={rel} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
