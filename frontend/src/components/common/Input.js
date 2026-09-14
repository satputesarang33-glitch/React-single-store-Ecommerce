import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon = null,
  fullWidth = true,
  style = {},
  inputStyle = {},
  ...props
}) => {
  const inputId = props.id || name || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: fullWidth ? '100%' : 'auto', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
            color: error ? '#dc2626' : '#374151'
          }}
        >
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            color: error ? '#dc2626' : '#9ca3af',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: Icon ? '11px 14px 11px 38px' : '11px 14px',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-sans)',
            backgroundColor: disabled ? '#f9fafb' : '#fafaf9',
            border: `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '10px',
            color: '#111827',
            outline: 'none',
            transition: 'all 0.15s ease',
            ...inputStyle
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#0f1115';
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.boxShadow = error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(15, 17, 21, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
            e.target.style.backgroundColor = disabled ? '#f9fafb' : '#fafaf9';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>

      {error ? (
        <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
