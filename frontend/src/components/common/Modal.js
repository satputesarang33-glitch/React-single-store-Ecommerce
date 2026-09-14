import React, { useEffect } from 'react';
import { CloseIcon } from '../Icons';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon,
  children,
  maxWidth = '540px',
  showClose = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 17, 21, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '22px',
          width: '100%',
          maxWidth,
          boxShadow: '0 25px 65px -12px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top subtle luxury hairline */}
        <div style={{
          height: '3px',
          width: '100%',
          background: 'linear-gradient(90deg, #0f1115 0%, #d97706 50%, #0f1115 100%)',
          flexShrink: 0
        }} />

        {/* Modal Header */}
        {(title || showClose) && (
          <div
            className="modal-header"
            style={{
              padding: '22px 26px 18px 26px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              backgroundColor: '#ffffff'
            }}
          >
            <div style={{ flex: 1 }}>
              {badge && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  {badge}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {icon && (
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: '#0f1115',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(15, 17, 21, 0.2)'
                  }}>
                    {icon}
                  </div>
                )}
                <div>
                  {title && (
                    <h3 style={{
                      fontSize: '1.375rem',
                      fontWeight: 800,
                      color: '#0f1115',
                      letterSpacing: '-0.03em',
                      fontFamily: 'var(--font-sans)',
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p style={{
                      fontSize: '0.8125rem',
                      color: '#6b7280',
                      marginTop: '4px',
                      marginBottom: 0,
                      lineHeight: 1.45,
                      fontWeight: 400
                    }}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {showClose && (
              <button
                onClick={onClose}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.18s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#0f1115';
                  e.currentTarget.style.borderColor = '#0f1115';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Close"
              >
                <CloseIcon size={15} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="modal-body" style={{ padding: '22px 26px 26px 26px', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
