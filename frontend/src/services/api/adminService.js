/**
 * Admin Service (src/services/api/adminService.js)
 * 
 * Centralized API & business logic for all Backoffice Admin operations.
 * Easy to understand, maintain, and connect to a real backend.
 */

import { apiClient, mockDelay } from './apiClient';
import { operationalStats } from '../../data/stats';

class AdminService {
  /**
   * 1. Retrieve operational summary statistics & KPI metrics
   * Returns gross velocity, orders processed, AOV, on-time dispatch SLA.
   */
  async getOperationalStats() {
    if (!apiClient.useMock) {
      return await apiClient.get('/admin/stats');
    }
    await mockDelay(200);
    return operationalStats;
  }

  /**
   * 2. Retrieve all orders with optional filtering & search
   * @param {Object} filters - { status: 'all' | 'preparing' | 'dispatched' | 'delivered', search: string }
   */
  async getOrders(filters = {}) {
    if (!apiClient.useMock) {
      const params = new URLSearchParams(filters).toString();
      return await apiClient.get(`/admin/orders${params ? `?${params}` : ''}`);
    }
    await mockDelay(200);
    return []; // Handled with StoreContext orders in mock mode
  }

  /**
   * 3. Update the fulfillment state of an order
   * @param {string} orderId - e.g. "ord-1" or "#UC-10492-X"
   * @param {string} fulfillmentState - "PREPARING SHIPMENT" | "COURIER DISPATCHED" | "DELIVERED"
   */
  async updateOrderStatus(orderId, fulfillmentState) {
    if (!apiClient.useMock) {
      return await apiClient.patch(`/admin/orders/${orderId}/status`, { fulfillmentState });
    }
    await mockDelay(250);
    return { orderId, fulfillmentState, success: true };
  }

  /**
   * 4. Retrieve list of registered atelier patrons & spending statistics
   */
  async getCustomers() {
    if (!apiClient.useMock) {
      return await apiClient.get('/admin/customers');
    }
    await mockDelay(200);
    return [
      { id: 'c-1', name: 'Alex Vance', email: 'alex.vance@atelier-member.org', phone: '+1 (555) 234-8901', registrationDate: '2023-11-14', tier: 'ELITE', spent: 1840, ordersCount: 8, location: 'Stockholm, Sweden' },
      { id: 'c-2', name: 'Julian Mercer', email: 'j.mercer@atelier.co', phone: '+46 8 123 4567', registrationDate: '2024-01-20', tier: 'ELITE', spent: 1420, ordersCount: 5, location: 'Stockholm, Sweden' },
      { id: 'c-3', name: 'Elena Rostova', email: 'e.rostova@studio.at', phone: '+43 1 711 0022', registrationDate: '2024-03-08', tier: 'VIP', spent: 920, ordersCount: 3, location: 'Vienna, Austria' },
      { id: 'c-4', name: 'Kaelen Voss', email: 'k.voss@design.de', phone: '+49 30 901820', registrationDate: '2024-05-19', tier: 'MEMBER', spent: 480, ordersCount: 2, location: 'Berlin, Germany' },
      { id: 'c-5', name: 'Marc Becker', email: 'm.becker@atelier.ch', phone: '+41 44 632 1111', registrationDate: '2024-07-02', tier: 'MEMBER', spent: 310, ordersCount: 1, location: 'Zurich, Switzerland' },
      { id: 'c-6', name: 'Sophia Lin', email: 'sophia.lin@designstudio.sg', phone: '+65 6790 5111', registrationDate: '2024-08-15', tier: 'VIP', spent: 760, ordersCount: 4, location: 'Singapore' }
    ];
  }

  /**
   * 5. Toggle inventory in-stock / out-of-stock availability
   * @param {string} productId - ID of product
   * @param {boolean} inStock - New availability state
   */
  async toggleProductStock(productId, inStock) {
    if (!apiClient.useMock) {
      return await apiClient.patch(`/admin/products/${productId}/stock`, { inStock });
    }
    await mockDelay(150);
    return { productId, inStock, success: true };
  }

  /**
   * 6. Create a brand new product in the store catalogue
   * @param {Object} productData - Title, price, category, SKU, etc.
   */
  async createProduct(productData) {
    if (!apiClient.useMock) {
      return await apiClient.post('/admin/products', productData);
    }
    await mockDelay(300);
    return {
      id: `uc-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400' }],
      colorways: [{ name: 'Standard', hex: '#0f1115' }],
      sizes: [{ size: 'Default', available: true }],
      ...productData
    };
  }

  /**
   * 7. Save store global settings
   * @param {Object} settings - { storeTitle, supportEmail, freeShippingThreshold }
   */
  async saveStoreSettings(settings) {
    if (!apiClient.useMock) {
      return await apiClient.put('/admin/settings', settings);
    }
    await mockDelay(250);
    return { ...settings, savedAt: new Date().toISOString() };
  }
}

export const adminService = new AdminService();
