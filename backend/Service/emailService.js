import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

// Initialize Resend Email Client if RESEND_API is configured
const resendApiKey = (process.env.RESEND_API || '').trim();
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_SENDER = 'UrbanCart <onboarding@resend.dev>';

/**
 * Configure Nodemailer Transporter for Gmail SMTP
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false, // TLS on port 587
  auth: {
    user: process.env.SMTP_USER || 'satputesarang33@gmail.com',
    pass: (process.env.SMTP_PASS || 'pgmxsiccjfefgwrp').replace(/"/g, '').trim(),
  },
  tls: {
    rejectUnauthorized: false
  }
});

const DEFAULT_SENDER = process.env.MAIL_FROM || 'UrbanCart <satputesarang33@gmail.com>';

/**
 * Verify Email Service Connectivity on Startup
 */
export const verifySmtpConnection = async () => {
  if (resendClient) {
    return { connected: true, provider: 'Resend', message: 'Resend API Connected (Live email delivery active)' };
  }

  try {
    await transporter.verify();
    return { connected: true, provider: 'SMTP', message: `Gmail SMTP Connected (${process.env.SMTP_USER || 'active'})` };
  } catch (err) {
    return { connected: false, provider: 'Local', message: 'Resilient local simulation mode' };
  }
};

/**
 * Send One-Time Password (OTP) Email
 */
export const sendOtpEmail = async (toEmail, otpCode, purpose = 'Verification') => {
  const subject = `🔐 ${otpCode} is your UrbanCart ${purpose} Code`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 28px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">UrbanCart</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Market Hub Security & Authentication</p>
      </div>
      <div style="padding: 36px 32px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Your One-Time Verification Code</h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          We received a request to verify your identity for <strong>${purpose}</strong>. Use the code below to complete this action:
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <div style="display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px 36px; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #0f172a; font-family: monospace;">
            ${otpCode}
          </div>
        </div>
        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          ⏳ This code will expire in <strong>5 minutes</strong>. If you did not request this verification, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #94a3b8;">
          <span>🔒 256-Bit SSL Encrypted</span> • <span>Market Hub Identity Protection</span>
        </div>
      </div>
    </div>
  `;
  const text = `Your UrbanCart ${purpose} code is: ${otpCode}. It expires in 5 minutes.`;

  // 1. Try Resend API (Fast, Reliable HTTP API)
  if (resendClient) {
    try {
      const res = await resendClient.emails.send({
        from: RESEND_SENDER,
        to: toEmail,
        subject,
        html,
        text
      });
      if (res.data?.id) {
        return { success: true, messageId: res.data.id, provider: 'resend' };
      }
    } catch (resendErr) {
    }
  }

  // 2. Fallback to Nodemailer Gmail SMTP
  try {
    const info = await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: toEmail,
      subject,
      html,
      text
    });
    return { success: true, messageId: info.messageId, provider: 'smtp' };
  } catch (err) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Welcome Email upon Registration or Google Sign-In
 */
export const sendWelcomeEmail = async (toEmail, userName) => {
  const subject = `🎉 Welcome to UrbanCart, ${userName}!`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 28px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">UrbanCart</h1>
        <p style="color: #38bdf8; margin: 6px 0 0 0; font-size: 13px; font-weight: 600;">Verified Market Hub Member</p>
      </div>
      <div style="padding: 36px 32px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Welcome aboard, ${userName}!</h2>
        <p style="font-size: 15px; color: #475569; line-height: 1.6;">
          Your UrbanCart customer account is now active and ready. Enjoy curated editorial collections, fast 1-click checkout, and order tracking.
        </p>
        <div style="margin: 26px 0; text-align: center;">
          <a href="http://localhost:3005" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px;">
            Start Shopping Now →
          </a>
        </div>
        <p style="font-size: 13px; color: #64748b;">
          Need assistance? Feel free to reply to this email or visit our Help Center.
        </p>
      </div>
    </div>
  `;
  const text = `Welcome to UrbanCart, ${userName}! Your account is ready. Visit http://localhost:3005 to start shopping.`;

  // 1. Try Resend API
  if (resendClient) {
    try {
      const res = await resendClient.emails.send({
        from: RESEND_SENDER,
        to: toEmail,
        subject,
        html,
        text
      });
      if (res.data?.id) {
        return { success: true, messageId: res.data.id, provider: 'resend' };
      }
    } catch (resendErr) {
    }
  }

  // 2. Fallback to Nodemailer Gmail SMTP
  try {
    const info = await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: toEmail,
      subject,
      html,
      text
    });
    return { success: true, messageId: info.messageId, provider: 'smtp' };
  } catch (err) {
    console.error(`❌ Failed to send welcome email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send Password Reset Confirmation Email
 */
export const sendPasswordResetEmail = async (toEmail, userName) => {
  const subject = `🔐 UrbanCart Password Updated Successfully`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">UrbanCart Security</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">Password Successfully Changed</h2>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">
          Hello ${userName || 'Customer'}, your account password was updated successfully. You can now sign in using your new credentials.
        </p>
        <p style="font-size: 12px; color: #94a3b8;">
          If you did not make this change, please contact customer support immediately.
        </p>
      </div>
    </div>
  `;
  const text = `Your UrbanCart password was successfully updated.`;

  if (resendClient) {
    try {
      const res = await resendClient.emails.send({
        from: RESEND_SENDER,
        to: toEmail,
        subject,
        html,
        text
      });
      if (res.data?.id) {
        return { success: true, messageId: res.data.id, provider: 'resend' };
      }
    } catch (e) {}
  }

  try {
    const info = await transporter.sendMail({
      from: DEFAULT_SENDER,
      to: toEmail,
      subject,
      html,
      text
    });
    return { success: true, messageId: info.messageId, provider: 'smtp' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export default {
  transporter,
  verifySmtpConnection,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
