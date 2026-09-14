import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { categoriesData } from '../data/products';
import {
  TruckIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  HeadphonesIcon,
  ArrowRightIcon,
  StarIcon,
  CheckIcon
} from '../components/Icons';

/**
 * StorefrontHome Component
 * Complete, beautiful, high-converting homepage for UrbanCart.
 * 
 * Sections included:
 * 1. Header (TopNoticeBar & StorefrontNav with Logo, Nav links, Search bar, Wishlist, Cart count, Account button, Mobile menu)
 * 2. Hero Section (Large Promotional Banner with "Discover products you'll love", "Shop Now", "Explore Collection")
 * 3. Featured Categories (8 Lifestyle Categories with imagery and direct navigation)
 * 4. Best-Selling Products (Top-rated customer favorite items)
 * 5. New Arrivals (Fresh drops and newest arrivals)
 * 6. Special Offers (Flash deals with real-time countdown timer and discounted items)
 * 7. Promotional Banner (Seasonal upgrade event banner with 20% off coupon code URBAN20)
 * 8. Customer Reviews (Verified buyer testimonials with star ratings and photos)
 * 9. Newsletter Subscription (10% off perk and instant subscription)
 * 10. Footer (Comprehensive store footer)
 */
export const StorefrontHome = () => {
  const {
    products,
    openProductDetail,
    openShopCatalog,
    addToCart,
    formatPrice,
    showToast
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Live Flash Deal Countdown Timer (14 hours, 28 minutes, 45 seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Newsletter Submission
  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing! Check your inbox for your 10% welcome coupon.', 'success');
      setNewsletterEmail('');
    }
  };

  // Copy Coupon Code
  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('URBAN20');
    setCopiedCoupon(true);
    showToast('Promo code URBAN20 copied to clipboard!', 'success');
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  // Curate products for sections
  const bestSellers = products.filter(p => 
    p.isBestSeller || ['uc-fw-086', 'uc-sw-301', 'uc-bg-012', 'uc-hp-501'].includes(p.id)
  ).slice(0, 4);

  const newArrivals = products.filter(p => 
    p.badge === 'NEW' || ['uc-fw-092', 'uc-ap-095', 'uc-sw-102', 'uc-bg-015'].includes(p.id)
  ).slice(0, 4);

  const specialOffers = [
    {
      id: 'uc-ts-102',
      title: 'UrbanCart Merino Wool Baselayer Crew',
      category: 'Casual T-Shirts',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      salePrice: 55.00,
      originalPrice: 75.00,
      discount: '27% OFF',
      stockLeft: 6
    },
    {
      id: 'uc-sg-202',
      title: 'UrbanCart Aviator Titanium Frame',
      category: 'Sunglasses',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
      salePrice: 105.00,
      originalPrice: 140.00,
      discount: '25% OFF',
      stockLeft: 4
    },
    {
      id: 'uc-wl-402',
      title: 'UrbanCart Zip-Around Travel Folio',
      category: 'Wallets',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop',
      salePrice: 68.00,
      originalPrice: 90.00,
      discount: '24% OFF',
      stockLeft: 8
    },
    {
      id: 'uc-fa-602',
      title: 'UrbanCart Modular Training Duffel 40L',
      category: 'Fitness Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      salePrice: 79.00,
      originalPrice: 110.00,
      discount: '28% OFF',
      stockLeft: 5
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. HEADER (TopNoticeBar & StorefrontNav) */}
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1 }}>
        {/* ========================================================= */}
        {/* 2. HERO SECTION / LARGE PROMOTIONAL BANNER                */}
        {/* ========================================================= */}
        <section style={{
          backgroundColor: '#faf9f6',
          borderBottom: '1px solid rgba(0, 0, 0, 0.07)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Subtle Ambient Background Gradient Light */}
          <div style={{
            position: 'absolute',
            top: '-120px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{ padding: '60px 24px 72px 24px' }}>
            <div className="hero-grid">
              {/* Left Column: Headline & Call-to-action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Eyebrow Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  width: 'fit-content',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#374151',
                    textTransform: 'uppercase'
                  }}>
                    {/* Issue #6 fix: split into short uppercase label + sentence-case suffix */}
                    Collection<span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: '0.04em', marginLeft: '6px', color: '#6b7280' }}>• 2026 Edition</span>
                  </span>
                </div>

                {/* Main Heading */}
                <h1 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.08,
                  color: '#0f1115'
                }}>
                  Discover products<br />you'll love.
                </h1>

                {/* Short Description */}
                <p style={{
                  fontSize: '1.0625rem',
                  color: '#4b5563',
                  lineHeight: 1.65,
                  maxWidth: '480px'
                }}>
                  Shop quality products at the best prices. Premium footwear, casual apparel, smart watches, backpacks, and everyday essentials designed for durability and modern style.
                </p>

                {/* Call-to-action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => openShopCatalog('ALL')}
                    className="btn-primary"
                    style={{
                      padding: '14px 32px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Shop Now</span>
                    <ArrowRightIcon size={15} />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('featured-categories');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else openShopCatalog('ALL');
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '14px 28px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Explore Collection</span>
                    <ArrowRightIcon size={15} />
                  </button>
                </div>

                {/* Social Proof & Rating Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={15} filled />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>
                    <strong>4.95 / 5.0</strong> Customer Rating • Over 18,000 satisfied shoppers worldwide
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual (Editorial Photography) */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '100%',
                  height: '520px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#e7e5e4',
                  boxShadow: 'var(--shadow-luxury)'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                    alt="UrbanCart Premium Lifestyle Gear"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Top Right Floating Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(15, 17, 21, 0.88)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    PREMIUM SPECIMEN
                  </div>

                  {/* Floating Product Spotlight Card */}
                  <div 
                    onClick={() => openProductDetail('uc-fw-086')}
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      right: '24px',
                      left: '24px',
                      maxWidth: '340px',
                      marginLeft: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.94)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div>
                      <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.08em', color: '#4b5563', textTransform: 'uppercase' }}>
                        FEATURED PRODUCT
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                        Mono Low-Top Sneaker
                      </div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                        {formatPrice(160)}{' '}
                        <del aria-label={`Original price ${formatPrice(190)}`} style={{ fontSize: '0.75rem', color: '#52525b', textDecoration: 'line-through', marginLeft: '4px' }}>
                          {formatPrice(190)}
                        </del>
                      </div>
                    </div>

                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#0f1115',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <ArrowRightIcon size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TRUST & SERVICE BENEFIT STRIP                             */}
        {/* ========================================================= */}
        <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.07)', padding: '36px 0' }}>
          <div className="container">
            <div className="trust-grid">
              {[
                {
                  icon: TruckIcon,
                  title: 'FREE EXPRESS SHIPPING',
                  desc: 'Complimentary delivery on orders over $50'
                },
                {
                  icon: RotateCcwIcon,
                  title: '30-DAY EASY RETURNS',
                  desc: 'Hassle-free, money-back satisfaction guarantee'
                },
                {
                  icon: ShieldCheckIcon,
                  title: 'GENUINE QUALITY',
                  desc: 'Certified authentic materials & full warranty'
                },
                {
                  icon: HeadphonesIcon,
                  title: '24/7 CUSTOMER SUPPORT',
                  desc: 'Friendly assistance via chat, email & phone'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: '#fafaf9',
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = '#fafaf9';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#0f1115',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}>
                      <Icon size={19} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#111827' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. FEATURED CATEGORIES SECTION                            */}
        {/* ========================================================= */}
        <section id="featured-categories" style={{ padding: '68px 0', backgroundColor: '#faf9f6', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
                  SHOP BY CATEGORY
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  marginTop: '4px'
                }}>
                  Featured Categories
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Explore our hand-picked lifestyle collections across 8 distinct categories.
                </p>
              </div>

              <button
                onClick={() => openShopCatalog('ALL')}
                className="btn-secondary"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#0f1115',
                  borderColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px'
                }}
                aria-label="View all product categories"
              >
                <span>View All Categories</span>
                <ArrowRightIcon size={15} />
              </button>
            </div>

            <div className="categories-showcase-grid">
              {categoriesData.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => openShopCatalog(cat.categoryKey)}
                  style={{
                    position: 'relative',
                    height: '280px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#0f1115',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Explore ${cat.name} Collection, ${cat.itemsCount} products`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openShopCatalog(cat.categoryKey);
                    }
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.06)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={cat.image}
                    alt=""
                    aria-hidden="true"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 17, 21, 0.9) 0%, rgba(15, 17, 21, 0.35) 50%, transparent 100%)'
                  }} />

                  {/* Category Details */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    color: '#ffffff'
                  }}>
                    <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.85, textTransform: 'uppercase' }}>
                      {cat.itemsCount} PRODUCTS
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', marginTop: '2px' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, marginTop: '6px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Explore Collection</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. BEST-SELLING PRODUCTS SECTION                          */}
        {/* ========================================================= */}
        <section style={{ padding: '72px 0', backgroundColor: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#b45309', textTransform: 'uppercase' }}>
                  CUSTOMER FAVORITES
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  marginTop: '4px'
                }}>
                  Best-Selling Products
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Our most loved, highest-rated lifestyle gear chosen by thousands of shoppers.
                </p>
              </div>

              <button
                onClick={() => openShopCatalog('ALL')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#0f1115',
                  cursor: 'pointer'
                }}
              >
                <span>View All Best Sellers</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>

            {/* Product Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. NEW ARRIVALS SECTION                                   */}
        {/* ========================================================= */}
        <section style={{ padding: '72px 0', backgroundColor: '#faf9f6', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#047857', textTransform: 'uppercase' }}>
                  JUST DROPPED
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  marginTop: '4px'
                }}>
                  New Arrivals
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Discover the newest releases and latest styles added to the store this week.
                </p>
              </div>

              <button
                onClick={() => openShopCatalog('ALL')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#0f1115',
                  cursor: 'pointer'
                }}
              >
                <span>Explore All New Drops</span>
                <ArrowRightIcon size={14} />
              </button>
            </div>

            {/* Product Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. SPECIAL OFFERS SECTION (FLASH DEALS & COUNTDOWN)       */}
        {/* ========================================================= */}
        <section style={{ padding: '72px 0', backgroundColor: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            {/* Header & Live Countdown Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#dc2626', textTransform: 'uppercase' }}>
                  LIMITED TIME SAVINGS
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  marginTop: '4px'
                }}>
                  Special Offers &amp; Flash Deals
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                  Take advantage of limited-stock discounts on our top lifestyle essentials.
                </p>
              </div>

              {/* Countdown Timer Widget */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                padding: '10px 18px',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', marginRight: '6px' }}>
                  DEALS END IN:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#b91c1c' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.9375rem', border: '1px solid #fecaca' }}>
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.5625rem', color: '#991b1b', fontWeight: 700, marginTop: '2px', letterSpacing: '0.05em' }}>HRS</span>
                  </div>
                  <span style={{ marginBottom: '12px' }}>:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.9375rem', border: '1px solid #fecaca' }}>
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.5625rem', color: '#991b1b', fontWeight: 700, marginTop: '2px', letterSpacing: '0.05em' }}>MIN</span>
                  </div>
                  <span style={{ marginBottom: '12px' }}>:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.9375rem', border: '1px solid #fecaca' }}>
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.5625rem', color: '#991b1b', fontWeight: 700, marginTop: '2px', letterSpacing: '0.05em' }}>SEC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Deals Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {specialOffers.map((deal) => (
                <div
                  key={deal.id}
                  style={{
                    backgroundColor: '#fafaf9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
                  onMouseOut={e => e.currentTarget.style.boxShadow = 'var(--shadow-subtle)'}
                >
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => openProductDetail(deal.id)}>
                    <img
                      src={deal.image}
                      alt={deal.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      {deal.discount}
                    </div>
                  </div>

                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textTransform: 'none' }}>
                        {deal.category}
                      </div>
                      <h3
                        onClick={() => openProductDetail(deal.id)}
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          color: '#111827',
                          margin: '4px 0 8px 0',
                          cursor: 'pointer',
                          lineHeight: 1.35,
                          minHeight: '42px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {deal.title}
                      </h3>

                      {/* Pricing */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>
                          {formatPrice(deal.salePrice)}
                        </span>
                        <del aria-label={`Original price ${formatPrice(deal.originalPrice)}`} style={{ fontSize: '0.875rem', color: '#52525b', textDecoration: 'line-through' }}>
                          {formatPrice(deal.originalPrice)}
                        </del>
                      </div>

                      {/* Stock Urgency Bar */}
                      <div style={{ margin: '16px 0 18px 0', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600 }}>Stock: {deal.stockLeft} left</span>
                          <span style={{ color: '#dc2626', fontWeight: 700, letterSpacing: '0.01em' }}>Almost gone</span>
                        </div>
                        <div style={{ height: '7px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Math.max(15, (deal.stockLeft / 10) * 100))}%`, height: '100%', backgroundColor: '#dc2626', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const matchedProduct = products.find(p => p.id === deal.id);
                        if (matchedProduct) {
                          addToCart(matchedProduct, 1);
                        } else {
                          openProductDetail(deal.id);
                        }
                      }}
                      className="btn-primary"
                      style={{
                        marginTop: 'auto',
                        padding: '10px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        width: '100%',
                        textAlign: 'center'
                      }}
                    >
                      Claim Special Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. PROMOTIONAL BANNER SECTION                             */}
        {/* ========================================================= */}
        <section style={{ padding: '60px 0', backgroundColor: '#faf9f6', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            <div style={{
              backgroundColor: '#0f1115',
              borderRadius: '24px',
              color: '#ffffff',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              boxShadow: 'var(--shadow-luxury)'
            }}>
              {/* Left Column: Promotion Content */}
              <div style={{ padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  width: 'fit-content',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#f59e0b'
                }}>
                  ★ SPECIAL PROMOTION
                </div>

                <h2 style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}>
                  Mid-Season Upgrade Event.<br />Take An Extra 20% Off.
                </h2>

                <p style={{ fontSize: '0.9375rem', color: '#9ca3af', lineHeight: 1.6, maxWidth: '440px' }}>
                  Upgrade your daily wardrobe and technical carry with our handcrafted essentials. Use our limited promo coupon code during checkout.
                </p>

                {/* Promo Code Copy Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div
                    onClick={handleCopyCoupon}
                    title="Click to copy coupon"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      border: '1px dashed #f59e0b',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#d1d5db' }}>CODE:</span>
                    <strong style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#f59e0b' }}>
                      URBAN20
                    </strong>
                    <span style={{ fontSize: '0.6875rem', color: copiedCoupon ? '#10b981' : '#9ca3af' }}>
                      {copiedCoupon ? '✓ Copied' : 'Click to copy'}
                    </span>
                  </div>

                  <button
                    onClick={() => openShopCatalog('ALL')}
                    className="btn-primary"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#0f1115',
                      padding: '12px 24px',
                      fontSize: '0.8125rem',
                      fontWeight: 700
                    }}
                  >
                    Shop the Promotion
                  </button>
                </div>

                {/* Key Guarantees */}
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', color: '#9ca3af', paddingTop: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckIcon size={14} style={{ color: '#10b981' }} />
                    <span>Free Shipping on $50+</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckIcon size={14} style={{ color: '#10b981' }} />
                    <span>30-Day Money Back</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckIcon size={14} style={{ color: '#10b981' }} />
                    <span>Official 2-Year Warranty</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Imagery */}
              <div style={{ minHeight: '340px', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop"
                  alt="UrbanCart Lifestyle Promotion"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. CUSTOMER REVIEWS SECTION                               */}
        {/* ========================================================= */}
        <section style={{ padding: '72px 0', backgroundColor: '#ffffff', borderBottom: '1px solid rgba(0, 0, 0, 0.07)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px auto' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
                VERIFIED EXPERIENCES
              </div>
              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#111827',
                marginTop: '4px'
              }}>
                Customer Reviews
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '6px' }}>
                See why over 18,000 customers rate UrbanCart 4.9 out of 5 stars.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {[
                {
                  quote: "The Mono Low-Top leather sneakers are without a doubt the most comfortable shoes I own. The leather is butter-soft with zero break-in pain.",
                  author: "Julian Mercer",
                  role: "Architect, San Francisco",
                  verified: true,
                  product: "Mono Low-Top Sneaker",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                },
                {
                  quote: "Incredible battery life and tactile feedback on the Chronos Minimal smart watch. It looks sleek with a suit and handles heavy workout tracking seamlessly.",
                  author: "Elena Rostova",
                  role: "Creative Director, New York",
                  verified: true,
                  product: "Chronos Minimal Watch",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                },
                {
                  quote: "The Technical Daypack Pro fits my 16-inch laptop and camera gear effortlessly. Weatherproof zippers keep everything bone dry in heavy rain.",
                  author: "Marcus Chen",
                  role: "Software Engineer, Seattle",
                  verified: true,
                  product: "Technical Daypack Pro",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
                },
                {
                  quote: "Outstanding active noise cancellation and soundstage on the Horizon ANC headphones. Fast delivery and premium unboxing experience.",
                  author: "Sarah Jenkins",
                  role: "Audio Producer, Austin",
                  verified: true,
                  product: "Horizon ANC Headphones",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                }
              ].map((rev, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#fafaf9',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div>
                    {/* Stars */}
                    <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '12px' }}>
                      {[...Array(5)].map((_, idx) => (
                        <StarIcon key={idx} size={14} filled />
                      ))}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, fontStyle: 'italic' }}>
                      "{rev.quote}"
                    </p>

                    <div style={{ fontSize: '0.6875rem', color: '#4b5563', marginTop: '10px' }}>
                      Purchased: <strong style={{ color: '#111827' }}>{rev.product}</strong>
                    </div>
                  </div>

                  {/* Author Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0efe9', paddingTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#111827' }}>
                          {rev.author}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                          {rev.role}
                        </div>
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      ✓ Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. NEWSLETTER SUBSCRIPTION SECTION                        */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* 9. NEWSLETTER SUBSCRIPTION SECTION                        */}
        {/* ========================================================= */}
        <section style={{ padding: '80px 0 60px 0', backgroundColor: '#fbfbfa' }}>
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, #181b22 0%, #0c0e12 100%)',
              borderRadius: '24px',
              padding: '56px 48px',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 60px -12px rgba(15, 17, 21, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle background ambient glow */}
              <div style={{
                position: 'absolute',
                top: '-40%',
                right: '-10%',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '36px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ maxWidth: '480px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: '#fbbf24',
                    marginBottom: '8px'
                  }}>
                    <span aria-hidden="true">✦</span>
                    <span>Join the Atelier Society</span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: 400,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    margin: '0 0 10px 0',
                    letterSpacing: '-0.02em'
                  }}>
                    Subscribe to Our Newsletter
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#d4d4d8',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    Receive 10% off your inaugural order, private archive drop notifications, and weekly editorial curation delivered to your inbox.
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '20px',
                    fontSize: '0.75rem',
                    color: '#a1a1aa'
                  }}>
                    <span><span aria-hidden="true">✓ </span>10% First Order</span>
                    <span aria-hidden="true">•</span>
                    <span><span aria-hidden="true">✓ </span>Private Drops</span>
                    <span aria-hidden="true">•</span>
                    <span><span aria-hidden="true">✓ </span>No Spam Promise</span>
                  </div>
                </div>

                <form onSubmit={handleNewsletter} style={{
                  display: 'flex',
                  width: '100%',
                  maxWidth: '420px',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <label htmlFor="homepage-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="homepage-newsletter-email"
                      type="email"
                      aria-label="Enter your email address for newsletter subscription"
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '10px',
                        padding: '13px 18px',
                        fontSize: '0.875rem',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = '#ffffff';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                      }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ffffff',
                      color: '#0f1115',
                      border: 'none',
                      padding: '13px 28px',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
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
                    <span>Subscribe</span>
                    <ArrowRightIcon size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. FOOTER */}
      <Footer hideNewsletter={true} />
    </div>
  );
};
