import React, { useState } from 'react';
import { GoogleIcon, AppleIcon, CheckCircleIcon, ShieldCheckIcon } from '../Icons';

export const DigitalWallets = ({ totalAmount, formatPrice, onWalletSuccess }) => {
  const [authorizingWallet, setAuthorizingWallet] = useState(null); // 'gpay' | 'apple'
  const [authStage, setAuthStage] = useState('idle'); // 'prompt' | 'processing' | 'done'

  const handleTriggerWallet = (type) => {
    setAuthorizingWallet(type);
    setAuthStage('processing');

    setTimeout(() => {
      setAuthStage('done');
      setTimeout(() => {
        setAuthorizingWallet(null);
        setAuthStage('idle');
        onWalletSuccess({
          method: type === 'gpay' ? 'Google Pay' : 'Apple Pay',
          details: type === 'gpay' ? 'Google Pay (Visa ending in 8821)' : 'Apple Pay (Mastercard ending in 4102)'
        });
      }, 700);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        color: '#6b7280',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <ShieldCheckIcon size={14} style={{ color: '#059669' }} />
        <span>Express One-Touch Wallets</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Google Pay Button */}
        <button
          type="button"
          onClick={() => handleTriggerWallet('gpay')}
          disabled={authorizingWallet !== null}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #d1d5db',
            borderRadius: '10px',
            padding: '13px 16px',
            cursor: authorizingWallet !== null ? 'wait' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#111827'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          <GoogleIcon size={19} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>Pay</span>
        </button>

        {/* Apple Pay Button */}
        <button
          type="button"
          onClick={() => handleTriggerWallet('apple')}
          disabled={authorizingWallet !== null}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1.5px solid #000000',
            borderRadius: '10px',
            padding: '13px 16px',
            cursor: authorizingWallet !== null ? 'wait' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1f2937'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000000'; }}
        >
          <AppleIcon size={19} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Pay</span>
        </button>
      </div>

      {/* Simulated Biometric / Wallet Sheet Overlay */}
      {authorizingWallet && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 17, 21, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            textAlign: 'center',
            animation: 'slideUp 0.25s ease'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              {authorizingWallet === 'gpay' ? <GoogleIcon size={30} /> : <AppleIcon size={30} />}
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
              {authorizingWallet === 'gpay' ? 'Google Pay' : 'Apple Pay'}
            </h3>

            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 20px 0' }}>
              Authorizing payment for <strong style={{ color: '#111827' }}>{formatPrice(totalAmount)}</strong>
            </p>

            {authStage === 'processing' && (
              <div style={{ padding: '16px 0' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid #e5e7eb',
                  borderTopColor: '#111827',
                  borderRadius: '50%',
                  margin: '0 auto 12px auto',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#4b5563' }}>
                  Simulating biometric authentication...
                </div>
              </div>
            )}

            {authStage === 'done' && (
              <div style={{ padding: '16px 0', color: '#059669' }}>
                <CheckCircleIcon size={36} style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  Wallet Verified & Authorized!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
