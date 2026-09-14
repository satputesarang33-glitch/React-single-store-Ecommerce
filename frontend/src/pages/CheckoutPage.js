import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAppSelector, selectAppliedCoupon, selectDiscountAmount } from '../store';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { CardPaymentForm } from '../components/checkout/CardPaymentForm';
import { DigitalWallets } from '../components/checkout/DigitalWallets';
import { UpiPayment } from '../components/checkout/UpiPayment';
import { ThreeDSecureModal } from '../components/checkout/ThreeDSecureModal';
import { CouponInput } from '../components/common/CouponInput';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  DownloadIcon,
  ArrowRightIcon
} from '../components/Icons';
import { orderService } from '../services/api/orderService';

/**
 * CheckoutPage Component
 * Professional checkout UI with:
 * - Customer Information: Full name, Email, Phone number
 * - Shipping Address: Address, City, State, Country, Pincode
 * - Delivery Method: Standard Delivery vs Express Delivery
 * - Payment Method UI: Cash on Delivery, Credit / Debit Card, UPI, Net Banking
 * - Order Summary: Products, Quantities, Subtotal, Shipping, Tax, Discount, Total
 * - Place Order button
 */
export const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    clearCart,
    setOrders,
    orders,
    setActiveView,
    openShopCatalog,
    openOrderDetails,
    formatPrice,
    showToast,
    currentUser,
    openAuthModal
  } = useStore();

  // 1. Customer Information
  const [customer, setCustomer] = useState({
    fullName: 'Julian Mercer',
    email: 'j.mercer@urbancart.com',
    phone: '+1 (555) 234-5678'
  });

  // 2. Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    address: '742 Evergreen Terrace, Apt 4B',
    city: 'Brooklyn',
    state: 'New York',
    country: 'United States',
    pincode: '11201'
  });

  // 3. Delivery Method ('standard' | 'express')
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  // 4. Payment Method ('card' | 'upi' | 'netbanking' | 'cod')
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card details
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: 'JULIAN MERCER',
    cardNumber: '4532 •••• •••• 8821',
    expiryDate: '09/28',
    cvv: '742'
  });

  // UPI details
  const [upiId, setUpiId] = useState('julian@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Net Banking details
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Redux Coupon state
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const discountAmount = useAppSelector(selectDiscountAmount) || 0;

  // 3D Secure Verification state
  const [showThreeDSecure, setShowThreeDSecure] = useState(false);

  // Form validation errors state
  const [formErrors, setFormErrors] = useState({});

  // Processing & completion state
  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Track whether initial patron prefill has completed
  const hasPrefilledRef = React.useRef(false);

  // Pre-fill from authenticated user
  useEffect(() => {
    if (currentUser && !hasPrefilledRef.current) {
      hasPrefilledRef.current = true;
      setCustomer(prev => ({
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone
      }));

      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const addr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
        setShippingAddress(prev => ({
          address: addr.street || prev.address,
          city: addr.city || prev.city,
          state: addr.state || prev.state,
          country: addr.country || prev.country,
          pincode: addr.postalCode || prev.pincode
        }));
      }
    }
  }, [currentUser]);

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
              <ShieldCheckIcon size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Sign In to Proceed with Checkout
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '28px' }}>
              For transaction security and order protection, checkout requires an authenticated patron session.
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
              Sign In to Continue Checkout →
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Demo autofill helper
  const handleQuickFillDemo = () => {
    setCustomer({
      fullName: 'Alex Reynolds',
      email: 'alex.reynolds@example.com',
      phone: '+1 (415) 889-2041'
    });
    setShippingAddress({
      address: '450 Mission Street, Suite 1200',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      pincode: '94105'
    });
    showToast('Demo customer and shipping address filled!', 'info');
  };

  // Financial Calculations
  const isFreeShippingCoupon = appliedCoupon?.type === 'free_shipping';
  const shippingCost = deliveryMethod === 'express'
    ? 15.00
    : ((cartSubtotal >= 50 || isFreeShippingCoupon) ? 0.00 : 5.00);

  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = discountedSubtotal > 0 ? discountedSubtotal * 0.08 : 0;
  const totalAmount = Math.max(0, discountedSubtotal + shippingCost + taxAmount);

  // Validation helper
  const validateForm = () => {
    const errors = {};
    if (!customer.fullName || !customer.fullName.trim()) {
      errors.fullName = 'This field is required. Full Name is required.';
    }
    if (!customer.email || !customer.email.trim()) {
      errors.email = 'This field is required. Email Address is required.';
    }
    if (!customer.phone || !customer.phone.trim()) {
      errors.phone = 'This field is required. Phone Number is required.';
    }
    if (!shippingAddress.address || !shippingAddress.address.trim()) {
      errors.address = 'This field is required. Street Address is required.';
    }
    if (!shippingAddress.city || !shippingAddress.city.trim()) {
      errors.city = 'This field is required. City is required.';
    }
    if (!shippingAddress.state || !shippingAddress.state.trim()) {
      errors.state = 'This field is required. State is required.';
    }
    if (!shippingAddress.pincode || !shippingAddress.pincode.trim()) {
      errors.pincode = 'This field is required. Pincode is required.';
    }
    return errors;
  };

  // Core Order Placement Action
  const completeOrderPlacement = (customPayment) => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowThreeDSecure(false);
      setIsProcessing(false);
      showToast('This field is required. Please complete all required fields.', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderRef = `#UC-${Math.floor(10000 + Math.random() * 90000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      const trackingNo = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;

      let formattedPaymentMethod = '';
      let paymentStatus = 'PAID';

      if (customPayment?.method) {
        formattedPaymentMethod = customPayment.details || customPayment.method;
      } else if (paymentMethod === 'cod') {
        formattedPaymentMethod = 'Cash on Delivery (COD)';
        paymentStatus = 'PENDING (COD)';
      } else if (paymentMethod === 'card') {
        const last4 = (cardDetails.cardNumber || '8821').replace(/\s/g, '').slice(-4);
        formattedPaymentMethod = `Credit Card (•••• ${last4 || '8821'}) - 3D Secure Verified`;
      } else if (paymentMethod === 'upi') {
        formattedPaymentMethod = `UPI (${upiId || selectedUpiApp})`;
      } else {
        formattedPaymentMethod = `Net Banking (${selectedBank})`;
      }

      const newOrder = {
        id: 'ord-' + Date.now(),
        reference: orderRef,
        trackingNumber: trackingNo,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: 'Just now',
        customer: { ...customer },
        patron: {
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          city: `${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country}`
        },
        shippingAddress: { ...shippingAddress },
        deliveryMethod: deliveryMethod === 'express' ? 'Express Delivery (1-2 Days)' : 'Standard Delivery (3-5 Days)',
        courier: deliveryMethod === 'express' ? 'FedEx Priority Air' : 'DHL Ground Logistics',
        paymentMethod: formattedPaymentMethod,
        paymentStatus: paymentStatus,
        fulfillmentState: 'CONFIRMED & PROCESSING',
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax: taxAmount,
        total: totalAmount,
        itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
        items: [...cart]
      };

      setOrders([newOrder, ...(orders || [])]);
      setPlacedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      try {
        orderService.createOrder(newOrder);
      } catch (err) {
        console.warn('Backend sync note (order placement):', err);
      }
      showToast(`Order ${orderRef} placed successfully!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  // Trigger place order
  const handlePlaceOrder = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowThreeDSecure(false);
      setIsProcessing(false);
      showToast('This field is required. Please complete all required fields.', 'error');
      return;
    }
    setFormErrors({});

    if (cart.length === 0 && !placedOrder) {
      showToast('Your shopping cart is empty.', 'error');
      return;
    }

    // If card payment, launch simulated 3D Secure bank verification
    if (paymentMethod === 'card') {
      setShowThreeDSecure(true);
      return;
    }

    completeOrderPlacement();
  };

  // Handle 1-click Express Wallets (Google Pay / Apple Pay)
  const handleWalletSuccess = (walletData) => {
    if (!customer.fullName || !customer.email) {
      handleQuickFillDemo();
    }
    completeOrderPlacement(walletData);
  };

  const handleDownloadInvoice = () => {
    showToast('Generating official tax receipt PDF...', 'info');
    setTimeout(() => {
      showToast(`Tax invoice for ${placedOrder?.reference || 'order'} downloaded`, 'success');
    }, 800);
  };

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
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('cart')}>Cart</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Checkout</span>
          </nav>

          {/* SUCCESS RECEIPT VIEW (WHEN ORDER IS PLACED) */}
          {placedOrder ? (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)',
                marginBottom: '32px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto'
                }}>
                  <CheckCircleIcon size={36} />
                </div>

                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#059669', textTransform: 'uppercase' }}>
                  ORDER PLACED SUCCESSFULLY
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '8px 0 12px 0' }}>
                  Thank you for shopping with UrbanCart!
                </h1>

                <p style={{ fontSize: '0.875rem', color: '#4b5563', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                  Your order reference is <strong style={{ color: '#111827' }}>{placedOrder.reference}</strong>.
                  A confirmation email with real-time tracking details has been sent to <strong>{placedOrder.customer.email}</strong>.
                </p>

                {/* Details Summary Pill Strip */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'left',
                  marginBottom: '28px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Tracking ID</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{placedOrder.trackingNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Courier</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{placedOrder.courier}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Payment Method</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{placedOrder.paymentMethod}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Amount Paid</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>{formatPrice(placedOrder.total)}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => openOrderDetails(placedOrder)}
                  >
                    View Order Details &amp; Live Tracking
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleDownloadInvoice}
                    icon={DownloadIcon}
                  >
                    Download Invoice
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => openShopCatalog('ALL')}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* STANDARD CHECKOUT FORM (CUSTOMER, ADDRESS, DELIVERY, PAYMENT, SUMMARY) */
            <div>
              {/* Header Title with Quick Fill Helper */}
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
                    SECURE ENCRYPTED CHECKOUT
                  </div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>
                    Finalize Your Order
                  </h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#2563eb',
                      backgroundColor: '#eff6ff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #bfdbfe',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Quick Fill Demo Details
                  </button>
                </div>
              </div>

              {/* Main 2-Column Layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr',
                gap: '48px',
                alignItems: 'start'
              }} className="checkout-layout-grid">

                {/* LEFT COLUMN: Customer info, Shipping address, Delivery method, Payment UI */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                  {/* 1. CUSTOMER INFORMATION */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        1
                      </span>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Customer Information
                      </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                      {/* Full Name */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Full Name (required) *
                        </label>
                        <input
                          type="text"
                          required
                          aria-invalid={!!formErrors.fullName}
                          placeholder="e.g. Julian Mercer"
                          value={customer.fullName}
                          onChange={(e) => {
                            setCustomer({ ...customer, fullName: e.target.value });
                            if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.fullName ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.fullName && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.fullName}
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Email Address (required) *
                        </label>
                        <input
                          type="email"
                          required
                          aria-invalid={!!formErrors.email}
                          placeholder="e.g. name@example.com"
                          value={customer.email}
                          onChange={(e) => {
                            setCustomer({ ...customer, email: e.target.value });
                            if (formErrors.email) setFormErrors(prev => ({ ...prev, email: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.email && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.email}
                          </span>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Phone Number (required) *
                        </label>
                        <input
                          type="tel"
                          required
                          aria-invalid={!!formErrors.phone}
                          placeholder="e.g. +1 (555) 019-2834"
                          value={customer.phone}
                          onChange={(e) => {
                            setCustomer({ ...customer, phone: e.target.value });
                            if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.phone ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.phone && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. SHIPPING ADDRESS */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        2
                      </span>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Shipping Address
                      </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      {/* Address */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Street Address / House / Suite (required) *
                        </label>
                        <input
                          type="text"
                          required
                          aria-invalid={!!formErrors.address}
                          placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                          value={shippingAddress.address}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, address: e.target.value });
                            if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.address ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.address && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.address}
                          </span>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          City (required) *
                        </label>
                        <input
                          type="text"
                          required
                          aria-invalid={!!formErrors.city}
                          placeholder="e.g. Brooklyn"
                          value={shippingAddress.city}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, city: e.target.value });
                            if (formErrors.city) setFormErrors(prev => ({ ...prev, city: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.city ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.city && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.city}
                          </span>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          State / Province (required) *
                        </label>
                        <input
                          type="text"
                          required
                          aria-invalid={!!formErrors.state}
                          placeholder="e.g. New York"
                          value={shippingAddress.state}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, state: e.target.value });
                            if (formErrors.state) setFormErrors(prev => ({ ...prev, state: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.state ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.state && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.state}
                          </span>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Country *
                        </label>
                        <select
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="United States">United States</option>
                          <option value="India">India</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                      </div>

                      {/* Pincode */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                          Pincode / Postal Code (required) *
                        </label>
                        <input
                          type="text"
                          required
                          aria-invalid={!!formErrors.pincode}
                          placeholder="e.g. 11201 or 560001"
                          value={shippingAddress.pincode}
                          onChange={(e) => {
                            setShippingAddress({ ...shippingAddress, pincode: e.target.value });
                            if (formErrors.pincode) setFormErrors(prev => ({ ...prev, pincode: null }));
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            borderRadius: '8px',
                            border: formErrors.pincode ? '1px solid #dc2626' : '1px solid #d1d5db',
                            fontSize: '0.8125rem',
                            outline: 'none',
                            backgroundColor: '#fafaf9'
                          }}
                        />
                        {formErrors.pincode && (
                          <span className="field-error" style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {formErrors.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. DELIVERY METHOD */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        3
                      </span>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Delivery Method
                      </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                      {/* Standard Delivery Option */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '10px',
                        border: deliveryMethod === 'standard' ? '2px solid #0f1115' : '1px solid #d1d5db',
                        backgroundColor: deliveryMethod === 'standard' ? '#fafaf9' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === 'standard'}
                          onChange={() => setDeliveryMethod('standard')}
                          style={{ marginTop: '4px' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                              Standard Delivery
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: cartSubtotal >= 50 ? '#059669' : '#111827' }}>
                              {cartSubtotal >= 50 ? 'FREE' : formatPrice(5.00)}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                            Delivered in 3–5 business days via standard surface logistics.
                          </div>
                        </div>
                      </label>

                      {/* Express Delivery Option */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '10px',
                        border: deliveryMethod === 'express' ? '2px solid #0f1115' : '1px solid #d1d5db',
                        backgroundColor: deliveryMethod === 'express' ? '#fafaf9' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}>
                        <input
                          type="radio"
                          name="deliveryMethod"
                          checked={deliveryMethod === 'express'}
                          onChange={() => setDeliveryMethod('express')}
                          style={{ marginTop: '4px' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#111827' }}>
                              Express Delivery
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#111827' }}>
                              {formatPrice(15.00)}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                            Guaranteed delivery in 1–2 business days via FedEx Priority Air.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 4. PAYMENT METHOD UI */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <span style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        4
                      </span>
                      <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Payment Method
                      </h2>
                    </div>

                    {/* Digital Express Wallets */}
                    <div style={{ marginBottom: '24px' }}>
                      <DigitalWallets
                        totalAmount={totalAmount}
                        formatPrice={formatPrice}
                        onWalletSuccess={handleWalletSuccess}
                      />
                    </div>

                    {/* Divider */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      margin: '24px 0',
                      color: '#9ca3af',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                      <span>Or pay with standard methods</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                    </div>

                    {/* Payment Mode Segmented Selector */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '8px',
                      marginBottom: '24px'
                    }}>
                      {[
                        { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                        { id: 'upi', label: 'UPI / QR', icon: '⚡' },
                        { id: 'netbanking', label: 'Net Banking', icon: '🏛️' },
                        { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          style={{
                            padding: '12px 10px',
                            borderRadius: '10px',
                            border: paymentMethod === method.id ? '2px solid #0f1115' : '1px solid #d1d5db',
                            backgroundColor: paymentMethod === method.id ? '#0f1115' : '#ffffff',
                            color: paymentMethod === method.id ? '#ffffff' : '#374151',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                          <span>{method.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* SUB-SECTION 4A: CREDIT / DEBIT CARD */}
                    {paymentMethod === 'card' && (
                      <div style={{
                        backgroundColor: '#fafaf9',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '24px'
                      }}>
                        <CardPaymentForm
                          cardData={cardDetails}
                          onChange={setCardDetails}
                        />
                      </div>
                    )}

                    {/* SUB-SECTION 4B: UPI */}
                    {paymentMethod === 'upi' && (
                      <div style={{
                        backgroundColor: '#fafaf9',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '24px'
                      }}>
                        <UpiPayment
                          upiId={upiId}
                          onChangeUpiId={setUpiId}
                          selectedApp={selectedUpiApp}
                          onSelectApp={setSelectedUpiApp}
                          amount={totalAmount}
                          onUpiApproved={() => completeOrderPlacement({
                            method: 'UPI Instant Approval',
                            details: `UPI (${upiId || selectedUpiApp})`
                          })}
                        />
                      </div>
                    )}

                    {/* SUB-SECTION 4C: NET BANKING */}
                    {paymentMethod === 'netbanking' && (
                      <div style={{
                        backgroundColor: '#fafaf9',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                          Popular Banks
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                          {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(b => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => setSelectedBank(b)}
                              style={{
                                padding: '10px 8px',
                                borderRadius: '8px',
                                border: selectedBank === b ? '2px solid #0f1115' : '1px solid #d1d5db',
                                backgroundColor: selectedBank === b ? '#0f1115' : '#ffffff',
                                color: selectedBank === b ? '#ffffff' : '#374151',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {b}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                            Or Select Other Bank
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.8125rem', backgroundColor: '#ffffff', cursor: 'pointer' }}
                          >
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Bank">Kotak Mahindra Bank</option>
                            <option value="Chase Bank">Chase / JPMorgan</option>
                            <option value="Wells Fargo">Wells Fargo</option>
                            <option value="Bank of America">Bank of America</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* SUB-SECTION 4D: CASH ON DELIVERY */}
                    {paymentMethod === 'cod' && (
                      <div style={{
                        backgroundColor: '#fafaf9',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', fontWeight: 800, fontSize: '0.875rem' }}>
                          <span>💵 Cash on Delivery (COD) Selected</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6, margin: '8px 0 0 0' }}>
                          You can pay via cash or digital QR scan with the delivery courier when your package arrives at your doorstep. Please have the exact payment amount ready.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: ORDER SUMMARY (ITEMS, DISCOUNTS, TOTALS) */}
                <div style={{
                  backgroundColor: '#fafaf9',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-subtle)',
                  position: 'sticky',
                  top: '90px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Order Summary
                    </h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                      {cart.reduce((a, b) => a + b.quantity, 0)} Items
                    </span>
                  </div>

                  {/* Itemized Cart Products List */}
                  <div style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '16px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {cart.map((item, idx) => (
                      <div key={item.cartId || idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=150'}
                          alt={item.title}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                            Qty: <strong>{item.quantity}</strong> • {item.color || 'Standard'} • {item.size || 'Default'}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown: Subtotal, Shipping, Tax, Discount */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8125rem', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    {/* Subtotal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(cartSubtotal)}</span>
                    </div>

                    {/* Shipping */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                      <span>Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                      <span style={{ fontWeight: 700, color: shippingCost === 0 ? '#059669' : '#111827' }}>
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                    </div>

                    {/* Tax */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                      <span>Estimated Tax (8%)</span>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(taxAmount)}</span>
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
                  </div>

                  {/* Redux Coupon Component */}
                  <div style={{ margin: '16px 0' }}>
                    <CouponInput />
                  </div>

                  {/* Grand Total Amount */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    margin: '16px 0 24px 0'
                  }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                      Total Amount
                    </span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827' }}>
                      {formatPrice(totalAmount)}
                    </span>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    icon={isProcessing ? null : ArrowRightIcon}
                    style={{
                      padding: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      backgroundColor: isProcessing ? '#6b7280' : '#0f1115'
                    }}
                  >
                    {isProcessing ? 'Processing Order...' : `Place Order — ${formatPrice(totalAmount)}`}
                  </Button>

                  {/* Security Guarantee */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.6875rem',
                    color: '#059669',
                    marginTop: '16px'
                  }}>
                    <ShieldCheckIcon size={14} />
                    <span>256-Bit SSL Encrypted Checkout Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3D Secure Bank Verification Modal */}
      <ThreeDSecureModal
        isOpen={showThreeDSecure}
        amount={totalAmount}
        formatPrice={formatPrice}
        cardNumber={cardDetails.cardNumber}
        onSuccess={() => {
          setShowThreeDSecure(false);
          completeOrderPlacement();
        }}
        onCancel={() => setShowThreeDSecure(false)}
      />

      <Footer />
    </div>
  );
};
