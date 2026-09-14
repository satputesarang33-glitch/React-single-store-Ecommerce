/**
 * Simple Terminal Email Dispatcher
 * Run with: npm run email  OR  node send_test_email.js
 */

import { sendOtpEmail, sendWelcomeEmail } from './Service/emailService.js';

const targetEmail = process.argv[2] || 'satputesarang33@gmail.com';
const action = process.argv[3] || 'otp'; // 'otp' or 'welcome'

console.log('\n┌────────────────────────────────────────────────────────┐');
console.log('│  UrbanCart Terminal Email Dispatcher                   │');
console.log('└────────────────────────────────────────────────────────┘\n');
console.log(`  Sending ${action.toUpperCase()} to: \x1b[36m${targetEmail}\x1b[0m...`);

async function run() {
  if (action === 'welcome') {
    const res = await sendWelcomeEmail(targetEmail, 'Sarang Satpute');
    if (res.success) {
      console.log(`  \x1b[32m✔ Success!\x1b[0m Welcome email dispatched via ${res.provider?.toUpperCase() || 'RESEND'}.`);
      console.log(`  Message ID: \x1b[33m${res.messageId}\x1b[0m\n`);
    } else {
      console.log(`  \x1b[31m✖ Error:\x1b[0m ${res.error}\n`);
    }
  } else {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const res = await sendOtpEmail(targetEmail, code, 'Terminal Verification');
    if (res.success) {
      console.log(`  \x1b[32m✔ Success!\x1b[0m OTP code [${code}] dispatched via ${res.provider?.toUpperCase() || 'RESEND'}.`);
      console.log(`  Message ID: \x1b[33m${res.messageId}\x1b[0m\n`);
    } else {
      console.log(`  \x1b[31m✖ Error:\x1b[0m ${res.error}\n`);
    }
  }
}

run().catch(err => console.error('Error:', err));
