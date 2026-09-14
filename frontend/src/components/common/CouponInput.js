import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAppDispatch, useAppSelector, applyCoupon, removeCoupon, selectAppliedCoupon } from '../../store';
import { CloseIcon } from '../Icons';

export const PROMO_PRESETS = [
  { code: 'WELCOME10', type: 'percent', value: 10, label: '10% OFF', description: '10% Welcome Discount', minSpend: 0 },
  { code: 'URBAN20', type: 'percent', value: 20, label: '20% OFF', description: '20% Atelier Special', minSpend: 50 },
  { code: 'SAVE25', type: 'fixed', value: 25, label: '$25 OFF', description: '$25 Off Orders over $100', minSpend: 100 },
  { code: 'FREESHIP', type: 'free_shipping', value: 15, label: 'FREE SHIPPING', description: 'Complimentary Express Freight', minSpend: 0 }
];

export const CouponInput = ({ onCouponApplied, compact = false }) => {
  const { showToast, cartSubtotal } = useStore();
  const dispatch = useAppDispatch();
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = (codeToApply) => {
    setErrorMsg('');
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMsg('Please enter a coupon code.');
      return;
    }

    const preset = PROMO_PRESETS.find(p => p.code === code);
    if (!preset) {
      setErrorMsg(`"${code}" is invalid. Try URBAN20, WELCOME10, SAVE25, or FREESHIP.`);
      showToast(`Invalid coupon code: "${code}"`, 'error');
      return;
    }

    if (preset.minSpend > 0 && cartSubtotal < preset.minSpend) {
      const msg = `Code ${preset.code} requires a minimum order of $${preset.minSpend}. (Your subtotal is $${cartSubtotal.toFixed(2)})`;
      setErrorMsg(msg);
      showToast(msg, 'error');
      return;
    }

    dispatch(applyCoupon(preset));
    setInputCode('');
    showToast(`Coupon "${preset.code}" applied! ${preset.description}`, 'success');
    if (onCouponApplied) onCouponApplied(preset);
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    showToast('Coupon removed', 'info');
    setErrorMsg('');
  };

  return (
    <div style={{ marginTop: compact ? '8px' : '14px' }}>
      {/* If coupon is already active, show applied chip */}
      {appliedCoupon ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#166534',
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem' }}>🎟️</span>
            <div>
              <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>{appliedCoupon.code}</span>
              <span style={{ marginLeft: '6px', fontSize: '0.75rem', opacity: 0.85 }}>({appliedCoupon.description})</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="Remove coupon"
            aria-label="Remove coupon"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ) : (
        <div>
          {/* Input & Apply Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApply();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Promo or coupon code"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                if (errorMsg) setErrorMsg('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: errorMsg ? '1px solid #dc2626' : '1px solid #d1d5db',
                fontSize: '0.8125rem',
                outline: 'none',
                backgroundColor: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#111827',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#000000'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
            >
              Apply
            </button>
          </form>

          {/* Quick preset chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span style={{ fontSize: '0.6875rem', color: '#6b7280', fontWeight: 600 }}>Quick codes:</span>
            {PROMO_PRESETS.map((p) => (
              <button
                key={p.code}
                type="button"
                onClick={() => handleApply(p.code)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '4px',
                  border: '1px dashed #d1d5db',
                  backgroundColor: '#f9fafb',
                  color: '#374151',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#111827';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = '#374151';
                }}
                title={`Apply ${p.description}`}
              >
                {p.code} ({p.label})
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '6px', fontWeight: 500 }}>
              {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
