import React from 'react';
import { DownloadIcon, CloseIcon, ShieldCheckIcon } from '../Icons';

export const InvoiceModal = ({ isOpen, onClose, order, formatPrice }) => {
  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${order.reference?.replace('#', '') || '2026-8821'}`;
  const invoiceDate = order.date || 'September 4, 2026';

  const handlePrint = () => {
    window.print();
  };

  const items = order.items && order.items.length > 0 ? order.items : [
    {
      id: 'default-item',
      title: order.cartSummary || 'UrbanCart Curated Collection Specimen',
      sku: 'UC-FW-086',
      price: order.total || 160.00,
      quantity: order.itemsCount || 1,
      color: 'Chalk White',
      size: 'Standard'
    }
  ];

  const subtotal = order.subtotal || order.total || 0;
  const discount = order.discount || 0;
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
  const total = order.total || (subtotal - discount + shipping + tax);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 17, 21, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="invoice-modal-overlay">
      {/* Printable Invoice Container */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '740px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        maxHeight: '92vh',
        overflowY: 'auto',
        position: 'relative'
      }} className="printable-invoice-surface">

        {/* Modal Action Bar (Hidden on print) */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafaf9',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
            <ShieldCheckIcon size={16} style={{ color: '#059669' }} />
            <span>Official Tax Invoice Preview</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#0f1115',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <DownloadIcon size={14} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Actual Invoice Sheet */}
        <div style={{ padding: '40px 48px', color: '#111827' }} className="invoice-print-content">
          {/* Header Row: Company Brand + Invoice Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111827', paddingBottom: '24px', marginBottom: '28px' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f1115' }}>
                URBANCART
              </div>
              <div style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase', marginTop: '2px' }}>
                LUXURY ATELIER &amp; GOODS
              </div>
              <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '8px', lineHeight: 1.4 }}>
                450 Mission Street, Suite 1200<br />
                San Francisco, CA 94105, United States<br />
                VAT ID: US-94105882104 • support@urbancart.com
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TAX INVOICE
              </div>
              <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb', marginTop: '4px' }}>
                {invoiceNumber}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
                Order Ref: <strong>{order.reference || order.id}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                Date: <strong>{invoiceDate}</strong>
              </div>
            </div>
          </div>

          {/* Bill To / Ship To Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px', fontSize: '0.8125rem' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
                BILLED TO / CONSIgNEE
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#111827' }}>
                {order.customer?.fullName || order.patron?.name || 'Julian Mercer'}
              </div>
              <div style={{ color: '#4b5563', marginTop: '4px', lineHeight: 1.4 }}>
                {order.customer?.email || order.patron?.email || 'customer@urbancart.com'}<br />
                {order.customer?.phone || order.patron?.phone || '+1 (555) 234-5678'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
                SHIPPING DESTINATION
              </div>
              <div style={{ fontWeight: 700, color: '#111827' }}>
                {order.shippingAddress?.address || order.shippingAddress?.street || '742 Evergreen Terrace'}
              </div>
              <div style={{ color: '#4b5563', marginTop: '4px', lineHeight: 1.4 }}>
                {order.shippingAddress?.city || 'Brooklyn'}, {order.shippingAddress?.state || 'NY'} {order.shippingAddress?.pincode || order.shippingAddress?.postalCode || '11201'}<br />
                {order.shippingAddress?.country || 'United States'}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Description</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Unit Price</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase', fontSize: '0.6875rem' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.cartId || it.id || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{it.title}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '2px' }}>
                      Color: {it.color || it.colorway || 'Standard'} • Size: {it.size || 'Default'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: '#4b5563' }}>
                    {it.quantity}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px', color: '#4b5563' }}>
                    {formatPrice(it.price)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 800, color: '#111827' }}>
                    {formatPrice(it.price * it.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals & Payment Stamp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
            {/* Payment Method Details & Stamp */}
            <div style={{ maxWidth: '300px' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>
                PAYMENT METHOD &amp; STATUS
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                {typeof order.paymentMethod === 'string' ? order.paymentMethod : (order.paymentMethod?.label || 'Credit Card')}
              </div>

              {/* Official Paid Stamp */}
              <div style={{
                display: 'inline-block',
                marginTop: '14px',
                padding: '6px 14px',
                border: '2px solid #059669',
                borderRadius: '6px',
                color: '#059669',
                fontWeight: 900,
                fontSize: '0.8125rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transform: 'rotate(-4deg)',
                boxShadow: '0 2px 4px rgba(5, 150, 105, 0.1)'
              }}>
                ✓ {order.paymentStatus || 'PAID & SETTLED'}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                  <span>Discount Applied:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Shipping &amp; Handling:</span>
                <span style={{ fontWeight: 700, color: shipping === 0 ? '#059669' : '#111827' }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563' }}>
                <span>Estimated Sales Tax (8%):</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{formatPrice(tax)}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '2px solid #111827',
                paddingTop: '10px',
                marginTop: '6px',
                fontSize: '1.0625rem',
                fontWeight: 800,
                color: '#111827'
              }}>
                <span>Total Paid:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{
            marginTop: '40px',
            paddingTop: '16px',
            borderTop: '1px solid #f3f4f6',
            fontSize: '0.6875rem',
            color: '#9ca3af',
            textAlign: 'center',
            lineHeight: 1.5
          }}>
            Thank you for shopping with UrbanCart Atelier. All items are backed by our 30-day inspection guarantee.<br />
            For questions or assistance regarding this tax receipt, contact concierge@urbancart.com quoting invoice #{invoiceNumber}.
          </div>
        </div>
      </div>

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice-surface,
          .printable-invoice-surface * {
            visibility: visible;
          }
          .invoice-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: none !important;
            padding: 0 !important;
          }
          .printable-invoice-surface {
            box-shadow: none !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
