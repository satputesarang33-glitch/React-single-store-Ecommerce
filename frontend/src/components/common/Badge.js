import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  hasDot = false,
  style = {},
  ...props
}) => {
  const styles = {
    neutral: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #e5e7eb',
      dotColor: '#9ca3af'
    },
    dark: {
      backgroundColor: '#0f1115',
      color: '#ffffff',
      border: '1px solid #0f1115',
      dotColor: '#ffffff'
    },
    success: {
      backgroundColor: '#ecfdf5',
      color: '#065f46',
      border: '1px solid #a7f3d0',
      dotColor: '#10b981'
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a',
      dotColor: '#f59e0b'
    },
    error: {
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca',
      dotColor: '#ef4444'
    },
    info: {
      backgroundColor: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #bfdbfe',
      dotColor: '#3b82f6'
    }
  };

  const current = styles[variant] || styles.neutral;

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      backgroundColor: current.backgroundColor,
      color: current.color,
      border: current.border,
      ...style
    }}
    {...props}
    >
      {hasDot && (
        <span style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: current.dotColor
        }} />
      )}
      {children}
    </span>
  );
};
