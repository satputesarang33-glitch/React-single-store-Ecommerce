import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { OrderTrackerModal } from '../components/orders/OrderTrackerModal';
import { InvoiceModal } from '../components/orders/InvoiceModal';
import {
  ChevronRightIcon,
  DownloadIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  BagIcon
} from '../components/Icons';

/**
 * OrderDetailsPage Component
 * Comprehensive Order Details Page showing:
 * 1. Ordered products (Items with images, variants, quantities, and prices)
 * 2. Shipping address (Consignee recipient, street, city, country, phone)
 * 3. Payment method (Brand, cardholder, masked number, settlement status)
 * 4. Order timeline (Step-by-step milestone progression with dates and tracking)
 * 5. Total amount (Financial summary with subtotal, freight, duties, and grand total)
 */
export const OrderDetailsPage = () => {
  const {
    selectedOrder,
    orders = [],
    openOrdersPage,
    setActiveView,
    openProductDetail,
    formatPrice,
    addToCart,
    products = [],
    showToast
  } = useStore();

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const { id } = useParams();

  // Retrieve order by URL parameter or context selection, fallback to latest order
  const order = (id ? orders.find(o => o.id === id) : null) || selectedOrder || (orders && orders.length > 0 ? orders[0] : null);

  // Status badge variant helper
  const getStatusBadgeVariant = (state) => {
    switch (state) {
      case 'DELIVERED':
        return 'success';
      case 'COURIER DISPATCHED':
        return 'info';
      case 'PREPARING SHIPMENT':
      case 'CONFIRMED & PROCESSING':
        return 'warning';
      case 'HOLD ON GATE 2':
      case 'REVIEW REQUIRED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const handleDownloadInvoice = () => {
    setIsInvoiceOpen(true);
  };

  const handleReorder = () => {
    if (!order) return;
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        const prod = products.find(p => p.id === (item.productId || item.id)) || item;
        addToCart(prod, item.colorway || item.selectedColor || 'Default', item.size || item.selectedSize || 'Standard', item.quantity || 1);
      });
    } else {
      const sample = products[0] || { id: 'sample', title: order.cartSummary, price: order.total };
      addToCart(sample, 'Default', 'Standard', 1);
    }
    showToast(`Items from ${order.reference} reordered into your bag`, 'success');
  };

  if (!order) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <TopNoticeBar />
        <StorefrontNav />
        <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '440px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>No Order Selected</h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '12px 0 24px 0' }}>
              Please select an acquisition from your order history ledger to view its full dossier.
            </p>
            <Button variant="primary" onClick={openOrdersPage}>
              Return to My Orders
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Items fallback
  const itemsList = order.items && order.items.length > 0 ? order.items : [
    {
      id: 'item-default-1',
      productId: 'uc-fw-086',
      title: order.cartSummary || 'UrbanCart Curated Artifact',
      category: 'GOODS',
      colorway: 'Chalk White',
      size: 'Standard',
      price: order.total || 160.00,
      quantity: order.itemsCount || 1,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400'
    }
  ];

  // Address fallback
  const shippingAddress = order.shippingAddress || {
    recipient: order.patron?.name || 'Julian Mercer',
    fullName: order.patron?.name || 'Julian Mercer',
    street: 'Grev Turegatan 14, 3TR',
    address: 'Grev Turegatan 14, 3TR',
    city: 'Stockholm',
    state: 'Stockholm County',
    postalCode: '114 46',
    country: 'Sweden',
    phone: order.patron?.phone || '+46 8 123 4567'
  };

  // Payment method fallback
  const paymentMethod = typeof order.paymentMethod === 'object' && order.paymentMethod !== null
    ? order.paymentMethod
    : {
        brand: 'Visa',
        last4: '4242',
        holder: order.patron?.name ? order.patron.name.toUpperCase() : 'PATRON CARD',
        expiry: '08/28',
        label: typeof order.paymentMethod === 'string' ? order.paymentMethod : 'Credit Card (Visa •••• 4242)'
      };

  // Timeline fallback
  const timelineMilestones = order.timeline && order.timeline.length > 0 ? order.timeline : [
    { step: 'Order Placed', date: order.date || order.timestamp || 'Today 14:22', completed: true, description: 'Order authorized and entered production ledger' },
    { step: 'Payment Confirmed', date: order.date || 'Today 14:25', completed: true, description: `Authorized via ${paymentMethod.brand || 'Card'}` },
    { step: 'Quality Inspected', date: 'Same day', completed: true, description: 'Artisan inspect & calibration certified' },
    { step: 'Courier Handover', date: 'Dispatched', completed: order.fulfillmentState === 'COURIER DISPATCHED' || order.fulfillmentState === 'DELIVERED', current: order.fulfillmentState === 'COURIER DISPATCHED', description: `In transit with ${order.courier || 'DHL Express'}` },
    { step: 'Delivered', date: order.fulfillmentState === 'DELIVERED' ? 'Delivered' : 'Estimated 2-3 days', completed: order.fulfillmentState === 'DELIVERED', current: order.fulfillmentState === 'DELIVERED', description: 'Personal delivery to consignee' }
  ];

  const subtotalAmount = order.subtotal || order.total;
  const shippingAmount = order.shipping !== undefined ? order.shipping : 0.00;
  const taxAmount = order.tax !== undefined ? order.tax : 0.00;

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '32px 0 88px 0' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '28px'
            }}
          >
            <button
              onClick={() => setActiveView('storefront')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Home
            </button>
            <ChevronRightIcon size={12} />
            <button
              onClick={openOrdersPage}
              data-testid="breadcrumb-orders-btn"
              style={{ background: 'none', border: 'none', padding: 0, color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              My Orders
            </button>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Order {order.reference || order.id}</span>
          </nav>

          {/* Page Top Action Bar with Back Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <button
              onClick={openOrdersPage}
              data-testid="back-to-orders-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                padding: '6px 0',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0f1115',
                cursor: 'pointer'
              }}
            >
              ← Back to My Orders
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTrackerOpen(true)}
                icon={TruckIcon}
                data-testid="track-live-package-btn"
              >
                Track Live Package
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
                icon={DownloadIcon}
                data-testid="download-pdf-invoice-btn"
              >
                Download PDF Invoice
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReorder}
                icon={BagIcon}
                data-testid="order-details-reorder-btn"
              >
                Reorder Items
              </Button>
            </div>
          </div>

          {/* Order Header Summary Banner */}
          <section
            aria-label="Order Header Summary"
            style={{
              backgroundColor: '#0f1115',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '32px 36px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 12px 32px rgba(15, 17, 21, 0.12)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#9ca3af', textTransform: 'uppercase' }}>
                ACQUISITION DOSSIER &amp; FULFILLMENT RECORD
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '8px 0 6px 0', flexWrap: 'wrap' }}>
                <h1
                  data-testid="order-details-id"
                  style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}
                >
                  {order.reference || order.id}
                </h1>
                <Badge variant={getStatusBadgeVariant(order.fulfillmentState)} hasDot data-testid="order-details-status-badge">
                  {order.fulfillmentState || 'PROCESSING'}
                </Badge>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                Placed on <strong>{order.date || order.timestamp}</strong> • Payment Method: <strong>{paymentMethod.label || paymentMethod.brand || 'Credit Card'}</strong> ({order.paymentStatus || 'CAPTURED'})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                TOTAL AMOUNT CAPTURED
              </div>
              <div
                data-testid="order-details-header-total"
                style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}
              >
                {formatPrice(order.total)}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. ORDER TIMELINE                                             */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section
            aria-labelledby="heading-order-timeline"
            data-testid="section-order-timeline"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e0',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <div>
                <h2 id="heading-order-timeline" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Order Timeline
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Live milestone verification and courier transit telemetry.
                </p>
              </div>

              {/* Waybill tracking pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e7eb',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                <TruckIcon size={14} className="text-gray-500" />
                <span style={{ color: '#6b7280' }}>Carrier: <strong>{order.courier || 'DHL Express'}</strong></span>
                <span style={{ color: '#d1d5db' }}>|</span>
                <span style={{ color: '#6b7280' }}>Waybill: <code style={{ fontWeight: 800, color: '#111827' }}>{order.trackingNumber || 'JD9182740192'}</code></span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText?.(order.trackingNumber || 'JD9182740192');
                    showToast('Tracking waybill copied to clipboard', 'info');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0f1115',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginLeft: '4px'
                  }}
                >
                  COPY
                </button>
                <span style={{ color: '#d1d5db' }}>|</span>
                <button
                  type="button"
                  onClick={() => setIsTrackerOpen(true)}
                  style={{
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📡 RADAR
                </button>
              </div>
            </div>

            {/* Stepper Timeline Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${timelineMilestones.length}, 1fr)`,
              gap: '12px',
              paddingTop: '8px'
            }}>
              {timelineMilestones.map((milestone, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Progress Bar Line */}
                  <div style={{
                    height: '5px',
                    borderRadius: '3px',
                    backgroundColor: milestone.completed ? '#0f1115' : '#e5e7eb',
                    position: 'relative'
                  }}>
                    {milestone.current && (
                      <div style={{
                        position: 'absolute',
                        right: '0',
                        top: '-4px',
                        width: '13px',
                        height: '13px',
                        borderRadius: '50%',
                        backgroundColor: '#0f1115',
                        border: '2px solid #ffffff',
                        boxShadow: '0 0 0 2px #0f1115'
                      }} />
                    )}
                  </div>

                  {/* Step Title & Timestamp */}
                  <div>
                    <div style={{
                      fontSize: '0.8125rem',
                      fontWeight: milestone.completed ? 800 : 500,
                      color: milestone.completed ? '#111827' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {milestone.completed && <span style={{ color: '#059669', fontSize: '0.75rem' }}>✓</span>}
                      {milestone.step}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '2px' }}>
                      {milestone.date}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px', lineHeight: 1.4 }}>
                      {milestone.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. ORDERED PRODUCTS                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section
            aria-labelledby="heading-ordered-products"
            data-testid="section-ordered-products"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e0',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 id="heading-ordered-products" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Ordered Products ({itemsList.length})
                </h2>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                  Itemized inventory manifest verified prior to courier dispatch.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {itemsList.map((item, index) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={item.id || index}
                    data-testid={`ordered-product-item-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      backgroundColor: '#fafaf9',
                      border: '1px solid #e5e7eb',
                      borderRadius: '14px',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200';
                        }}
                      />

                      <div>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {item.category || 'ATELIER COLLECTION'}
                        </div>
                        <h3
                          onClick={() => openProductDetail(item.productId || item.id)}
                          style={{
                            fontSize: '0.9375rem',
                            fontWeight: 800,
                            color: '#111827',
                            margin: '2px 0 6px 0',
                            cursor: 'pointer'
                          }}
                        >
                          {item.title}
                        </h3>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', gap: '12px' }}>
                          {item.colorway && <span>Finish: <strong>{item.colorway}</strong></span>}
                          {item.size && <span>Size: <strong>{item.size}</strong></span>}
                          <span>Qty: <strong>{item.quantity || 1}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
                        {formatPrice(itemTotal)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                        {formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. SHIPPING ADDRESS & 4. PAYMENT METHOD                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '32px' }}>
            {/* 3. Shipping Address Card */}
            <section
              aria-labelledby="heading-shipping-address"
              data-testid="section-shipping-address"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e0',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fafaf9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1115'
                  }}>
                    <TruckIcon size={18} />
                  </div>
                  <div>
                    <h2 id="heading-shipping-address" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Shipping Address
                    </h2>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Consignee destination ledger</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, marginTop: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: '#111827', display: 'block', marginBottom: '4px' }}>
                    {shippingAddress.recipient || shippingAddress.fullName}
                  </strong>
                  {shippingAddress.street || shippingAddress.address}<br />
                  {shippingAddress.postalCode} {shippingAddress.city}, {shippingAddress.state && `${shippingAddress.state}, `}{shippingAddress.country}<br />
                  {shippingAddress.phone && <span style={{ color: '#6b7280', fontSize: '0.8125rem' }}>Phone: {shippingAddress.phone}</span>}
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                <span>Dispatch Method:</span>
                <strong style={{ color: '#111827' }}>{order.deliveryMethod || 'Express Carbon-Neutral Courier'}</strong>
              </div>
            </section>

            {/* 4. Payment Method Card */}
            <section
              aria-labelledby="heading-payment-method"
              data-testid="section-payment-method"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e5e0',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fafaf9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1115'
                  }}>
                    <ShieldCheckIcon size={18} />
                  </div>
                  <div>
                    <h2 id="heading-payment-method" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Payment Method
                    </h2>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Vault settlement authorization</div>
                  </div>
                </div>

                {/* Card Instrument Badge Box */}
                <div style={{
                  backgroundColor: '#0f1115',
                  color: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                      {(paymentMethod.brand || 'CREDIT CARD').toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {order.paymentStatus || 'CAPTURED'}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.125rem', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                    •••• •••• •••• {paymentMethod.last4 || '4242'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', opacity: 0.75 }}>
                    <span>CARDHOLDER: {paymentMethod.holder || 'ALEX VANCE'}</span>
                    <span>EXP: {paymentMethod.expiry || '08/28'}</span>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#059669',
                fontWeight: 600
              }}>
                <CheckCircleIcon size={16} /> 256-Bit Encrypted Atelier Vault Authorization
              </div>
            </section>
          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 5. TOTAL AMOUNT & FINANCIAL BREAKDOWN                         */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section
            aria-labelledby="heading-total-amount"
            data-testid="section-total-amount"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e0',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <h2 id="heading-total-amount" style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: '0 0 20px 0' }}>
              Financial Summary &amp; Total Amount
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px', marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Items Subtotal</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(subtotalAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                <span>Express Courier Freight SLA</span>
                <span style={{ fontWeight: 600, color: shippingAmount === 0 ? '#059669' : '#111827' }}>
                  {shippingAmount === 0 ? 'COMPLIMENTARY' : formatPrice(shippingAmount)}
                </span>
              </div>

              {taxAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
                  <span>Estimated VAT / Customs Duties</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{formatPrice(taxAmount)}</span>
                </div>
              )}

              <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
                    Total Amount
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>
                    Authorized &amp; Captured in USD
                  </span>
                </div>
                <div
                  data-testid="order-details-grand-total"
                  style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f1115' }}
                >
                  {formatPrice(order.total)}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={order}
        formatPrice={formatPrice}
      />

      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
        formatPrice={formatPrice}
      />

      <Footer />
    </div>
  );
};
