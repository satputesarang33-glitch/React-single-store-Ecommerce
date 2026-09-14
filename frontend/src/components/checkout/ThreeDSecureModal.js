import React, { useState, useEffect } from 'react';
import { LockIcon, CheckCircleIcon, ShieldCheckIcon, CloseIcon } from '../Icons';

export const ThreeDSecureModal = ({
  isOpen,
  amount,
  formatPrice,
  cardNumber = '•••• 8821',
  onSuccess,
  onCancel
}) => {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setOtp('');
      setErrorMsg('');
      setSecondsRemaining(120);
      setIsVerifying(false);
      setVerifiedSuccess(false);
      return;
    }

    // Pre-populate with verified demo passcode so authorization is immediately available
    setOtp('882104');

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    if (otp !== '882104' && otp !== '123456') {
      setErrorMsg('Invalid authentication code. Please use demo OTP: 882104');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1000);
  };

  const handleQuickFillOtp = () => {
    setOtp('882104');
    setErrorMsg('');
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Bank Header */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheckIcon size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                CENTRAL BANK IDENTITY CHECK
              </div>
              <div style={{ fontSize: '0.625rem', opacity: 0.75, letterSpacing: '0.05em' }}>
                3D SECURE 2.2 AUTHENTICATION
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px 28px 24px 28px' }}>
          {verifiedSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircleIcon size={38} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Payment Authenticated!
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '6px' }}>
                Finalizing your order confirmation...
              </p>
            </div>
          ) : (
            <>
              {/* Transaction Metadata Card */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '0.8125rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Merchant:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>UrbanCart Luxe Atelier</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Amount:</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{formatPrice(amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Card Reference:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                    •••• {cardNumber.slice(-4) || '8821'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                A one-time passcode has been sent via SMS to your registered phone ending in <strong>••••••8821</strong>.
              </p>

              {/* Demo Quick Fill Banner */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px dashed #bfdbfe',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>Demo Security Passcode: </span>
                  <code style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e3a8a', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>882104</code>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFillOtp}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Auto-Fill
                </button>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleVerify}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="882104"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    letterSpacing: '0.3em',
                    fontWeight: 800,
                    border: errorMsg ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />

                {errorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, marginTop: '6px', textAlign: 'center' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Code valid for: <strong style={{ fontFamily: 'monospace' }}>{formatTimer(secondsRemaining)}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSecondsRemaining(120);
                      handleQuickFillOtp();
                    }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Resend Code
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isVerifying}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying || otp.length < 6}
                    style={{
                      flex: 2,
                      padding: '12px',
                      backgroundColor: otp.length === 6 ? '#0f172a' : '#94a3b8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: otp.length === 6 && !isVerifying ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isVerifying ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <LockIcon size={14} />
                        <span>Authorize Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
