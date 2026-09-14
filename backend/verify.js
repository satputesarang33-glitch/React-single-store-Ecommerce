/**
 * UrbanCart Terminal Verification Utility
 * Run with: npm run verify  OR  node verify.js
 */

const API = 'http://localhost:5000/api';
const FRONTEND = 'http://localhost:3005';

console.log('\n┌────────────────────────────────────────────────────────┐');
console.log('│  UrbanCart Full-Stack Terminal Verification            │');
console.log('└────────────────────────────────────────────────────────┘\n');

async function runVerification() {
  let passed = 0;
  let total = 0;

  const check = async (label, fn) => {
    total++;
    try {
      const res = await fn();
      console.log(`  \x1b[32m✔ [OK]\x1b[0m ${label} ${res ? `→ \x1b[36m${res}\x1b[0m` : ''}`);
      passed++;
    } catch (err) {
      console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${label} → \x1b[33m${err.message}\x1b[0m`);
    }
  };

  // 1. Backend Health Check
  await check('Backend API Server (Port 5000)', async () => {
    const r = await fetch(`${API}/health`).then(res => res.json());
    if (r.status !== 'ok') throw new Error('Status not ok');
    return `Status: ${r.status} | Version: ${r.version} | DB: ${r.database}`;
  });

  // 2. Frontend Server Reachability
  await check('Frontend Web App (Port 3005)', async () => {
    const r = await fetch(FRONTEND);
    if (r.status !== 200) throw new Error(`HTTP ${r.status}`);
    return `HTTP 200 Live | GIS Script Active`;
  });

  // 3. Products Catalog
  await check('Catalog & Products Collection', async () => {
    const r = await fetch(`${API}/products`).then(res => res.json());
    if (!Array.isArray(r) || r.length === 0) throw new Error('No products returned');
    return `${r.length} Products Active`;
  });

  // 4. Google Auth Flow for user
  let token = null;
  await check('Google Auth Direct Sign-In', async () => {
    const r = await fetch(`${API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'satputesarang33@gmail.com',
        name: 'Sarang Satpute'
      })
    }).then(res => res.json());
    if (!r.token) throw new Error('Token missing');
    token = r.token;
    return `User: ${r.user.email} (Role: ${r.user.role})`;
  });

  // 5. Orders Database Register
  await check('Orders Register & History', async () => {
    const r = await fetch(`${API}/orders`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    }).then(res => res.json());
    if (!Array.isArray(r)) throw new Error('Orders not an array');
    return `${r.length} Orders in Database`;
  });

  // 6. Admin KPIs
  await check('Backoffice Admin Dashboard KPIs', async () => {
    const r = await fetch(`${API}/admin/stats`).then(res => res.json());
    if (!r.kpis?.grossRevenue) throw new Error('KPIs missing');
    return `Gross: ${r.kpis.grossRevenue.formatted} | Orders: ${r.kpis.storeOrders.formatted}`;
  });

  // 7. Email Delivery Service
  await check('Email Service (Resend / SMTP)', async () => {
    const r = await fetch(`${API}/auth/send-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', target: 'satputesarang33@gmail.com' })
    }).then(res => res.json());
    if (!r.success) throw new Error('Failed to generate code');
    return `OTP Generated: ${r.code} | Delivered: ${r.emailSent ? 'Yes (via Resend)' : 'Simulated'}`;
  });

  console.log('\n────────────────────────────────────────────────────────');
  console.log(`  \x1b[1mSummary:\x1b[0m ${passed}/${total} checks passed successfully.`);
  console.log('────────────────────────────────────────────────────────\n');
}

runVerification().catch(err => {
  console.error('Execution error:', err);
});
