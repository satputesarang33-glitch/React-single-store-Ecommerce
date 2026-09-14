/**
 * UrbanCart API Client Wrapper
 * 
 * Configured for seamless switching between local Mock Simulator and a real REST Backend.
 * To connect to a live backend:
 * 1. Set `USE_MOCK_API = false` below (or set REACT_APP_USE_MOCK=false in .env)
 * 2. Set REACT_APP_API_URL=http://your-backend-host:5000/api
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK_API = process.env.NODE_ENV === 'test' ? true : (process.env.REACT_APP_USE_MOCK !== 'false');

// Simulated network latency helper
export const mockDelay = (ms = 250) => {
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve();
  }
  return new Promise(resolve => setTimeout(resolve, ms));
};

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.useMock = USE_MOCK_API;
  }

  // Retrieve auth token from localStorage
  getToken() {
    return localStorage.getItem('urbancart_token') || null;
  }

  // Save auth token
  setToken(token) {
    if (token) {
      localStorage.setItem('urbancart_token', token);
    } else {
      localStorage.removeItem('urbancart_token');
    }
  }

  // Build standard request headers
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method for live backend
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err);
      throw err;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();
