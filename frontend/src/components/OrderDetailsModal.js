import React from 'react';
import { useStore } from '../context/StoreContext';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { Badge } from './common/Badge';
import { TruckIcon, DownloadIcon } from './Icons';

export const OrderDetailsModal = () => {
  const {
    isOrderDetailsModalOpen,
    closeOrderDetails,
    selectedOrderForModal,
    formatPrice,
    addToCart,
    products,
    showToast
  } = useStore();

  if (!isOrderDetailsModalOpen || !selectedOrderForModal) return null;

  const order = selectedOrderForModal;

  const getStatusBadgeVariant = (state) => {
    switch (state) {
      case 'DELIVERED':
        return 'success';
      case 'COURIER DISPATCHED':
        return 'info';
      case 'PREPARING SHIPMENT':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const handleDownloadInvoice = () => {
    showToast(`Invoice for ${order.reference} generated & downloaded`, 'success');
  };

  const handleReorder = () => {
    // If order has items array or we use sample product
    const sampleProduct = products[0];
    addToCart(sampleProduct, 'Standard', 'Standard', 1);
    closeOrderDetails();
    showToast(`Items from ${order.reference} added to bag`, 'success');
  };

  return (
    <Modal
      isOpen={isOrderDetailsModalOpen}
      onClose={closeOrderDetails}
      maxWidth="680px"
      title={`Order Dossier ${order.reference}`}
      subtitle={`Placed on ${order.date ? new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : order.timestamp}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Order Status Banner */}
        <div style={{
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e5e0',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Badge variant={getStatusBadgeVariant(order.fulfillmentState)} hasDot>
                {order.fulfillmentState}
              </Badge>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Payment: <strong style={{ color: '#059669' }}>{order.paymentStatus}</strong>
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
              Carrier: <strong>{order.courier || 'DHL Express Worldwide'}</strong>
            </div>
          </div>

          {/* Tracking Number Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
              <TruckIcon size={16} />
              <span style={{ color: '#6b7280' }}>Waybill Tracking:</span>
              <code style={{ fontWeight: 800, color: '#111827', letterSpacing: '0.04em' }}>
                {order.trackingNumber || 'JD9182740192'}
              </code>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(order.trackingNumber || 'JD9182740192');
                showToast('Tracking number copied to clipboard', 'info');
              }}
              style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0f1115' }}
            >
              COPY
            </button>
          </div>

          {/* Shipment Stepper */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingTop: '4px' }}>
            {[
              { label: 'Order Confirmed', completed: true },
              { label: 'Quality Inspected', completed: true },
              { label: 'Carrier Handover', completed: order.fulfillmentState === 'COURIER DISPATCHED' || order.fulfillmentState === 'DELIVERED' },
              { label: 'Delivered', completed: order.fulfillmentState === 'DELIVERED' }
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  height: '4px',
                  backgroundColor: step.completed ? '#0f1115' : '#e5e7eb',
                  borderRadius: '2px',
                  marginBottom: '6px'
                }} />
                <div style={{
                  fontSize: '0.625rem',
                  fontWeight: step.completed ? 800 : 500,
                  color: step.completed ? '#111827' : '#9ca3af',
                  letterSpacing: '0.02em'
                }}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consignee & Shipping Destination */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e0'
          }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
              PATRON RECIPIENT
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
              {order.patron?.name || 'Julian Mercer'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              {order.patron?.email || 'j.mercer@atelier.co'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Tier: Elite Patron Member
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e0'
          }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>
              DISPATCH DESTINATION
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.5 }}>
              Grev Turegatan 14, 3TR<br />
              114 46 Stockholm<br />
              Sweden
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#111827', textTransform: 'uppercase', marginBottom: '12px' }}>
            ACQUIRED ITEMS ({order.itemsCount || 1})
          </div>

          <div style={{ border: '1px solid #e5e5e0', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=120"
                  alt="Acquisition item"
                  style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', backgroundColor: '#f3f4f6' }}
                />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                    {order.cartSummary || 'Mono Classic Low-Top Sneaker'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: '2px' }}>
                    Colorway: Chalk White • Size: EU 43 / US 10.0 • Qty: 1
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                  {formatPrice(order.total)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div style={{
          padding: '16px',
          backgroundColor: '#fafaf9',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
            <span>Item Subtotal</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
            <span>Express Courier SLA</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>COMPLIMENTARY</span>
          </div>
          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 800, color: '#111827' }}>
            <span>Total Captured Amount</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadInvoice}
            icon={DownloadIcon}
          >
            Download Invoice PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleReorder}
          >
            Reorder Archive
          </Button>
        </div>
      </div>
    </Modal>
  );
};
