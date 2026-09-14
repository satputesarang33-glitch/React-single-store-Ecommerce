/**
 * Comprehensive Automated End-to-End Authentication Verification Suite
 * Validates EVERY authentication method across Frontend and Backend:
 * 1. Health & Configuration
 * 2. Frontend Assets & GIS Integration
 * 3. One-Touch Google OAuth for satputesarang33@gmail.com
 * 4. Protected Session Query (GET /api/auth/me)
 * 5. Mobile Phone Number Login (+919834058896 from UI screenshot)
 * 6. Customer Registration (Name, Email, Password, Phone)
 * 7. Customer Email Login
 * 8. OTP Dispatch (Email & Mobile SMS simulation)
 * 9. OTP Code Verification
 * 10. Profile Update via Authenticated Token
 * 11. Password Reset
 * 12. Safe Logout
 */

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3005';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${message}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✖ [FAIL]\x1b[0m ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runFullAudit() {
  console.log('\n\x1b[1m\x1b[36m=================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m   UrbanCart Complete Authentication Suite — Full Method Audit   \x1b[0m');
  console.log('\x1b[1m\x1b[36m=================================================================\x1b[0m\n');

  try {
    // -------------------------------------------------------------
    // METHOD 1: Backend System Health
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 1/12] System Health & Service Status...\x1b[0m');
    const healthRes = await fetch(`${BACKEND_URL}/api/health`);
    assert(healthRes.ok, `Health endpoint responded with HTTP ${healthRes.status}`);
    const health = await healthRes.json();
    assert(health.status === 'ok', `System status is '${health.status}'`);
    console.log(`              Service: ${health.server} (v${health.version})\n`);

    // -------------------------------------------------------------
    // METHOD 2: Frontend Web App & GIS Script
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 2/12] Frontend Web App & Google Identity Services...\x1b[0m');
    const feRes = await fetch(FRONTEND_URL);
    assert(feRes.ok, `Frontend responded with HTTP ${feRes.status}`);
    const feHtml = await feRes.text();
    assert(feHtml.includes('UrbanCart'), `Served correct brand title in HTML`);
    assert(feHtml.includes('accounts.google.com/gsi/client'), `GIS Google Identity Services client script bundled`);
    console.log(`              Frontend is active on port 3005.\n`);

    // -------------------------------------------------------------
    // METHOD 3: One-Touch Google OAuth for satputesarang33@gmail.com
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 3/12] Google Sign-In / Register (satputesarang33@gmail.com)...\x1b[0m');
    const googleRes = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'satputesarang33@gmail.com',
        name: 'Sarang Satpute',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=160&auto=format&fit=crop',
        googleId: 'g_test_' + Date.now()
      })
    });
    assert(googleRes.ok, `Google login endpoint returned HTTP ${googleRes.status}`);
    const googleData = await googleRes.json();
    assert(googleData.success === true, `Response success is true`);
    assert(googleData.user.email === 'satputesarang33@gmail.com', `User email matches 'satputesarang33@gmail.com'`);
    assert(googleData.user.name === 'Sarang Satpute', `User name matches 'Sarang Satpute'`);
    assert(googleData.user.role === 'customer', `User role is 'customer'`);
    assert(googleData.user.authProvider === 'google', `User authProvider is 'google'`);
    assert(typeof googleData.token === 'string' && googleData.token.length > 20, `Valid signed JWT session issued`);
    const googleToken = googleData.token;
    console.log(`              JWT: ${googleToken.substring(0, 32)}...\n`);

    // -------------------------------------------------------------
    // METHOD 4: Authenticated Session Query (GET /api/auth/me)
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 4/12] Authenticated Token Verification (GET /api/auth/me)...\x1b[0m');
    const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${googleToken}` }
    });
    assert(meRes.ok, `GET /api/auth/me returned HTTP ${meRes.status}`);
    const meData = await meRes.json();
    assert(meData.success === true, `Session verification successful`);
    assert(meData.user.email === 'satputesarang33@gmail.com', `Session user matches 'satputesarang33@gmail.com'`);
    console.log(`              Authenticated profile verified.\n`);

    // -------------------------------------------------------------
    // METHOD 5: Mobile Phone Login (+919834058896 from screenshot)
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 5/12] Mobile Phone Number Login (+919834058896)...\x1b[0m');
    const phoneRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+919834058896',
        password: 'Password123!'
      })
    });
    assert(phoneRes.ok, `Phone login returned HTTP ${phoneRes.status}`);
    const phoneData = await phoneRes.json();
    assert(phoneData.success === true, `Phone login success is true`);
    assert(phoneData.user.phone === '+919834058896', `User phone stored as '+919834058896'`);
    assert(phoneData.user.role === 'customer', `Phone customer role confirmed`);
    console.log(`              Mobile login verified.\n`);

    // -------------------------------------------------------------
    // METHOD 6: Customer Registration
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 6/12] New Customer Registration...\x1b[0m');
    const regEmail = `customer.${Date.now()}@example.com`;
    const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: regEmail,
        phone: '+91 9876543210',
        password: 'SecurePassword123!'
      })
    });
    assert(regRes.ok, `Registration returned HTTP ${regRes.status}`);
    const regData = await regRes.json();
    assert(regData.success === true, `Registration success confirmed`);
    assert(regData.user.email === regEmail, `Registered email matches`);
    console.log(`              New customer created: ${regEmail}\n`);

    // -------------------------------------------------------------
    // METHOD 7: Standard Email Login
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 7/12] Standard Email & Password Login...\x1b[0m');
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regEmail,
        password: 'SecurePassword123!'
      })
    });
    assert(loginRes.ok, `Email login returned HTTP ${loginRes.status}`);
    const loginData = await loginRes.json();
    assert(loginData.success === true, `Email login success confirmed`);
    console.log(`              Email login authenticated.\n`);

    // -------------------------------------------------------------
    // METHOD 8: OTP Code Dispatch
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 8/12] OTP Verification Code Dispatch (SMS & Email)...\x1b[0m');
    const sendOtpRes = await fetch(`${BACKEND_URL}/api/auth/send-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'mobile',
        target: '+919834058896'
      })
    });
    assert(sendOtpRes.ok, `Send OTP returned HTTP ${sendOtpRes.status}`);
    const sendOtpData = await sendOtpRes.json();
    assert(sendOtpData.success === true, `OTP dispatch successful`);
    assert(typeof sendOtpData.code === 'string' && sendOtpData.code.length === 6, `6-digit verification code ${sendOtpData.code} issued`);
    console.log(`              OTP Code dispatched: ${sendOtpData.code}\n`);

    // -------------------------------------------------------------
    // METHOD 9: OTP Code Verification
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 9/12] OTP Code Verification...\x1b[0m');
    const verifyOtpRes = await fetch(`${BACKEND_URL}/api/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: '+919834058896',
        code: sendOtpData.code
      })
    });
    assert(verifyOtpRes.ok, `Verify OTP returned HTTP ${verifyOtpRes.status}`);
    const verifyOtpData = await verifyOtpRes.json();
    assert(verifyOtpData.verified === true, `OTP validation successful`);
    console.log(`              OTP verification confirmed.\n`);

    // -------------------------------------------------------------
    // METHOD 10: Authenticated Profile Update
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 10/12] User Profile Update (PATCH /api/auth/profile)...\x1b[0m');
    const updateRes = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleToken}`
      },
      body: JSON.stringify({
        phone: '+91 9834058896'
      })
    });
    assert(updateRes.ok, `Profile update returned HTTP ${updateRes.status}`);
    const updateData = await updateRes.json();
    assert(updateData.success === true, `Profile update confirmed`);
    console.log(`              Profile phone updated to: ${updateData.user.phone}\n`);

    // -------------------------------------------------------------
    // METHOD 11: Password Reset
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 11/12] Password Reset (POST /api/auth/reset-password)...\x1b[0m');
    const resetRes = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: regEmail,
        newPassword: 'BrandNewPassword456!'
      })
    });
    assert(resetRes.ok, `Password reset returned HTTP ${resetRes.status}`);
    const resetData = await resetRes.json();
    assert(resetData.success === true, `Password reset confirmed`);
    console.log(`              Password reset successful.\n`);

    // -------------------------------------------------------------
    // METHOD 12: Logout
    // -------------------------------------------------------------
    console.log('\x1b[33m[Method 12/12] User Logout (POST /api/auth/logout)...\x1b[0m');
    const logoutRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST'
    });
    assert(logoutRes.ok, `Logout returned HTTP ${logoutRes.status}`);
    const logoutData = await logoutRes.json();
    assert(logoutData.success === true, `Logout confirmed`);
    console.log(`              Session terminated cleanly.\n`);

    // -------------------------------------------------------------
    // FINAL AUDIT SUMMARY
    // -------------------------------------------------------------
    console.log('\x1b[1m\x1b[32m=================================================================\x1b[0m');
    console.log(`\x1b[1m\x1b[32m  ALL 12 METHODS PERFECT: ${passedTests} / ${totalTests} assertions verified! \x1b[0m`);
    console.log('\x1b[1m\x1b[32m=================================================================\x1b[0m\n');

  } catch (err) {
    console.error('\n\x1b[1m\x1b[31mAudit Failed with Error:\x1b[0m', err.message);
    process.exit(1);
  }
}

runFullAudit();
