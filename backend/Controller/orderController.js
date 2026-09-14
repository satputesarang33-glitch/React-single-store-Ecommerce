import mongoose from 'mongoose';
import Order from '../Model/OrderModel.js';
import { seedOrdersData } from '../Seed/seedData.js';

// In-memory orders store for instant resilience
let memoryOrders = JSON.parse(JSON.stringify(seedOrdersData));

/**
 * Fetch all orders or filter by customer
 * GET /api/orders
 */
export const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};

      if (userId) {
        query.$or = [
          { userId: userId },
          { 'patron.email': userId },
          { 'customer.email': userId }
        ];
      } else if (req.user && req.user.role !== 'admin') {
        query.$or = [
          { userId: req.user.id },
          { 'patron.email': req.user.email },
          { 'customer.email': req.user.email }
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    }

    // In-memory fallback
    let list = [...memoryOrders];
    const target = userId || (req.user && req.user.role !== 'admin' ? req.user.email || req.user.id : null);

    if (target) {
      const lower = target.toLowerCase();
      list = list.filter(o => 
        o.userId === target ||
        (o.patron?.email && o.patron.email.toLowerCase() === lower) ||
        (o.customer?.email && o.customer.email.toLowerCase() === lower) ||
        (o.shippingAddress?.email && o.shippingAddress.email.toLowerCase() === lower)
      );
    }

    return res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch single order by ID or Reference
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [
          { id: id },
          { reference: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Order with reference or ID '${id}' not found.`
        });
      }

      return res.json(order);
    }

    // In-memory fallback
    const ord = memoryOrders.find(o => o.id === id || o.reference === id);
    if (!ord) {
      return res.status(404).json({
        success: false,
        message: `Order with reference or ID '${id}' not found.`
      });
    }

    return res.json(ord);
  } catch (error) {
    next(error);
  }
};

/**
 * Place a new order upon checkout completion
 * POST /api/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const orderPayload = req.body || {};

    const orderId = orderPayload.id || `ord-${Date.now()}`;
    const orderRef = orderPayload.reference || `#UC-${Math.floor(10000 + Math.random() * 90000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const trackingNo = orderPayload.trackingNumber || `JD${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newOrder = {
      ...orderPayload,
      id: orderId,
      reference: orderRef,
      trackingNumber: trackingNo,
      userId: req.user ? req.user.id : (orderPayload.userId || null),
      timestamp: orderPayload.timestamp || 'Just now',
      date: orderPayload.date || new Date().toISOString(),
      fulfillmentState: orderPayload.fulfillmentState || 'PREPARING SHIPMENT',
      paymentStatus: orderPayload.paymentStatus || 'CAPTURED',
      timeline: orderPayload.timeline || [
        { label: 'Order Placed & Verified', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { label: 'Quality & Craftsmanship Inspection', date: 'In progress', done: true },
        { label: 'Courier Handover', date: 'Pending SLA dispatch', done: false },
        { label: 'Delivered to Atelier Residence', date: 'Estimated 2-3 days', done: false }
      ]
    };

    if (mongoose.connection.readyState === 1) {
      const dbOrder = await Order.create(newOrder);
      memoryOrders.unshift(newOrder);
      return res.status(201).json(dbOrder);
    }

    memoryOrders.unshift(newOrder);
    return res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * Update order fulfillment state
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fulfillmentState } = req.body;

    if (!fulfillmentState) {
      return res.status(400).json({
        success: false,
        message: 'Fulfillment state is required.'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findOne({
        $or: [
          { id: id },
          { reference: id },
          ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: `Order '${id}' not found.`
        });
      }

      order.fulfillmentState = fulfillmentState;
      
      if (order.timeline && Array.isArray(order.timeline)) {
        order.timeline.push({
          step: fulfillmentState,
          label: fulfillmentState,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          done: true,
          current: true,
          description: `Status updated to ${fulfillmentState}`
        });
      }

      await order.save();

      // Update memory order as well
      const memIdx = memoryOrders.findIndex(o => o.id === id || o.reference === id);
      if (memIdx !== -1) {
        memoryOrders[memIdx].fulfillmentState = fulfillmentState;
      }

      return res.json({
        orderId: id,
        fulfillmentState,
        updated: true,
        order
      });
    }

    // In-memory update
    const idx = memoryOrders.findIndex(o => o.id === id || o.reference === id);
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: `Order '${id}' not found.`
      });
    }

    memoryOrders[idx].fulfillmentState = fulfillmentState;
    if (memoryOrders[idx].timeline && Array.isArray(memoryOrders[idx].timeline)) {
      memoryOrders[idx].timeline.push({
        step: fulfillmentState,
        label: fulfillmentState,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        done: true,
        current: true,
        description: `Status updated to ${fulfillmentState}`
      });
    }

    return res.json({
      orderId: id,
      fulfillmentState,
      updated: true,
      order: memoryOrders[idx]
    });
  } catch (error) {
    next(error);
  }
};

