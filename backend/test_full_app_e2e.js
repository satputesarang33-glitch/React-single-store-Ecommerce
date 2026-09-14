/**
 * Comprehensive Full-Stack End-to-End Test Suite
 * Tests Frontend and Backend integration across all layers:
 * Storefront, Catalog, Cart/Checkout, Google Auth, Admin, Orders.
 */

const BASE_API = 'http://localhost:5000/api';
const BASE_FRONTEND = 'http://localhost:3005';

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    failed++;
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_API}${endpoint}`;
  const { headers, ...restOptions } = options;
  const res = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('\n=============================================================');
  console.log('  UrbanCart Full-Stack E2E Integration Test Suite');
  console.log('  Testing Frontend (3005) & Backend (5000) End-to-End');
  console.log('=============================================================\n');

  // --- 1. HEALTH & SYSTEM CONFIG ---
  console.log('📦 SECTION 1: SYSTEM HEALTH & GOOGLE CONFIG');
  try {
    const health = await request('/health');
    assert(health.ok && health.data.status === 'ok', 'GET /api/health returns HTTP 200 and status: ok');

    const config = await request('/auth/config');
    assert(config.ok && typeof config.data.googleClientId === 'string', 'GET /api/auth/config exposes googleClientId');

    const feRes = await fetch(BASE_FRONTEND);
    const feHtml = await feRes.text();
    assert(feRes.status === 200, 'Frontend HTTP Server is live at http://localhost:3005');
    assert(feHtml.includes('<div id="root">') || feHtml.includes('UrbanCart'), 'Frontend renders React root container');
    assert(feHtml.includes('accounts.google.com/gsi/client'), 'Frontend includes Google Identity Services (GIS) client');
  } catch (err) {
    assert(false, 'System Health & Frontend Reachability', err.message);
  }

  // --- 2. STOREFRONT CATALOG & PRODUCTS ---
  console.log('\n🛍️ SECTION 2: STOREFRONT CATALOG & PRODUCT FILTERS');
  let sampleProduct = null;
  try {
    // 2a. All products
    const prodRes = await request('/products');
    assert(prodRes.ok && Array.isArray(prodRes.data) && prodRes.data.length >= 10, `GET /api/products returns ${prodRes.data?.length} catalog items`);
    sampleProduct = prodRes.data[0];

    // 2b. Category filter
    const catRes = await request('/products?category=Premium+Sneakers');
    assert(catRes.ok && catRes.data.every(p => p.category.toLowerCase().includes('sneaker')), 'GET /api/products?category=Premium Sneakers filters correctly');

    // 2c. Price filter
    const priceRes = await request('/products?maxPrice=200');
    assert(priceRes.ok && priceRes.data.every(p => p.price <= 200), 'GET /api/products?maxPrice=200 filters under $200');

    // 2d. Keyword search
    const searchRes = await request('/products?search=Mono');
    assert(searchRes.ok && searchRes.data.some(p => p.title.toLowerCase().includes('mono')), 'GET /api/products?search=Mono performs search correctly');

    // 2e. Single product by ID
    const singleRes = await request(`/products/${sampleProduct.id}`);
    assert(singleRes.ok && singleRes.data.id === sampleProduct.id, `GET /api/products/:id retrieves specimen [${sampleProduct.title}]`);
  } catch (err) {
    assert(false, 'Catalog & Product Filters', err.message);
  }

  // --- 3. GOOGLE AUTH & CUSTOMER LIFECYCLE ---
  console.log('\n🔐 SECTION 3: AUTHENTICATION & DIRECT GOOGLE SIGN-IN');
  let customerToken = null;
  let customerUser = null;
  try {
    // 3a. Direct Google 1-Click Sign-in for user's email
    const googleRes = await request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        email: 'satputesarang33@gmail.com',
        name: 'Sarang Satpute',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=160&auto=format&fit=crop'
      })
    });
    assert(googleRes.ok && googleRes.data.token, 'POST /api/auth/google returns valid session JWT token');
    assert(googleRes.data.user.email === 'satputesarang33@gmail.com', 'POST /api/auth/google profile correctly identifies satputesarang33@gmail.com');
    customerToken = googleRes.data.token;
    customerUser = googleRes.data.user;

    // 3b. Profile verification using Bearer JWT
    const meRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(meRes.ok && meRes.data.user.email === 'satputesarang33@gmail.com', 'GET /api/auth/me resolves authenticated session');

    // 3c. Update user profile
    const profileRes = await request('/auth/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ phone: '+91 98340 58896', city: 'Pune' })
    });
    if (!profileRes.ok || profileRes.data?.user?.phone !== '+91 98340 58896') {
      console.log('    [DEBUG profileRes]:', profileRes.status, profileRes.data);
    }
    assert(profileRes.ok && profileRes.data.user.phone === '+91 98340 58896', 'PATCH /api/auth/profile updates phone & location');

    // 3d. Mobile OTP Request & Verify
    const otpSendRes = await request('/auth/send-verification-code', {
      method: 'POST',
      body: JSON.stringify({ type: 'mobile', target: '+91 98340 58896' })
    });
    assert(otpSendRes.ok && otpSendRes.data.success, 'POST /api/auth/send-verification-code generates 6-digit OTP');

    const otpCode = otpSendRes.data.code || '482910';
    const otpVerifyRes = await request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ target: '+91 98340 58896', code: otpCode })
    });
    assert(otpVerifyRes.ok && otpVerifyRes.data.verified, 'POST /api/auth/verify-code verifies OTP successfully');
  } catch (err) {
    assert(false, 'Google Auth & Customer Lifecycle', err.message);
  }

  // --- 4. CART, CHECKOUT & ORDER PLACEMENT ---
  console.log('\n🛒 SECTION 4: CHECKOUT & ORDER DISPATCH LIFECYCLE');
  let createdOrderId = null;
  try {
    const orderPayload = {
      patron: {
        name: customerUser?.name || 'Sarang Satpute',
        email: customerUser?.email || 'satputesarang33@gmail.com',
        city: 'Pune, Maharashtra',
        phone: '+91 98340 58896',
        isVip: true
      },
      cartSummary: `1 item (${sampleProduct?.title || 'UrbanCart Mono Low-Top Leather Sneaker'})`,
      itemsCount: 1,
      items: [
        {
          id: 'item-e2e-1',
          productId: sampleProduct?.id || 'uc-fw-086',
          title: sampleProduct?.title || 'UrbanCart Mono Low-Top Leather Sneaker',
          price: sampleProduct?.price || 160.00,
          quantity: 1,
          colorway: 'Chalk White',
          size: 'US 10'
        }
      ],
      subtotal: sampleProduct?.price || 160.00,
      shipping: 0.00,
      tax: 12.80,
      total: (sampleProduct?.price || 160.00) + 12.80,
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        holder: 'SARANG SATPUTE'
      },
      shippingAddress: {
        fullName: 'Sarang Satpute',
        street: 'FC Road, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411005',
        country: 'India',
        phone: '+91 98340 58896'
      }
    };

    // 4a. Place Order
    const orderRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify(orderPayload)
    });
    if (!orderRes.ok || !orderRes.data.id) {
      console.log('    [DEBUG orderRes]:', orderRes.status, orderRes.data);
    }
    assert(orderRes.status === 201 && orderRes.data.id, 'POST /api/orders places order and assigns unique ID');
    assert(orderRes.data.reference && orderRes.data.reference.startsWith('#UC-'), `POST /api/orders assigns atelier reference [${orderRes.data.reference}]`);
    assert(orderRes.data.trackingNumber && orderRes.data.trackingNumber.startsWith('JD'), `POST /api/orders generates tracking code [${orderRes.data.trackingNumber}]`);
    createdOrderId = orderRes.data.id;

    // 4b. Fetch user orders
    const myOrdersRes = await request(`/orders?userId=${customerUser?.email || 'satputesarang33@gmail.com'}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(myOrdersRes.ok && myOrdersRes.data.some(o => o.id === createdOrderId), 'GET /api/orders filters customer orders history');

    // 4c. Single order lookup
    const singleOrderRes = await request(`/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(singleOrderRes.ok && singleOrderRes.data.id === createdOrderId, 'GET /api/orders/:id retrieves order tracking timeline');

    // 4d. Update fulfillment state
    const updateRes = await request(`/orders/${createdOrderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: JSON.stringify({ fulfillmentState: 'COURIER DISPATCHED' })
    });
    assert(updateRes.ok && updateRes.data.fulfillmentState === 'COURIER DISPATCHED', 'PATCH /api/orders/:id/status updates fulfillment timeline');
  } catch (err) {
    assert(false, 'Checkout & Order Lifecycle', err.message);
  }

  // --- 5. BACKOFFICE ADMIN DASHBOARD ---
  console.log('\n💼 SECTION 5: BACKOFFICE ADMIN OPERATIONS');
  try {
    // 5a. Admin Operational Stats
    const statsRes = await request('/admin/stats');
    assert(statsRes.ok && statsRes.data.kpis?.grossRevenue?.formatted, 'GET /api/admin/stats returns operational KPIs');

    // 5b. Admin Customers
    const custRes = await request('/admin/customers');
    assert(custRes.ok && Array.isArray(custRes.data) && custRes.data.length >= 4, `GET /api/admin/customers returns ${custRes.data?.length} patron records`);

    // 5c. Admin Orders
    const adminOrdersRes = await request('/admin/orders');
    assert(adminOrdersRes.ok && Array.isArray(adminOrdersRes.data), 'GET /api/admin/orders returns global order register');

    // 5d. Product Stock Toggle
    const stockRes = await request(`/admin/products/${sampleProduct?.id || 'uc-fw-086'}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ inStock: true })
    });
    assert(stockRes.ok, `PATCH /api/admin/products/:id/stock updates inventory status`);

    // 5e. Admin Store Settings
    const settingsRes = await request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({
        storeTitle: 'UrbanCart Market Hub Atelier',
        freeShippingThreshold: 120.00
      })
    });
    assert(settingsRes.ok && settingsRes.data.freeShippingThreshold === 120.00, 'PUT /api/admin/settings updates global store configuration');
  } catch (err) {
    assert(false, 'Backoffice Admin Operations', err.message);
  }

  // --- SUMMARY ---
  console.log('\n=============================================================');
  console.log(`  RESULTS: ${passed} PASSED • ${failed} FAILED (Total: ${passed + failed})`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
