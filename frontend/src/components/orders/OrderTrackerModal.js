import React, { useState } from 'react';
import { TruckIcon, CheckCircleIcon, CloseIcon } from '../Icons';

export const OrderTrackerModal = ({ isOpen, onClose, order, formatPrice }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    if (!order) return 3;
    if (order.fulfillmentState === 'DELIVERED') return 4;
    if (order.fulfillmentState === 'COURIER DISPATCHED') return 3;
    return 2;
  });
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const trackingNum = order.trackingNumber || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const carrier = order.courier || (order.deliveryMethod?.includes('Express') ? 'FedEx Priority Air' : 'DHL Ground Logistics');

  const steps = [
    {
      id: 'ordered',
      title: 'Order Confirmed',
      description: 'Order placed & payment verified',
      location: 'UrbanCart Digital Atelier',
      time: order.date || 'Sep 4, 10:30 AM'
    },
    {
      id: 'inspected',
      title: 'Artisan Inspection',
      description: 'Hand-inspected for materials & stitching',
      location: 'Craft Facility, Porto (Portugal)',
      time: 'Sep 4, 02:15 PM'
    },
    {
      id: 'packed',
      title: 'Packed & Dispatched',
      description: 'Tamper-evident sealed packaging',
      location: 'Logistics Hub, Frankfurt (Germany)',
      time: 'Sep 4, 06:40 PM'
    },
    {
      id: 'transit',
      title: 'In Transit / Out for Delivery',
      description: 'On route with courier to consignee',
      location: `${order.shippingAddress?.city || 'New York'}, Delivery Station`,
      time: 'In Progress • On Schedule'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Signed and handed over to patron',
      location: order.shippingAddress?.city || 'Local Destination',
      time: 'Estimated Tomorrow'
    }
  ];

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(trackingNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceMilestone = () => {
    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 17, 21, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '680px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp 0.25s ease'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#0f1115',
          color: '#ffffff',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TruckIcon size={20} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase' }}>
                LIVE COURIER RADAR
              </div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                Tracking Order {order.reference || order.id}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '6px' }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Courier Summary Card */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fafaf9' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>CARRIER</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>{carrier}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>TRACKING NUMBER</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>
                  {trackingNum}
                </span>
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>ESTIMATED DELIVERY</div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {currentStepIndex >= 4 ? 'Delivered 🎉' : 'Tomorrow by 2:00 PM'}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                  {/* Step Connector Line */}
                  {idx < steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '15px',
                      top: '32px',
                      bottom: '-12px',
                      width: '2px',
                      backgroundColor: isDone && idx < currentStepIndex ? '#10b981' : '#e5e7eb',
                      zIndex: 0
                    }} />
                  )}

                  {/* Step Icon Indicator */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isDone ? (isCurrent ? '#111827' : '#10b981') : '#f3f4f6',
                    color: isDone ? '#ffffff' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(17, 24, 39, 0.15)' : 'none',
                    fontWeight: 800,
                    fontSize: '0.75rem'
                  }}>
                    {isDone && !isCurrent ? (
                      <CheckCircleIcon size={18} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <h4 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        color: isDone ? '#111827' : '#9ca3af',
                        margin: 0
                      }}>
                        {step.title}
                        {isCurrent && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe'
                          }}>
                            ACTIVE HUB
                          </span>
                        )}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                        {step.time}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8125rem', color: '#4b5563', margin: '4px 0 0 0' }}>
                      {step.description}
                    </p>

                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '2px', fontStyle: 'italic' }}>
                      📍 {step.location}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Simulation Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Simulate dispatch milestone updates in real time:
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleAdvanceMilestone}
                disabled={currentStepIndex >= steps.length - 1}
                style={{
                  backgroundColor: currentStepIndex >= steps.length - 1 ? '#e5e7eb' : '#111827',
                  color: currentStepIndex >= steps.length - 1 ? '#9ca3af' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: currentStepIndex >= steps.length - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                {currentStepIndex >= steps.length - 1 ? 'Delivered' : 'Advance Next Milestone →'}
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
