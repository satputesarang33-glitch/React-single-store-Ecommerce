import { operationalStats } from '../Seed/statsData.js';
import { getOrders, updateOrderStatus } from './orderController.js';
import { createProduct, updateProduct } from './productController.js';

let currentSettings = {
  storeTitle: 'UrbanCart Atelier & High-End Minimalist Store',
  supportEmail: 'satputesarang33@gmail.com',
  freeShippingThreshold: 150.00,
  currency: 'USD',
  taxRate: 0.08,
  orderNotifications: true,
  smsNotifications: true
};

const patronsList = [
  { id: 'c-1', name: 'Sarang Satpute', email: 'satputesarang33@gmail.com', phone: '+91 98340 58896', registrationDate: '2024-09-12', tier: 'VIP PATRON', spent: 1840, ordersCount: 8, location: 'Pune, Maharashtra' },
  { id: 'c-2', name: 'Julian Mercer', email: 'j.mercer@atelier.co', phone: '+46 8 123 4567', registrationDate: '2024-01-20', tier: 'ELITE', spent: 1420, ordersCount: 5, location: 'Stockholm, Sweden' },
  { id: 'c-3', name: 'Elena Rostova', email: 'e.rostova@studio.at', phone: '+43 1 711 0022', registrationDate: '2024-03-08', tier: 'VIP', spent: 920, ordersCount: 3, location: 'Vienna, Austria' },
  { id: 'c-4', name: 'Kaelen Voss', email: 'k.voss@design.de', phone: '+49 30 901820', registrationDate: '2024-05-19', tier: 'MEMBER', spent: 480, ordersCount: 2, location: 'Berlin, Germany' },
  { id: 'c-5', name: 'Marc Becker', email: 'm.becker@atelier.ch', phone: '+41 44 632 1111', registrationDate: '2024-07-02', tier: 'MEMBER', spent: 310, ordersCount: 1, location: 'Zurich, Switzerland' },
  { id: 'c-6', name: 'Sophia Lin', email: 'sophia.lin@designstudio.sg', phone: '+65 6790 5111', registrationDate: '2024-08-15', tier: 'VIP', spent: 760, ordersCount: 4, location: 'Singapore' }
];

export const getOperationalStats = async (req, res) => {
  res.json(operationalStats);
};

export const getAdminOrders = async (req, res, next) => {
  return getOrders(req, res, next);
};

export const updateAdminOrderStatus = async (req, res, next) => {
  return updateOrderStatus(req, res, next);
};

export const getAdminCustomers = async (req, res) => {
  res.json(patronsList);
};

export const toggleProductStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;
    req.body = { inStock };
    return updateProduct(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const createAdminProduct = async (req, res, next) => {
  return createProduct(req, res, next);
};

export const saveStoreSettings = async (req, res) => {
  currentSettings = { ...currentSettings, ...req.body, updatedAt: new Date().toISOString() };
  res.json(currentSettings);
};
