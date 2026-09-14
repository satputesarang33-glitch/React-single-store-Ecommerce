import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAppSelector, selectAppliedCoupon, selectDiscountAmount } from '../store';
import { CouponInput } from './common/CouponInput';
import { CloseIcon, TrashIcon, PlusIcon, MinusIcon, BagIcon, CheckCircleIcon } from './Icons';

// Import dedicated component stylesheet
import './CartDrawer.css';

/**
 * ============================================================================
 * CartDrawer Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Slide-out drawer allowing patrons to view their shopping bag,
 *   adjust quantities, apply discount coupons, track free shipping status,
 *   and smoothly transition to checkout.
 * 
 * Store State:
 *   - isCartOpen: Controls drawer visibility
 *   - cart: Array of active cart line items
 *   - cartSubtotal: Sum of item prices * quantities
 *   - removeFromCart: Drops item from bag
 *   - updateCartQuantity: Increments / decrements line item count
 *   - startCheckout: Navigates to checkout process
 */
export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    startCheckout,
    openCartPage,
    formatPrice
  } = useStore();

  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const reduxDiscountAmount = useAppSelector(selectDiscountAmount);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isCartOpen) return null;

  // Step 1: Free Shipping Threshold calculation
  const freeShippingThreshold = 250.00;
  const isFreeShippingCoupon = appliedCoupon?.type === 'free_shipping';
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  // Step 2: Discount & Total calculation
  const discountAmount = reduxDiscountAmount || 0;
  const shippingFee = (cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 || isFreeShippingCoupon) ? 0 : 15.00;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <div className="cart-drawer-overlay">
      {/* ── Slide-Out Drawer Surface ── */}
      <div className="cart-drawer-surface">
        
        {/* ── Drawer Header ── */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <BagIcon size={18} />
            <h2 className="cart-drawer-title">
              Your Atelier Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutSuccess(false);
            }}
            className="cart-drawer-close-btn"
            title="Close Shopping Bag"
            aria-label="Close Shopping Bag"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* ── Free Shipping Progress Bar ── */}
        <div className="cart-shipping-banner">
          <div className="cart-shipping-text">
            <span>
              {remainingForFreeShipping > 0
                ? `Add ${formatPrice(remainingForFreeShipping)} more for Complimentary Express Shipping`
                : '✦ You unlocked Complimentary Worldwide Express Shipping!'}
            </span>
          </div>
          <div className="cart-shipping-track">
            <div 
              className="cart-shipping-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: progressPercent >= 100 ? '#10b981' : '#0f1115'
              }} 
            />
          </div>
        </div>

        {/* ── Content Area ── */}
        {checkoutSuccess ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            margin: 'auto 0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleIcon size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Order Dispatched & Settled!</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', maxWidth: '320px', lineHeight: 1.5 }}>
              Thank you for acquiring curated editorial goods. Your transaction has synced live with the UrbanCart OPS Ledger.
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setCheckoutSuccess(false);
              }}
              className="btn-primary"
              style={{ marginTop: '12px', width: '220px' }}
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          <>
            {/* ── Items List ── */}
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <BagIcon size={40} />
                  <p style={{ fontSize: '0.875rem' }}>Your bag is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="cart-item-row">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <h4 className="cart-item-title">
                        {item.title}
                      </h4>

                      <div className="cart-item-variants">
                        Color: {item.color} | Size: {item.size}
                      </div>

                      <div className="cart-item-bottom">
                        {/* Quantity Stepper */}
                        <div className="cart-stepper">
                          <button
                            onClick={() => updateCartQuantity(item.cartId, -1)}
                            className="cart-stepper-btn"
                            title="Decrease quantity"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span className="cart-stepper-value">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartId, 1)}
                            className="cart-stepper-btn"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>

                        <span className="cart-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="cart-item-remove-btn"
                      title="Remove item"
                      aria-label="Remove item from bag"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ── Bottom Checkout Section ── */}
            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                {/* Promo Code input component */}
                <CouponInput compact={true} />

                {/* Subtotal & Calculations */}
                <div className="cart-summary-group">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>${cartSubtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && discountAmount > 0 && (
                    <div className="cart-summary-row discount">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="cart-summary-row">
                    <span>Express Worldwide Shipping</span>
                    <span>{shippingFee === 0 ? <strong style={{ color: '#059669' }}>FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
                  </div>

                  <div className="cart-summary-total">
                    <span>Estimated Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={startCheckout}
                  className="btn-primary cart-checkout-btn"
                >
                  PROCEED TO CHECKOUT • {formatPrice(finalTotal)}
                </button>

                {/* View Full Shopping Bag CTA */}
                <button
                  onClick={openCartPage}
                  className="cart-view-bag-btn"
                >
                  VIEW FULL SHOPPING BAG
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
