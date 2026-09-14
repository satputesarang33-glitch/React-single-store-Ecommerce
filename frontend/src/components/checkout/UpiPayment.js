import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from '../Icons';

export const UpiPayment = ({ upiId, onChangeUpiId, selectedApp, onSelectApp, amount, onUpiApproved }) => {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'id'
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 mins countdown
  const [isSimulatingApprove, setIsSimulatingApprove] = useState(false);
  const [upiApproved, setUpiApproved] = useState(false);

  // Timer for QR validity
  useEffect(() => {
    if (activeTab !== 'qr' || upiApproved) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab, upiApproved]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const upiApps = [
    { name: 'Google Pay', handle: '@okaxis', icon: '🔵' },
    { name: 'PhonePe', handle: '@ybl', icon: '🟣' },
    { name: 'Paytm', handle: '@paytm', icon: '🔷' },
    { name: 'BHIM UPI', handle: '@upi', icon: '🟢' },
    { name: 'CRED UPI', handle: '@cred', icon: '⚪' }
  ];

  const handleSimulateScanAndPay = () => {
    setIsSimulatingApprove(true);
    setTimeout(() => {
      setIsSimulatingApprove(false);
      setUpiApproved(true);
      if (onUpiApproved) {
        onUpiApproved();
      }
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mode Switch: QR Code vs UPI ID */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f3f4f6',
        padding: '4px',
        borderRadius: '10px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          style={{
            flex: 1,
            padding: '8px 14px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'qr' ? '#ffffff' : 'transparent',
            color: activeTab === 'qr' ? '#111827' : '#6b7280',
            boxShadow: activeTab === 'qr' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
          }}
        >
          Dynamic QR Code
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('id')}
          style={{
            flex: 1,
            padding: '8px 14px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTab === 'id' ? '#ffffff' : 'transparent',
            color: activeTab === 'id' ? '#111827' : '#6b7280',
            boxShadow: activeTab === 'id' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
          }}
        >
          UPI ID / VPA
        </button>
      </div>

      {activeTab === 'qr' && (
        <div style={{
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Simulated QR Code Canvas/SVG */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '2px solid #111827',
            display: 'inline-block',
            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            {upiApproved ? (
              <div style={{
                width: '180px',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                gap: '8px'
              }}>
                <CheckCircleIcon size={48} />
                <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>Payment Received!</span>
              </div>
            ) : (
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                {/* 4 Corner Markers */}
                <rect x="10" y="10" width="46" height="46" rx="6" fill="#111827" />
                <rect x="18" y="18" width="30" height="30" rx="3" fill="#ffffff" />
                <rect x="24" y="24" width="18" height="18" rx="2" fill="#111827" />

                <rect x="124" y="10" width="46" height="46" rx="6" fill="#111827" />
                <rect x="132" y="18" width="30" height="30" rx="3" fill="#ffffff" />
                <rect x="138" y="24" width="18" height="18" rx="2" fill="#111827" />

                <rect x="10" y="124" width="46" height="46" rx="6" fill="#111827" />
                <rect x="18" y="132" width="30" height="30" rx="3" fill="#ffffff" />
                <rect x="24" y="138" width="18" height="18" rx="2" fill="#111827" />

                {/* Random Pattern Dots */}
                <rect x="66" y="14" width="10" height="10" fill="#111827" />
                <rect x="82" y="14" width="10" height="10" fill="#111827" />
                <rect x="102" y="14" width="10" height="10" fill="#111827" />
                <rect x="66" y="30" width="18" height="8" fill="#111827" />
                <rect x="94" y="30" width="18" height="8" fill="#111827" />
                <rect x="66" y="46" width="10" height="10" fill="#111827" />
                <rect x="90" y="46" width="22" height="10" fill="#111827" />

                <rect x="14" y="66" width="10" height="10" fill="#111827" />
                <rect x="30" y="66" width="26" height="10" fill="#111827" />
                <rect x="14" y="82" width="18" height="10" fill="#111827" />
                <rect x="38" y="82" width="18" height="10" fill="#111827" />
                <rect x="14" y="98" width="10" height="18" fill="#111827" />
                <rect x="30" y="106" width="26" height="10" fill="#111827" />

                <rect x="66" y="66" width="14" height="14" rx="2" fill="#111827" />
                <rect x="88" y="66" width="26" height="14" fill="#111827" />
                <rect x="122" y="66" width="20" height="14" fill="#111827" />
                <rect x="150" y="66" width="16" height="14" fill="#111827" />

                <rect x="66" y="88" width="26" height="14" fill="#111827" />
                <rect x="100" y="88" width="14" height="26" fill="#111827" />
                <rect x="122" y="88" width="20" height="14" fill="#111827" />
                <rect x="150" y="88" width="16" height="26" fill="#111827" />

                <rect x="66" y="110" width="14" height="22" fill="#111827" />
                <rect x="88" y="122" width="22" height="10" fill="#111827" />
                <rect x="122" y="110" width="20" height="14" fill="#111827" />

                <rect x="66" y="140" width="26" height="14" fill="#111827" />
                <rect x="100" y="140" width="18" height="14" fill="#111827" />
                <rect x="126" y="132" width="16" height="22" fill="#111827" />
                <rect x="150" y="122" width="16" height="32" fill="#111827" />

                {/* Center Badge */}
                <circle cx="90" cy="90" r="16" fill="#ffffff" stroke="#111827" strokeWidth="2" />
                <text x="90" y="94" fontSize="10" fontWeight="900" textAnchor="middle" fill="#111827">UPI</text>
              </svg>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
              Scan with any UPI App
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              Google Pay, PhonePe, Paytm, CRED or your mobile banking app
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: secondsLeft < 60 ? '#dc2626' : '#4b5563' }}>
            <span>QR expires in:</span>
            <strong style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{formatTimer(secondsLeft)}</strong>
          </div>

          {!upiApproved && (
            <button
              type="button"
              onClick={handleSimulateScanAndPay}
              disabled={isSimulatingApprove}
              style={{
                backgroundColor: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: isSimulatingApprove ? 'wait' : 'pointer'
              }}
            >
              {isSimulatingApprove ? 'Simulating scan & approve...' : '⚡ Simulate App Scan & Pay'}
            </button>
          )}
        </div>
      )}

      {activeTab === 'id' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
              ENTER UPI ID / VPA
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="username@bank"
                value={upiId}
                onChange={(e) => onChangeUpiId(e.target.value.toLowerCase())}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
              {upiId.includes('@') && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.6875rem',
                  color: '#059669',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircleIcon size={14} /> Valid Format
                </span>
              )}
            </div>
          </div>

          {/* Quick Select UPI App handles */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
              OR QUICK-SELECT YOUR UPI APP
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              {upiApps.map((app) => (
                <button
                  key={app.name}
                  type="button"
                  onClick={() => {
                    onSelectApp(app.name);
                    const userPrefix = upiId.includes('@') ? upiId.split('@')[0] : (upiId || 'julian');
                    onChangeUpiId(`${userPrefix}${app.handle}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    border: selectedApp === app.name ? '1.5px solid #111827' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: selectedApp === app.name ? '#f9fafb' : '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    textAlign: 'left'
                  }}
                >
                  <span>{app.icon}</span>
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
