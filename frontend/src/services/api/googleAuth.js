/**
 * Google Identity Services (GIS) OAuth 2.0 Authentication Client
 * 
 * Supports:
 * 1. Live Google OAuth 2.0 popup using window.google.accounts.oauth2.initTokenClient
 * 2. Automatic profile retrieval via Google's OAuth2 v3 userinfo endpoint
 * 3. Fallback prompt for Google Client ID setup or custom test account
 */

let backendGoogleClientId = '';

// Automatically sync GOOGLE_CLIENT_ID from backend .env
const fetchBackendClientId = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/auth/config`);
    if (res.ok) {
      const data = await res.json();
      if (data.googleClientId) {
        backendGoogleClientId = data.googleClientId.trim();
      }
    }
  } catch (err) {
    // Non-blocking
  }
};

fetchBackendClientId();

export const getGoogleClientId = () => {
  return (
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    backendGoogleClientId ||
    localStorage.getItem('urbancart_google_client_id') ||
    ''
  );
};

export const setGoogleClientId = (clientId) => {
  if (clientId) {
    localStorage.setItem('urbancart_google_client_id', clientId.trim());
  } else {
    localStorage.removeItem('urbancart_google_client_id');
  }
};

/**
 * Triggers the official Google OAuth 2.0 popup flow.
 * Returns a Promise that resolves with the verified Google user profile:
 * { email, name, avatar, googleId, accessToken }
 */
export const initiateGoogleOAuth = () => {
  return new Promise((resolve, reject) => {
    let clientId = getGoogleClientId();

    // If no client ID is configured, reject so caller can display the in-app Google modal
    if (!clientId) {
      return reject(new Error("NO_CLIENT_ID"));
    }

    // Verify Google Identity Services library is loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      return reject(
        new Error("Google Identity Services script is still loading. Please try again in a moment.")
      );
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            return reject(
              new Error(tokenResponse.error_description || tokenResponse.error || "Google authentication failed.")
            );
          }

          try {
            // Fetch real user profile from Google's userinfo endpoint
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });

            if (!res.ok) {
              throw new Error("Failed to fetch verified user profile from Google.");
            }

            const profile = await res.json();

            resolve({
              email: profile.email,
              name: profile.name || profile.given_name,
              avatar: profile.picture,
              googleId: profile.sub,
              accessToken: tokenResponse.access_token
            });
          } catch (fetchErr) {
            reject(fetchErr);
          }
        },
        error_callback: (err) => {
          reject(new Error(err.message || "Google popup error"));
        }
      });

      // Launch Google Account selection window
      client.requestAccessToken({ prompt: "consent" });
    } catch (err) {
      reject(err);
    }
  });
};
