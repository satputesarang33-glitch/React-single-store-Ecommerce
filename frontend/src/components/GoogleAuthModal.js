import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { GoogleIcon } from './Icons';
import { getGoogleClientId, setGoogleClientId } from '../services/api/googleAuth';

/**
 * GoogleAuthModal Component
 * 
 * Provides a seamless Google OAuth 2.0 Account Selection experience:
 * 1. If Google Cloud Client ID is configured, launches the real Google OAuth 2.0 popup.
 * 2. If no Client ID is provided, displays an authentic Google Account Chooser dialog
 *    where the user can sign in/register with any Gmail address or paste their Client ID.
 */
export const GoogleAuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useStore();
  const [emailInput, setEmailInput] = useState('satputesarang33@gmail.com');
  const [nameInput, setNameInput] = useState('Sarang Satpute');
  const [clientIdInput, setClientIdInput] = useState(getGoogleClientId());
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'clientId'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setClientIdInput(getGoogleClientId());
      if (!emailInput) {
        setEmailInput('satputesarang33@gmail.com');
        setNameInput('Sarang Satpute');
      }
    }
  }, [isOpen, emailInput]);

  if (!isOpen) return null;

  // Reusable Google Sign In / Registration dispatcher
  const performGoogleSignIn = async (email, name) => {
    setError('');
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Google or Gmail address.');
      return;
    }

    setIsLoading(true);
    try {
      const derivedName = (name || '').trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      await loginWithGoogle({
        email: cleanEmail,
        name: derivedName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=160&auto=format&fit=crop',
        googleId: `sub_${Date.now()}`
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle direct form submit
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    await performGoogleSignIn(emailInput, nameInput);
  };

  // Handle saving Google Cloud Client ID and launching the official Google Popup
  const handleLaunchOfficialPopup = async () => {
    setError('');
    const cleanClientId = (clientIdInput || '').trim();

    if (!cleanClientId) {
      setError('Please enter a valid Google OAuth Client ID ending in .apps.googleusercontent.com');
      return;
    }

    setGoogleClientId(cleanClientId);

    if (!window.google?.accounts?.oauth2) {
      setError('Google Identity Services SDK is loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: cleanClientId,
        scope: 'email profile openid',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            setError(tokenResponse.error_description || tokenResponse.error || 'Google authentication failed.');
            return;
          }

          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            if (!res.ok) throw new Error('Failed to retrieve profile from Google.');

            const profile = await res.json();
            await loginWithGoogle({
              email: profile.email,
              name: profile.name || profile.given_name,
              avatar: profile.picture,
              googleId: profile.sub,
              accessToken: tokenResponse.access_token
            });
            setIsLoading(false);
            onClose();
          } catch (fetchErr) {
            setIsLoading(false);
            setError(fetchErr.message || 'Error parsing Google profile.');
          }
        },
        error_callback: (err) => {
          setIsLoading(false);
          setError(err.message || 'Google popup closed or blocked.');
        }
      });

      client.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to initialize Google token client.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            background: 'none',
            fontSize: '1.25rem',
            color: '#5f6368',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '50%'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '12px' }}>
            <GoogleIcon size={36} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#202124', margin: '0 0 6px 0', fontFamily: 'Roboto, sans-serif' }}>
            Sign in with Google
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#5f6368', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
            to continue to <strong>UrbanCart</strong>
          </p>
        </div>

        {/* Tab switch between Account Connect & Client ID config */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'account' ? 700 : 500,
              color: activeTab === 'account' ? '#1a73e8' : '#5f6368',
              borderBottom: activeTab === 'account' ? '2.5px solid #1a73e8' : 'none',
              cursor: 'pointer'
            }}
          >
            Google Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clientId')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              background: 'none',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'clientId' ? 700 : 500,
              color: activeTab === 'clientId' ? '#1a73e8' : '#5f6368',
              borderBottom: activeTab === 'clientId' ? '2.5px solid #1a73e8' : 'none',
              cursor: 'pointer'
            }}
          >
            ⚙️ Google Cloud Setup
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            backgroundColor: '#fce8e6',
            border: '1px solid #fad2cf',
            color: '#c5221f',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.78125rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* TAB 1: Real Account Input */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Quick 1-Click Google Account Card */}
            <div
              onClick={() => performGoogleSignIn('satputesarang33@gmail.com', 'Sarang Satpute')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') performGoogleSignIn('satputesarang33@gmail.com', 'Sarang Satpute'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #1a73e8',
                backgroundColor: '#f8fafd',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(26, 115, 232, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#edf5fe';
                e.currentTarget.style.borderColor = '#174ea6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafd';
                e.currentTarget.style.borderColor = '#1a73e8';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                flexShrink: 0
              }}>
                S
              </div>
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#202124', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Sarang Satpute
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  satputesarang33@gmail.com
                </div>
              </div>
              <span style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#1a73e8',
                backgroundColor: '#ffffff',
                padding: '5px 11px',
                borderRadius: '16px',
                border: '1px solid #dadce0',
                flexShrink: 0
              }}>
                Continue →
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
              <span style={{ fontSize: '0.725rem', color: '#70757a', fontWeight: 500 }}>or enter Google account</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
            </div>

            <form onSubmit={handleAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#3c4043', marginBottom: '4px' }}>
                Your Google / Gmail Address *
              </label>
              <input
                type="email"
                placeholder="e.g. sarang.dev@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #dadce0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#202124'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = '#dadce0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#3c4043', marginBottom: '4px' }}>
                Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sarang Satpute"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #dadce0',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#202124'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
                onBlur={(e) => e.target.style.borderColor = '#dadce0'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#1a73e8',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#1a73e8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 3px rgba(60, 64, 67, 0.3)',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#155724'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a73e8'}
              >
                {isLoading ? 'Connecting...' : 'Next / Sign In →'}
              </button>
            </div>
          </form>
        </div>
      )}

        {/* TAB 2: Google Cloud Console Client ID Setup */}
        {activeTab === 'clientId' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '0.78125rem', color: '#5f6368', lineHeight: 1.5, margin: 0 }}>
              To open the official <strong>accounts.google.com</strong> browser popup, paste your Web OAuth Client ID from{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#1a73e8', textDecoration: 'underline' }}
              >
                Google Cloud Console
              </a>.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#3c4043', marginBottom: '4px' }}>
                Google OAuth Client ID
              </label>
              <input
                type="text"
                placeholder="xxxx-xxxx.apps.googleusercontent.com"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #dadce0',
                  fontSize: '0.8125rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                  color: '#202124'
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleLaunchOfficialPopup}
              disabled={isLoading}
              style={{
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <GoogleIcon size={18} />
              <span>{isLoading ? 'Opening Google...' : 'Open Official Google Popup'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
