import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/common/Button';
import { ShieldCheckIcon, CheckCircleIcon } from '../components/Icons';

/**
 * AdminLoginPage Component
 * Dedicated security portal for UrbanCart backoffice access.
 * Supports:
 * - Admin Login (Email or Mobile)
 * - Staff / Admin Register (with authorization key)
 * - Admin Verify Me (OTP verification via Email or Mobile)
 * - Admin Forgot Password (OTP verification via Email or Mobile)
 */
export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const {
    login,
    registerAdmin,
    sendVerificationCode,
    verifyCode,
    resetPassword,
    showToast,
    currentUser
  } = useStore();

  // If the current user is an admin (just logged in or already authenticated),
  // immediately navigate to the admin dashboard.
  // This effect fires whenever currentUser changes (e.g. after login() resolves
  // and StoreContext updates its state), making navigation reliable with no flags.
  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [currentUser, navigate]);

  // Mode: 'login' | 'register' | 'verify_me' | 'forgot'
  const [mode, setMode] = useState('login');

  // Login fields
  const [identifier, setIdentifier] = useState('admin@urbancart.com');
  const [password, setPassword] = useState('adminpassword');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [adminKey, setAdminKey] = useState('URBANCART-ADMIN');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Verify Me & Forgot Password OTP fields
  const [channel, setChannel] = useState('email'); // 'email' | 'mobile'
  const [target, setTarget] = useState('');
  const [step, setStep] = useState(1); // 1: Send, 2: Code, 3: New Pass (for forgot) or Success
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(identifier, password);
      if (user.role === 'admin') {
        showToast('Admin clearance verified. Welcome to Operations Dashboard.', 'success');
        // Navigation is handled by the useEffect watching currentUser
      } else {
        setError('Account lacks administrative backoffice clearance.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Admin Register
  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await registerAdmin({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        adminKey
      });
      showToast(`Admin account activated for ${regName}!`, 'success');
      // Navigation is handled by the useEffect watching currentUser
    } catch (err) {
      setError(err.message || 'Staff registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!target.trim()) {
      setError(`Please enter your admin ${channel === 'email' ? 'email' : 'mobile phone'}.`);
      setLoading(false);
      return;
    }

    try {
      const res = await sendVerificationCode({ type: channel, target });
      setStep(2);
      showToast(res.message || 'Admin OTP sent', 'info');
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await verifyCode({ target, code: otpCode });
      setStep(3);
      showToast('Admin verification confirmed!', 'success');
    } catch (err) {
      setError(err.message || 'Invalid code. Use demo code 482910.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Reset Admin Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ target, newPassword });
      setStep(4);
      showToast('Admin password updated successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoAdmin = async () => {
    setLoading(true);
    try {
      await login('admin@urbancart.com', 'adminpassword');
      showToast('Welcome, Marcus. UrbanCart OPS Console active.', 'success');
      // Navigation is handled by the useEffect watching currentUser
    } catch (err) {
      showToast('Error logging into demo admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setStep(1);
    setOtpCode('');
  };

  return (
    <div style={{
      backgroundColor: '#0a0b0d',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#14161b',
        border: '1px solid #272a33',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        color: '#ffffff'
      }}>
        {/* Top Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            color: '#0f1115',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.125rem',
            margin: '0 auto 12px auto'
          }}>
            UC
          </div>

          <div style={{
            fontSize: '0.625rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#d97706',
            textTransform: 'uppercase'
          }}>
            SECURITY CLEARANCE LEVEL 4
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            UrbanCart OPS Console
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '4px' }}>
            Restricted backoffice operations, catalog control, and shipment fulfillment.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            backgroundColor: '#1c1f26',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '20px',
            gap: '2px'
          }}>
            {[
              { id: 'login', label: 'Login' },
              { id: 'register', label: 'Register' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchMode(tab.id)}
                style={{
                  padding: '8px 4px',
                  fontSize: '0.8125rem',
                  fontWeight: mode === tab.id ? 800 : 500,
                  backgroundColor: mode === tab.id ? '#ffffff' : 'transparent',
                  color: mode === tab.id ? '#0f1115' : '#9ca3af',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '0.75rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* 1. ADMIN LOGIN */}
        {mode === 'login' && (
          <div>
            {/* 1-Click Demo Admin Button */}
            <button
              type="button"
              onClick={handleInstantDemoAdmin}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '18px',
                cursor: 'pointer'
              }}
            >
              <ShieldCheckIcon size={14} />
              <span>⚡ 1-CLICK DEMO ADMIN ACCESS (MARCUS)</span>
            </button>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                  ADMIN EMAIL OR MOBILE
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                    ADMIN PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    style={{ fontSize: '0.6875rem', color: '#9ca3af', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                style={{ backgroundColor: '#ffffff', color: '#0f1115', marginTop: '6px' }}
              >
                Sign In as Admin
              </Button>
            </form>
          </div>
        )}

        {/* 2. ADMIN REGISTER (STAFF SIGN UP) */}
        {mode === 'register' && (
          <form onSubmit={handleAdminRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                STAFF FULL NAME
              </label>
              <input
                type="text"
                placeholder="Marcus Vance"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                placeholder="marcus.ops@urbancart.internal"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                MOBILE PHONE
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 999-0192"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                STAFF SECRET AUTHORIZATION KEY
              </label>
              <input
                type="text"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' }}>
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={regConfirmPassword}
                onChange={e => setRegConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 12px',
                  fontSize: '0.8125rem',
                  backgroundColor: '#1c1f26',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              style={{ backgroundColor: '#ffffff', color: '#0f1115', marginTop: '6px' }}
            >
              Create Administrator Account
            </Button>
          </form>
        )}

        {/* 3. ADMIN VERIFY ME (EMAIL YA MOBILE) */}
        {mode === 'verify_me' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
              Perform Two-Factor Identity Verification via <strong>Email</strong> or <strong>Mobile SMS</strong>.
            </p>

            {step === 1 && (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setChannel('email'); setTarget(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: channel === 'email' ? '2px solid #ffffff' : '1px solid #374151',
                      backgroundColor: channel === 'email' ? '#262933' : '#1c1f26',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✉️ Admin Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setChannel('mobile'); setTarget(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: channel === 'mobile' ? '2px solid #ffffff' : '1px solid #374151',
                      backgroundColor: channel === 'mobile' ? '#262933' : '#1c1f26',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📱 Admin SMS
                  </button>
                </div>

                <input
                  type={channel === 'email' ? 'email' : 'tel'}
                  placeholder={channel === 'email' ? 'admin@urbancart.com' : '+1 (555) 999-0192'}
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Send Verification OTP
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#1c1f26', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem', color: '#9ca3af' }}>
                  Code dispatched to <strong>{target}</strong>.
                  <div style={{ color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                    Demo code: <strong>482910</strong>
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="482910"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '1.25rem',
                    letterSpacing: '0.25em',
                    textAlign: 'center',
                    fontWeight: 700,
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Confirm Identity
                </Button>
              </form>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}>
                  <CheckCircleIcon size={44} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                  Admin Clearance Confirmed!
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: '8px 0 16px 0' }}>
                  Two-factor identity verification successful for {target}.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => switchMode('login')}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Proceed to Sign In
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 4. ADMIN FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '2px'
              }}
            >
              ← Back to Login
            </button>
            {step === 1 && (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setChannel('email'); setTarget(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: channel === 'email' ? '2px solid #ffffff' : '1px solid #374151',
                      backgroundColor: channel === 'email' ? '#262933' : '#1c1f26',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ✉️ Reset via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setChannel('mobile'); setTarget(''); }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: channel === 'mobile' ? '2px solid #ffffff' : '1px solid #374151',
                      backgroundColor: channel === 'mobile' ? '#262933' : '#1c1f26',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📱 Reset via Mobile
                  </button>
                </div>

                <input
                  type={channel === 'email' ? 'email' : 'tel'}
                  placeholder={channel === 'email' ? 'admin@urbancart.com' : '+1 (555) 999-0192'}
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Send Admin Reset Code
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#1c1f26', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem', color: '#9ca3af' }}>
                  Verification code sent to <strong>{target}</strong>.
                  <div style={{ color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                    Demo code: <strong>482910</strong>
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="482910"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '1.25rem',
                    letterSpacing: '0.25em',
                    textAlign: 'center',
                    fontWeight: 700,
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Confirm Code
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600 }}>
                  ✓ Identity verified. Choose new admin password:
                </div>

                <input
                  type="password"
                  placeholder="New Admin Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />

                <input
                  type="password"
                  placeholder="Confirm New Admin Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.875rem',
                    backgroundColor: '#1c1f26',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Save New Admin Password
                </Button>
              </form>
            )}

            {step === 4 && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}>
                  <CheckCircleIcon size={44} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                  Admin Password Updated!
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#9ca3af', margin: '8px 0 16px 0' }}>
                  You can now sign in with your updated credentials.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => switchMode('login')}
                  style={{ backgroundColor: '#ffffff', color: '#0f1115' }}
                >
                  Return to Admin Login
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Back to Public Storefront */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'underline', cursor: 'pointer' }}
          >
            ← Return to Public Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
