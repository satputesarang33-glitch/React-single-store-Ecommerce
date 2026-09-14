import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  style = {},
  className = '',
  ...props
}) => {
  // Size styles — 3 steps only (Issue #1 alignment)
  const sizeStyles = {
    sm: { padding: '6px 14px',  fontSize: '0.75rem',   height: '32px' },
    md: { padding: '10px 20px', fontSize: '0.8125rem', height: '40px' },
    lg: { padding: '14px 28px', fontSize: '0.875rem',  height: '48px' },
  };

  // 5 variants — Issue #4 alignment with index.css tokens
  const variantStyles = {
    primary: {
      backgroundColor: '#0f1115',
      color: '#ffffff',
      border: '1.5px solid #0f1115',
      boxShadow: '0 2px 8px rgba(15, 17, 21, 0.18)',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#0f1115',
      border: '1.5px solid #0f1115',
    },
    amber: {
      backgroundColor: '#d97706',
      color: '#ffffff',
      border: '1.5px solid #d97706',
      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.2)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: '1.5px solid transparent',
    },
    danger: {
      backgroundColor: '#e11d48',
      color: '#ffffff',
      border: '1.5px solid #e11d48',
    },
  };

  const currentSize    = sizeStyles[size]    || sizeStyles.md;
  const currentVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '10px',   /* --radius-md token value — Issue #3 */
        fontWeight: 700,
        letterSpacing: '0.04em',
        transition: 'all 0.15s ease',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...currentSize,
        ...currentVariant,
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span style={{
          width: '14px',
          height: '14px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: variant === 'secondary' || variant === 'ghost' ? '#0f1115' : '#ffffff',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite',
        }} />
      ) : (
        <>
          {Icon && iconPosition === 'left'  && <Icon size={size === 'sm' ? 14 : 16} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
};
