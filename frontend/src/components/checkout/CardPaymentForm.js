import React, { useState } from 'react';
import { LockIcon } from '../Icons';

/**
 * Detect card network by number prefix
 */
export const detectCardBrand = (number) => {
  const clean = number.replace(/\D/g, '');
  if (!clean) return 'generic';
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(508[5-9]|6521[5-9]|652[2-9]|653[0-1]|60[6-8])/.test(clean)) return 'rupay';
  if (/^(6011|65|64[4-9])/.test(clean)) return 'discover';
  return 'generic';
};

export const CardPaymentForm = ({ cardData, onChange }) => {
  const [focusedField, setFocusedField] = useState(null);

  const brand = detectCardBrand(cardData.cardNumber || '');

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (brand === 'amex') {
      val = val.slice(0, 15);
      // Amex format 4-6-5
      const parts = [];
      if (val.length > 0) parts.push(val.substring(0, 4));
      if (val.length > 4) parts.push(val.substring(4, 10));
      if (val.length > 10) parts.push(val.substring(10, 15));
      onChange({ ...cardData, cardNumber: parts.join(' ') });
    } else {
      val = val.slice(0, 16);
      const parts = val.match(/.{1,4}/g) || [];
      onChange({ ...cardData, cardNumber: parts.join(' ') });
    }
  };

  // Format MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    onChange({ ...cardData, expiryDate: val });
  };

  // Format CVV
  const handleCvvChange = (e) => {
    const maxLen = brand === 'amex' ? 4 : 3;
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    onChange({ ...cardData, cvv: val });
  };

  const brandNames = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    discover: 'Discover',
    rupay: 'RuPay',
    generic: 'Credit / Debit'
  };

  const brandGradients = {
    visa: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    mastercard: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #ea580c 100%)',
    amex: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
    discover: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    rupay: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
    generic: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Interactive Virtual Card Preview */}
      <div
        style={{
          background: brandGradients[brand],
          color: '#ffffff',
          borderRadius: '16px',
          padding: '22px 26px',
          boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.35)',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '190px',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Hologram / Chip & Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '28px',
                backgroundColor: '#fbbf24',
                borderRadius: '6px',
                border: '1px solid #d97706',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: '9px', left: 0, right: 0, height: '1px', backgroundColor: '#b45309' }} />
              <div style={{ position: 'absolute', left: '18px', top: 0, bottom: 0, width: '1px', backgroundColor: '#b45309' }} />
            </div>
            <span style={{ fontSize: '0.625rem', letterSpacing: '0.1em', opacity: 0.85, textTransform: 'uppercase' }}>
              SECURE CHIP
            </span>
          </div>

          <div style={{
            fontSize: '0.875rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            padding: '4px 10px',
            backgroundColor: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(4px)',
            borderRadius: '6px'
          }}>
            {brandNames[brand]}
          </div>
        </div>

        {/* Card Number display */}
        <div style={{
          fontSize: '1.25rem',
          fontFamily: 'monospace',
          letterSpacing: '0.18em',
          margin: '16px 0',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          {cardData.cardNumber || '•••• •••• •••• ••••'}
        </div>

        {/* Cardholder & Expiration */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.6875rem' }}>
          <div>
            <div style={{ opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.5625rem' }}>CARDHOLDER</div>
            <div style={{ fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px', textTransform: 'uppercase', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cardData.nameOnCard || 'YOUR FULL NAME'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '0.5625rem' }}>EXPIRES</div>
            <div style={{ fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px', fontFamily: 'monospace' }}>
              {cardData.expiryDate || 'MM/YY'}
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
        {/* Card Number */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>CARD NUMBER</span>
            <span style={{ fontSize: '0.6875rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LockIcon size={11} /> 256-Bit SSL Encrypted
            </span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="cardNumber"
              placeholder="4532 8821 0041 9924"
              value={cardData.cardNumber || ''}
              onChange={handleCardNumberChange}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
              maxLength={brand === 'amex' ? 17 : 19}
              style={{
                width: '100%',
                padding: '12px 14px',
                paddingRight: '80px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: focusedField === 'number' ? '1px solid #111827' : '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                transition: 'border-color 0.15s'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              color: '#4b5563',
              backgroundColor: '#f3f4f6',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {brandNames[brand]}
            </span>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
            CARDHOLDER NAME
          </label>
          <input
            type="text"
            name="nameOnCard"
            placeholder="As printed on card"
            value={cardData.nameOnCard || ''}
            onChange={(e) => onChange({ ...cardData, nameOnCard: e.target.value.toUpperCase() })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            style={{
              width: '100%',
              padding: '12px 14px',
              fontSize: '0.875rem',
              border: focusedField === 'name' ? '1px solid #111827' : '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              outline: 'none',
              textTransform: 'uppercase'
            }}
          />
        </div>

        {/* Expiry & CVV */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
              EXPIRY DATE
            </label>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={cardData.expiryDate || ''}
              onChange={handleExpiryChange}
              onFocus={() => setFocusedField('expiry')}
              onBlur={() => setFocusedField(null)}
              maxLength={5}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                border: focusedField === 'expiry' ? '1px solid #111827' : '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>SECURITY CODE (CVV)</span>
              <span title="3 digits on back of Visa/MC, 4 digits on front of Amex" style={{ cursor: 'help', color: '#9ca3af' }}>ⓘ</span>
            </label>
            <input
              type="password"
              name="cvv"
              placeholder={brand === 'amex' ? '••••' : '•••'}
              value={cardData.cvv || ''}
              onChange={handleCvvChange}
              onFocus={() => setFocusedField('cvv')}
              onBlur={() => setFocusedField(null)}
              maxLength={brand === 'amex' ? 4 : 3}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                letterSpacing: '0.2em',
                border: focusedField === 'cvv' ? '1px solid #111827' : '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Save Card Checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: '#4b5563', marginTop: '4px' }}>
          <input
            type="checkbox"
            checked={cardData.saveCard !== false}
            onChange={(e) => onChange({ ...cardData, saveCard: e.target.checked })}
            style={{ accentColor: '#111827' }}
          />
          <span>Save this card for secure 1-click checkout next time</span>
        </label>
      </div>
    </div>
  );
};
