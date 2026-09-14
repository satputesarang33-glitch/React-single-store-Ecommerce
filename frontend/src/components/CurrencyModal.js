import React from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, CheckIcon } from './Icons';

/**
 * CurrencyModal Component
 * Allows patrons to switch their browsing and checkout currency with live exchange rates.
 */
export const CurrencyModal = () => {
  const { isCurrencyModalOpen, setIsCurrencyModalOpen, currency, setCurrency, CURRENCY_CONFIG, showToast } = useStore();

  if (!isCurrencyModalOpen) return null;

  const handleSelect = (currKey) => {
    setCurrency(currKey);
    setIsCurrencyModalOpen(false);
    showToast(`Currency updated to ${CURRENCY_CONFIG[currKey].label}`, 'success');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 17, 21, 0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        padding: '28px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        position: 'relative',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827' }}>
              Select Currency &amp; Region
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
              Prices will dynamically convert based on current atelier rates.
            </p>
          </div>

          <button
            onClick={() => setIsCurrencyModalOpen(false)}
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              color: '#4b5563'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Currency list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(CURRENCY_CONFIG).map(([key, config]) => {
            const isSelected = currency === key;

            return (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #0f1115' : '1px solid #e5e7eb',
                  backgroundColor: isSelected ? '#fafaf9' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#0f1115',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem'
                  }}>
                    {config.symbol}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>
                      {config.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                      1 USD = {config.rate} {key}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div style={{ color: '#0f1115' }}>
                    <CheckIcon size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #f3f4f6',
          fontSize: '0.6875rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Duties and taxes are calculated at checkout based on destination.
        </div>
      </div>
    </div>
  );
};
