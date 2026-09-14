import React from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  ChevronRightIcon
} from '../components/Icons';

import { useAppSelector, selectAppliedCoupon, selectDiscountAmount } from '../store';
import { CouponInput } from '../components/common/CouponInput';

/**
 * CartPage Component
 * Complete shopping cart satisfying all requirements:
 * - Cart item list (thumbnails, titles, variant details, pricing)
 * - Product image (clickable to view product)
 * - Product name (clickable to view product)
 * - Selected size / color tags
 * - Price & line total
 * - Quantity controls (increment / decrement stepper)
 * - Remove item action
 * - Save for later (moves item to dedicated Saved for Later tray with Move to Cart)
 * - Cart subtotal
 * - Shipping charges (free over $50 with real-time progress bar)
 * - Discount (percentage & dollar savings from coupon)
 * - Estimated sales tax
 * - Grand total
 * - Coupon input with quick-apply presets
 * - Apply coupon button
 * - Continue Shopping button
 * - Proceed to Checkout button
 */
export const CartPage = () => {
  const {
    currentUser,
    openAuthModal,
    cart,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    savedForLater,
    saveForLater,
    moveToCart,
    removeFromSaved,
    startCheckout,
    openShopCatalog,
    openProductDetail,
    formatPrice
  } = useStore();

  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const discountAmount = useAppSelector(selectDiscountAmount) || 0;

  /* Patron authentication gate */
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNoticeBar />
        <StorefrontNav />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
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
              backgroundColor: '#f4f4f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#18181b'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Sign In to View Shopping Bag
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Your shopping bag, reserved quantities, and promotions are linked to your patron account. Sign in to view your bag or continue checkout.
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

  // 2. Financial calculations
  const isFreeShippingCoupon = appliedCoupon?.type === 'free_shipping';
  const freeShippingThreshold = 50.00;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 || isFreeShippingCoupon;
  const shippingCharge = isFreeShipping ? 0 : 10.00;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const taxableSubtotal = Math.max(0, cartSubtotal - discountAmount);

  // Estimated Tax: 8% of taxable subtotal
  const estimatedTax = taxableSubtotal > 0 ? taxableSubtotal * 0.08 : 0;

  // Grand total
  const grandTotal = Math.max(0, taxableSubtotal + shippingCharge + estimatedTax);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '36px 0 80px 0' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            <span style={{ cursor: 'pointer' }} onClick={() => openShopCatalog('ALL')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ cursor: 'pointer' }} onClick={() => openShopCatalog('ALL')}>Shop</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Shopping Cart</span>
          </nav>

          {/* Cart Header */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
                URBANCART CHECKOUT BAG
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginTop: '4px', margin: 0 }}>
                Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => openShopCatalog('ALL')}
                style={{
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>← Continue Shopping</span>
              </button>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear Bag
                </button>
              )}
            </div>
          </div>

          {/* Empty Cart State */}
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              backgroundColor: '#fafaf9',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              maxWidth: '560px',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛍️</div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                Your shopping cart is empty
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
                Discover our curated footwear, smart watches, backpacks, and everyday essentials.
              </p>
              <Button variant="primary" size="md" onClick={() => openShopCatalog('ALL')}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            /* Active 2-Column Cart Layout */
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px', alignItems: 'start' }} className="checkout-layout-grid">
              {/* ======================================================= */}
              {/* LEFT COLUMN: CART ITEMS & SAVED FOR LATER               */}
              {/* ======================================================= */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Free Shipping Progress Indicator */}
                <div style={{
                  backgroundColor: '#fafaf9',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px 20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: '#111827', fontWeight: 700 }}>
                    <TruckIcon size={18} style={{ color: isFreeShipping ? '#059669' : '#111827' }} />
                    <span>
                      {isFreeShipping
                        ? '🎉 You have unlocked Free Express Shipping!'
                        : `Add ${formatPrice(remainingForFreeShipping)} more to your bag for FREE Express Delivery!`}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '9999px',
                    marginTop: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
                      height: '100%',
                      backgroundColor: isFreeShipping ? '#10b981' : '#0f1115',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Cart Item List */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
                  {cart.map((item, idx) => (
                    <div
                      key={item.cartId || `${item.productId}-${idx}`}
                      style={{
                        padding: '24px',
                        display: 'flex',
                        gap: '20px',
                        borderBottom: idx === cart.length - 1 ? 'none' : '1px solid #f3f4f6',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {/* Product Image */}
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300'}
                        alt={item.title}
                        onClick={() => openProductDetail(item.productId)}
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          cursor: 'pointer',
                          backgroundColor: '#f6f5f2'
                        }}
                      />

                      {/* Item Details */}
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h3
                                onClick={() => openProductDetail(item.productId)}
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: 800,
                                  color: '#111827',
                                  cursor: 'pointer',
                                  margin: 0,
                                  lineHeight: 1.3
                                }}
                              >
                                {item.title}
                              </h3>

                              {/* Selected Size / Color */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  backgroundColor: '#f3f4f6',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  color: '#374151'
                                }}>
                                  Color: <strong>{item.color || 'Standard'}</strong>
                                </span>
                                <span style={{
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  backgroundColor: '#f3f4f6',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  color: '#374151'
                                }}>
                                  Size: <strong>{item.size || 'Default'}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Line Total Price */}
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                                {formatPrice(item.price * item.quantity)}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {formatPrice(item.price)} each
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Controls Row: Quantity Stepper, Save For Later, Remove */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '16px',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          {/* Quantity Stepper */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff'
                          }}>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.cartId, -1)}
                              style={{ padding: '6px 10px', color: '#4b5563', cursor: 'pointer', border: 'none', background: 'transparent' }}
                              title="Decrease quantity"
                            >
                              <MinusIcon size={12} />
                            </button>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.cartId, 1)}
                              style={{ padding: '6px 10px', color: '#4b5563', cursor: 'pointer', border: 'none', background: 'transparent' }}
                              title="Increase quantity"
                            >
                              <PlusIcon size={12} />
                            </button>
                          </div>

                          {/* Action links: Save for Later & Remove */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Save For Later Button */}
                            <button
                              type="button"
                              onClick={() => saveForLater(item)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#2563eb',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                              }}
                            >
                              Save for later
                            </button>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.cartId)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#dc2626',
                                fontWeight: 600,
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <TrashIcon size={13} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ======================================================= */}
                {/* SAVED FOR LATER TRAY                                    */}
                {/* ======================================================= */}
                {savedForLater && savedForLater.length > 0 && (
                  <div style={{ marginTop: '16px', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', backgroundColor: '#fafaf9' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: '0 0 16px 0' }}>
                      Saved for Later ({savedForLater.length} items)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {savedForLater.map((saved) => (
                        <div
                          key={saved.savedId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#ffffff',
                            padding: '16px',
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            gap: '16px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={saved.image}
                              alt={saved.title}
                              style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>
                                {saved.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                                {saved.color} • {saved.size} • <strong>{formatPrice(saved.price)}</strong>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => moveToCart(saved)}
                              className="btn-primary"
                              style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                            >
                              Move to Cart
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromSaved(saved.savedId)}
                              style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================= */}
              {/* RIGHT COLUMN: ORDER SUMMARY & TOTALS                   */}
              {/* ======================================================= */}
              <div style={{
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: 'var(--shadow-subtle)',
                position: 'sticky',
                top: '90px'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 20px 0' }}>
                  Order Summary
                </h2>

                {/* Itemized Line Costs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                  {/* Cart Subtotal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                    <span>Cart Subtotal</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(cartSubtotal)}</span>
                  </div>

                  {/* Discount */}
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Promo ({appliedCoupon.code})</span>
                        <span style={{ fontSize: '0.6875rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                          {appliedCoupon.type === 'percentage' ? `-${appliedCoupon.discountValue}%` : appliedCoupon.type === 'free_shipping' ? 'Free Shipping' : `-$${appliedCoupon.discountValue}`}
                        </span>
                      </div>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Shipping Charges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                    <span>Shipping Charges</span>
                    <span style={{ fontWeight: 700, color: isFreeShipping ? '#059669' : '#111827' }}>
                      {isFreeShipping ? 'FREE' : formatPrice(shippingCharge)}
                    </span>
                  </div>

                  {/* Estimated Tax */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                    <span>Estimated Tax (8%)</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(estimatedTax)}</span>
                  </div>
                </div>

                {/* Coupon Engine Component */}
                <div style={{ margin: '20px 0' }}>
                  <CouponInput />
                </div>

                {/* Grand Total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  margin: '20px 0',
                  paddingTop: '16px',
                  borderTop: '2px solid #e5e7eb'
                }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                    Grand Total
                  </span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>
                    {formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Proceed to Checkout Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={startCheckout}
                  icon={ArrowRightIcon}
                  style={{ padding: '16px', fontSize: '0.9375rem', fontWeight: 800 }}
                >
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping Secondary Action */}
                <button
                  type="button"
                  onClick={() => openShopCatalog('ALL')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    marginTop: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Continue Shopping
                </button>

                {/* Security Guarantee */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.6875rem', color: '#059669', marginTop: '18px' }}>
                  <ShieldCheckIcon size={14} />
                  <span>256-Bit SSL Encrypted Secure Checkout</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
