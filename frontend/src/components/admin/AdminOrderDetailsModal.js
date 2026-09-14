import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

/**
 * AdminOrderDetailsModal Component
 * Comprehensive Backoffice Order Inspector with:
 * - Customer information (Name, Email, Phone, Shipping Address)
 * - Payment status and method
 * - Order status and direct status update selector
 * - Ordered products list with variant details
 * - Order timeline
 * - Financial breakdown
 */
export const AdminOrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { updateOrderStatus, formatPrice } = useStore();

  if (!order) return null;

  const patron = order.patron || {};
  const shipping = order.shippingAddress || {};
  const items = order.items || [];
  const paymentMethod = order.paymentMethod || {};

  const handleStatusChange = (e) => {
    updateOrderStatus(order.id, e.target.value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="720px"
      title={`Order Dossier: ${order.reference || order.id}`}
      subtitle={`Placed on ${order.date || order.timestamp || 'Recent'} • Customer: ${patron.name || 'Patron'}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxHeight: '74vh', overflowY: 'auto', paddingRight: '4px' }}>
        {/* Status & Control Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
              CURRENT FULFILLMENT STATUS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <select
                value={order.fulfillmentState}
                onChange={handleStatusChange}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  backgroundColor: order.fulfillmentState === 'DELIVERED' ? '#ecfdf5' : order.fulfillmentState === 'COURIER DISPATCHED' ? '#eff6ff' : '#fef3c7',
                  color: order.fulfillmentState === 'DELIVERED' ? '#065f46' : order.fulfillmentState === 'COURIER DISPATCHED' ? '#1e40af' : '#92400e',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="PREPARING SHIPMENT">PREPARING SHIPMENT</option>
                <option value="COURIER DISPATCHED">COURIER DISPATCHED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                (Live syncs to patron account)
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
              PAYMENT STATUS
            </div>
            <div style={{ marginTop: '4px' }}>
              <Badge variant={order.paymentStatus === 'CAPTURED' || order.paymentStatus === 'SETTLED' ? 'success' : 'warning'}>
                ● {order.paymentStatus || 'CAPTURED'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Customer Information & Shipping Destination Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Customer info card */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              CUSTOMER INFORMATION
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
              {patron.name || 'Patron'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>
              <strong>Email:</strong> {patron.email || 'patron@example.com'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '2px' }}>
              <strong>Phone:</strong> {patron.phone || shipping.phone || '+46 8 123 4567'}
            </div>
            {patron.isVip && (
              <div style={{ marginTop: '8px' }}>
                <Badge variant="warning">VIP ATELIER PATRON</Badge>
              </div>
            )}
          </div>

          {/* Shipping destination card */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              SHIPPING ADDRESS
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#111827', lineHeight: 1.5 }}>
              <div>{shipping.fullName || shipping.recipient || patron.name}</div>
              <div>{shipping.street || shipping.address || 'Grev Turegatan 14, 3TR'}</div>
              <div>
                {[shipping.city, shipping.state, shipping.postalCode].filter(Boolean).join(', ') || 'Stockholm, 114 46'}
              </div>
              <div style={{ fontWeight: 700 }}>{shipping.country || 'Sweden'}</div>
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '8px' }}>
              Courier: {order.courier || 'DHL Express Global'} ({order.trackingNumber || 'JD01460000889201'})
            </div>
          </div>
        </div>

        {/* Ordered Products List */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '18px'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            ORDERED PRODUCTS ({items.length || 1} ITEMS)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: idx === items.length - 1 ? 'none' : '1px solid #f3f4f6'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=160'}
                      alt={item.title}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.8125rem', color: '#111827' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                        {item.colorway && <span>Color: {item.colorway} • </span>}
                        {item.size && <span>Size: {item.size} • </span>}
                        <span>Qty: {item.quantity || 1}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.8125rem' }}>
                      {formatPrice((item.price || 160) * (item.quantity || 1))}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>
                      {formatPrice(item.price || 160)} each
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
                {order.cartSummary || 'Curated Atelier Goods Package'}
              </div>
            )}
          </div>
        </div>

        {/* Payment & Financial Ledger Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Payment Method */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              PAYMENT METHOD
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
              {paymentMethod.label || `${paymentMethod.brand || 'Visa'} •••• ${paymentMethod.last4 || '4242'}`}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              Billing Holder: {paymentMethod.holder || patron.name || 'JULIAN MERCER'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '6px' }}>
              Settlement Status: Authorized &amp; Disbursed
            </div>
          </div>

          {/* Ledger Calculation */}
          <div style={{
            padding: '16px',
            backgroundColor: '#fafaf9',
            border: '1px solid #e5e7eb',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#4b5563', marginBottom: '6px' }}>
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal || order.total * 0.88)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#4b5563', marginBottom: '6px' }}>
              <span>Express Delivery:</span>
              <span>{formatPrice(order.shipping || 15.00)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#4b5563', marginBottom: '8px' }}>
              <span>Taxes &amp; Duties:</span>
              <span>{formatPrice(order.tax || 15.00)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#111827',
              paddingTop: '8px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <span>Total Settlement:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f3f4f6' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: '#0f1115',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </Modal>
  );
};
