import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CheckCircleIcon, DownloadIcon, ShieldCheckIcon } from '../components/Icons';

/**
 * OrderSuccessPage Component
 * Dedicated post-acquisition confirmation page with shipment stepper,
 * order reference, itemized summary, and download invoice action.
 */
export const OrderSuccessPage = () => {
  const {
    orders,
    openShopCatalog,
    openOrderDetails,
    showToast
  } = useStore();

  const latestOrder = orders && orders.length > 0 ? orders[0] : {
    reference: '#UC-10492-X',
    timestamp: 'Today at 02:00',
    total: 215.00,
    trackingNumber: 'CH-992-884-129-EXP',
    courier: 'DHL Express Worldwide',
    fulfillmentState: 'PREPARING SHIPMENT',
    patron: {
      name: 'Julian Mercer',
      email: 'j.mercer@atelier.co',
      city: 'Stockholm, Sweden'
    },
    items: [
      {
        title: 'UrbanCart Mono Low-Top Leather Sneaker',
        selectedColor: 'Chalk White',
        selectedSize: 'US 10',
        price: 160.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200'
      },
      {
        title: 'UrbanCart Heavyweight Pima Cotton Tee',
        selectedColor: 'Sand Oat',
        selectedSize: 'L',
        price: 55.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200'
      }
    ]
  };

  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (emailCooldown > 0) {
      timer = setInterval(() => {
        setEmailCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailCooldown]);

  const handleDownloadInvoice = () => {
    showToast('Generating official tax receipt PDF...', 'info');
    setTimeout(() => {
      showToast(`Receipt for ${latestOrder.reference} downloaded successfully`, 'success');
    }, 1000);
  };

  const handleResendOrderEmail = () => {
    if (emailCooldown > 0 || isResendingEmail) return;
    setIsResendingEmail(true);
    setTimeout(() => {
      setIsResendingEmail(false);
      setEmailCooldown(30);
      showToast(`Order receipt email resent to ${latestOrder.patron?.email || 'your email'}!`, 'success');
    }, 700);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '48px 0 80px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Header Card */}
          <div style={{
            backgroundColor: '#fafaf9',
            border: '1px solid #e5e7eb',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-card)'
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
              margin: '0 auto 20px auto'
            }}>
              <CheckCircleIcon size={36} />
            </div>

            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#059669', textTransform: 'uppercase' }}>
              PAYMENT AUTHORIZED &amp; DISPATCH INITIATED
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '8px 0 12px 0' }}>
              Thank you for your considered acquisition.
            </h1>

            <p style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              Order reference <strong>{latestOrder.reference}</strong> has been confirmed. A receipt and waybill tracking details have been dispatched to <strong>{latestOrder.patron?.email || 'your email'}</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" onClick={() => openOrderDetails(latestOrder)}>
                INSPECT ORDER DOSSIER
              </Button>
              <Button variant="outline" size="md" icon={DownloadIcon} onClick={handleDownloadInvoice}>
                Download Tax Invoice
              </Button>
              <Button
                variant="outline"
                size="md"
                disabled={emailCooldown > 0 || isResendingEmail}
                onClick={handleResendOrderEmail}
              >
                {isResendingEmail
                  ? 'Resending...'
                  : emailCooldown > 0
                    ? `Resend Email in ${emailCooldown}s`
                    : '✉️ Resend Receipt Email'}
              </Button>
            </div>
          </div>

          {/* Stepper Timeline Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
                  WAYBILL DISPATCH STATUS
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                  Fulfillment Stepper
                </h3>
              </div>
              <Badge variant="info">
                {latestOrder.fulfillmentState || 'PREPARING SHIPMENT'}
              </Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'Order Confirmed', sub: 'Verified', done: true },
                { label: 'Quality Inspection', sub: 'Passed SLA', done: true },
                { label: 'Carrier Handover', sub: 'In Transit', done: false },
                { label: 'Delivered', sub: 'Destination', done: false }
              ].map((step, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    height: '4px',
                    borderRadius: '9999px',
                    backgroundColor: step.done ? '#0f1115' : '#e5e7eb',
                    marginBottom: '8px'
                  }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: step.done ? 800 : 600, color: step.done ? '#111827' : '#9ca3af' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                    {step.sub}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #f3f4f6',
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              <div>
                Carrier: <strong>{latestOrder.courier || 'DHL Express'}</strong> • Tracking: <strong>{latestOrder.trackingNumber || 'CH-992-884'}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669' }}>
                <ShieldCheckIcon size={14} />
                <span>Insured Transit</span>
              </div>
            </div>
          </div>

          {/* Action to Return to Shopping */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => openShopCatalog('ALL')}
              style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f1115', textDecoration: 'underline' }}
            >
              ← Return to UrbanCart Lifestyle Collections
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
