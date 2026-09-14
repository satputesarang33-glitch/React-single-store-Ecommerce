import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon
} from '../components/Icons';

/**
 * LoginPage Component (Standalone Page)
 * Form validation powered by React Hook Form.
 * Supports both User (Customer) and Client (Admin) login modes.
 */
export const LoginPage = () => {
  const { login, loginWithGoogle, setActiveView, showToast } = useStore();
  const [roleMode, setRoleMode] = useState('user'); // 'user' (customer) | 'client' (admin)
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true
    },
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      const user = await login(data.email, data.password);
      if (roleMode === 'client' && user.role !== 'admin') {
        setAuthError('This account does not have Client Admin clearance.');
        return;
      }
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (roleMode === 'client' || user.role === 'admin') {
        setActiveView('admin_dashboard');
      } else {
        setActiveView('account');
      }
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      const user = await loginWithGoogle();
      showToast(`Welcome back, ${user.name}!`, 'success');
      setActiveView('account');
    } catch (err) {
      setAuthError(err.message || 'Google authentication failed.');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
              AUTHENTICATION PORTAL
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0 6px 0' }}>
              {roleMode === 'client' ? 'Client Admin Login' : 'Sign In to Your Account'}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
              {roleMode === 'client'
                ? 'Authorized personnel login for UrbanCart store management.'
                : 'Enter your credentials to access your orders and profile.'}
            </p>
          </div>



          {/* Auth Error Banner */}
          {authError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.75rem',
              marginBottom: '18px',
              fontWeight: 600
            }}>
              {authError}
            </div>
          )}

          {/* Login Form with React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email / Username Field */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Email Address *
              </label>
              <input
                type="text"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  validate: (value) => {
                    if (!value || !value.trim()) return 'Email address is required';
                    if (value.includes('@') && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                      return 'Please enter a valid email address';
                    }
                    return true;
                  }
                })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              {errors.email && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field with Show / Hide Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setActiveView('forgot_password')}
                  style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 14px',
                    borderRadius: '8px',
                    border: errors.password ? '1px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                {/* Show / Hide Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              style={{ padding: '14px', fontSize: '0.875rem', fontWeight: 800 }}
            >
              {isSubmitting ? 'Authenticating...' : (roleMode === 'client' ? 'Sign In as Client Admin' : 'Sign In to Account')}
            </Button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 10px 0', color: '#9ca3af' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ padding: '0 10px', color: '#6b7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1.5px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', fontSize: '0.8125rem', color: '#6b7280' }}>
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => setActiveView('register')}
              style={{ fontWeight: 800, color: '#0f1115', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Create an account
            </button>
          </div>

          {/* Discreet small option for admin/client access */}
          <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f3f4f6' }}>
            <button
              type="button"
              onClick={() => {
                setRoleMode(roleMode === 'client' ? 'user' : 'client');
                setAuthError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.6875rem',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#4b5563'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            >
              <span>🔒</span>
              <span>{roleMode === 'client' ? 'Return to Customer Sign In' : 'Store Operations / Admin Portal'}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * RegisterPage Component (Standalone Page)
 * Validated via React Hook Form:
 * Full name, Email, Phone, Password, Confirm password, Terms checkbox.
 */
export const RegisterPage = () => {
  const { register: registerUser, loginWithGoogle, registerAdmin, setActiveView, showToast } = useStore();
  const [roleMode, setRoleMode] = useState('customer'); // 'customer' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regError, setRegError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      adminKey: 'URBANCART-ADMIN',
      password: '',
      confirmPassword: '',
      terms: false
    },
    mode: 'onBlur'
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setRegError('');
    try {
      if (roleMode === 'admin') {
        if (data.adminKey !== 'URBANCART-ADMIN') {
          setRegError('Invalid Staff Authorization Key. Use URBANCART-ADMIN.');
          return;
        }
        await registerAdmin({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          adminKey: data.adminKey
        });
        showToast('Admin / Client account registered successfully!', 'success');
        setActiveView('admin_dashboard');
      } else {
        await registerUser({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password
        });
        setActiveView('account');
      }
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    setRegError('');
    try {
      const user = await loginWithGoogle();
      showToast(`Welcome, ${user.name}! Account connected with Google.`, 'success');
      setActiveView('account');
    } catch (err) {
      setRegError(err.message || 'Google registration failed.');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
              CREATE YOUR PROFILE
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0 6px 0' }}>
              {roleMode === 'admin' ? 'Register Admin / Client' : 'Create User Account'}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
              {roleMode === 'admin' ? 'Create store operator clearance to manage orders and catalog.' : 'Join thousands of lifestyle enthusiasts and unlock member privileges.'}
            </p>
          </div>



          {regError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.75rem',
              marginBottom: '18px',
              fontWeight: 600
            }}>
              {regError}
            </div>
          )}

          {/* Registration Form with React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Julian Mercer"
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: errors.fullName ? '1px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              {errors.fullName && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              {errors.email && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 234-5678"
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 8,
                    message: 'Please enter a valid phone number'
                  }
                })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: errors.phone ? '1px solid #dc2626' : '1px solid #d1d5db',
                  fontSize: '0.8125rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              {errors.phone && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                  {errors.phone.message}
                </span>
              )}
            </div>


            {/* Password */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '8px',
                    border: errors.password ? '1px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '8px',
                    border: errors.confirmPassword ? '1px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '2px', display: 'block', fontWeight: 600 }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Admin Key (when registering as Admin / Client) */}
            {roleMode === 'admin' && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', display: 'block', marginBottom: '4px' }}>
                  Staff Authorization Key *
                </label>
                <input
                  type="text"
                  placeholder="e.g. URBANCART-ADMIN"
                  {...register('adminKey', {
                    required: 'Staff Authorization Key is required for Admin / Client registration'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: errors.adminKey ? '1px solid #dc2626' : '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '0.6875rem', color: '#059669', display: 'block', marginTop: '3px' }}>
                  Default key: <strong>URBANCART-ADMIN</strong>
                </span>
              </div>
            )}

            {/* Terms Checkbox */}
            <div style={{ marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '2px' }}
                  {...register('terms', {
                    required: 'You must agree to the Terms & Conditions and Privacy Policy'
                  })}
                />
                <span>
                  I agree to the <strong style={{ color: '#111827' }}>Terms &amp; Conditions</strong> and acknowledge the <strong style={{ color: '#111827' }}>Privacy Policy</strong>.
                </span>
              </label>
              {errors.terms && (
                <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                  {errors.terms.message}
                </span>
              )}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              style={{ marginTop: '8px', padding: '14px', fontSize: '0.875rem', fontWeight: 800 }}
            >
              {isSubmitting ? 'Processing...' : (roleMode === 'admin' ? 'Register as Admin / Client' : 'Register Account')}
            </Button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 10px 0', color: '#9ca3af' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ padding: '0 10px', color: '#6b7280', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                or register with
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isSubmitting}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1.5px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#1f2937',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <GoogleIcon size={18} />
              <span>Sign Up with Google</span>
            </button>
          </form>

          {/* Link to Login */}
          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', fontSize: '0.8125rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setActiveView('login')}
              style={{ fontWeight: 800, color: '#0f1115', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign in
            </button>
          </div>

          {/* Discreet small option for admin/client registration */}
          <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f3f4f6' }}>
            <button
              type="button"
              onClick={() => {
                setRoleMode(roleMode === 'admin' ? 'customer' : 'admin');
                setRegError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.6875rem',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#4b5563'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            >
              <span>🔒</span>
              <span>{roleMode === 'admin' ? 'Return to Customer Registration' : 'Store Operations / Admin Registration'}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * ForgotPasswordPage Component (Standalone Page)
 * Features:
 * - Email input with React Hook Form validation
 * - Send reset link button
 * - Success feedback confirmation view
 * - Return to login navigation
 */
export const ForgotPasswordPage = () => {
  const { setActiveView, showToast } = useStore();
  const [resetSentTo, setResetSentTo] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { email: '' },
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    // Simulate sending password reset email
    await new Promise(resolve => setTimeout(resolve, 800));
    setResetSentTo(data.email);
    showToast(`Password reset link sent to ${data.email}`, 'success');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#fafaf9',
          border: '1px solid #e5e7eb',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: 'var(--shadow-card)'
        }}>
          {resetSentTo ? (
            /* Success State */
            <div style={{ textAlign: 'center' }}>
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
                <CheckCircleIcon size={36} />
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                Reset Link Sent
              </h2>

              <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '24px' }}>
                We have dispatched a secure password reset link to <strong style={{ color: '#111827' }}>{resetSentTo}</strong>.
                Please check your inbox (and spam folder) and follow the link to establish your new password.
              </p>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setActiveView('login')}
              >
                Return to Login
              </Button>
            </div>
          ) : (
            /* Forgot Password Form */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase' }}>
                  PASSWORD RECOVERY
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0 6px 0' }}>
                  Forgot Password?
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                  Enter your registered email address below and we'll transmit instructions to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Email Input */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                      fontSize: '0.8125rem',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  {errors.email && (
                    <span style={{ fontSize: '0.6875rem', color: '#dc2626', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  style={{ padding: '14px', fontSize: '0.875rem', fontWeight: 800 }}
                >
                  {isSubmitting ? 'Transmitting Link...' : 'Send Reset Link'}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', fontSize: '0.8125rem' }}>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => setActiveView('login')}
                  style={{ fontWeight: 800, color: '#0f1115', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Back to login
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
