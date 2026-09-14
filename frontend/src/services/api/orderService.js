import { apiClient, mockDelay } from './apiClient';
import { initialOrders } from '../../data/orders';

class OrderService {
  async getOrders(userId = null) {
    if (!apiClient.useMock) {
      const endpoint = userId ? `/orders?userId=${userId}` : '/orders';
      return await apiClient.get(endpoint);
    }
    await mockDelay(200);
    return [...initialOrders];
  }

  async getOrderById(id) {
    if (!apiClient.useMock) {
      return await apiClient.get(`/orders/${id}`);
    }
    await mockDelay(150);
    return initialOrders.find(o => o.id === id || o.reference === id) || null;
  }

  async createOrder(orderPayload) {
    if (!apiClient.useMock) {
      return await apiClient.post('/orders', orderPayload);
    }
    await mockDelay(400);
    const orderRef = `#UC-${Math.floor(10000 + Math.random() * 90000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      reference: orderRef,
      timestamp: 'Just now',
      date: new Date().toISOString(),
      paymentStatus: 'CAPTURED',
      fulfillmentState: 'PREPARING SHIPMENT',
      trackingNumber: `JD${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      timeline: [
        { label: 'Order Placed & Verified', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { label: 'Quality & Craftsmanship Inspection', date: 'In progress', done: true },
        { label: 'Courier Handover', date: 'Pending SLA dispatch', done: false },
        { label: 'Delivered to Atelier Residence', date: 'Estimated 2-3 days', done: false }
      ],
      ...orderPayload
    };
    return newOrder;
  }

  async updateOrderStatus(orderId, fulfillmentState) {
    if (!apiClient.useMock) {
      return await apiClient.patch(`/orders/${orderId}/status`, { fulfillmentState });
    }
    await mockDelay(250);
    return { orderId, fulfillmentState, updated: true };
  }
}

export const orderService = new OrderService();
