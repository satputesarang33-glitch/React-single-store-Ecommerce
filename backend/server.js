import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Step 1: Import Database Configuration
import connectDB from './Config/ConnetDB.js';

// Step 2: Import Modular Route Handlers
import authRoute from './Route/authRoute.js';
import productRoute from './Route/productRoute.js';
import orderRoute from './Route/orderRoute.js';
import adminRoute from './Route/adminRoute.js';

// Step 3: Import Seeder & Error Middleware
import { seedDatabase } from './Seed/seedData.js';
import { notFoundHandler, errorHandler } from './Middleware/errorMiddleware.js';
import { verifySmtpConnection } from './Service/emailService.js';

// ── Initialize Environment Variables ──
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * ============================================================================
 * Step 4: Middleware Pipeline
 * ============================================================================
 */

// 4a. Enable Cross-Origin Resource Sharing (CORS) for frontend React client
app.use(cors({
  origin: [
    'http://localhost:3005',
    'http://localhost:3000',
    'http://127.0.0.1:3005',
    'http://127.0.0.1:3000'
  ],
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 4b. Body Parsing Middleware (JSON payloads & URL-encoded forms with image support)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser());

/**
 * ============================================================================
 * Step 5: Core Endpoints & Health Check Probe
 * ============================================================================
 */

// Health check endpoint for uptime monitors & frontend checks
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    server: 'UrbanCart E-Commerce API',
    version: '1.0.0',
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Manual database re-seed endpoint for development & testing
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seed operation executed successfully.' });
  } catch (err) {
    next(err);
  }
});

/**
 * ============================================================================
 * Step 6: Modular API Routes
 * ============================================================================
 */
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/admin', adminRoute);

/**
 * ============================================================================
 * Step 7: 404 & Centralized Error Handlers
 * ============================================================================
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * ============================================================================
 * Step 8: Connect Database & Launch Server
 * ============================================================================
 */
const startServer = async () => {
  let emailStatus = 'Resend API Connected (Live email delivery active)';
  let dbStatus = 'MongoDB Atlas Connected';

  // 8a. Verify SMTP / Resend Email connectivity
  try {
    const emailRes = await verifySmtpConnection();
    if (emailRes?.message) {
      emailStatus = emailRes.message;
    }
  } catch (err) {
    emailStatus = 'Resilient local simulation mode';
  }

  // 8b. Connect to MongoDB Atlas
  try {
    const conn = await connectDB();
    if (conn) {
      await seedDatabase();
      dbStatus = 'MongoDB Atlas Connected';
    } else {
      dbStatus = 'Running in resilient fallback mode';
    }
  } catch (error) {
    dbStatus = 'Running in resilient fallback mode';
  }

  // 8c. Listen for incoming HTTP connections
  app.listen(PORT, () => {
    const w = 66;
    const pad = (s) => '  │  ' + s + ' '.repeat(Math.max(0, w - s.length)) + '  │';
    console.log('\n  ┌' + '─'.repeat(w + 4) + '┐');
    console.log(pad('UrbanCart Backend API Core'));
    console.log(pad(''));
    console.log(pad(`➜ Server:    http://localhost:${PORT}`));
    console.log(pad(`➜ Health:    http://localhost:${PORT}/api/health`));
    console.log(pad(`➜ Email:     ${emailStatus}`));
    console.log(pad(`➜ Database:  ${dbStatus}`));
    console.log('  └' + '─'.repeat(w + 4) + '┘\n');
  });
};

startServer();