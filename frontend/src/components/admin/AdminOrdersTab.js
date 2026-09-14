import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Badge } from '../common/Badge';
import { SearchIcon } from '../Icons';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';

/**
 * AdminOrdersTab Component
 * Backoffice Order Management Ledger with:
 * - Comprehensive Order List
 * - Customer Information (Name, Email, Phone)
 * - Payment Status
 * - Order Status
 * - Live Update Order Status
 * - Order Details Modal Inspector
 */
export const AdminOrdersTab = () => {
  const { orders, updateOrderStatus, formatPrice } = useStore();
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [inspectingOrder, setInspectingOrder] = useState(null);

  // Filter orders by fulfillment state and search query
  const filteredOrders = orders.filter((ord) => {
    const matchesFilter =
      orderFilter === 'all' ||
      (orderFilter === 'dispatched' && ord.fulfillmentState === 'COURIER DISPATCHED') ||
      (orderFilter === 'delivered' && ord.fulfillmentState === 'DELIVERED') ||
      (orderFilter === 'preparing' && ord.fulfillmentState === 'PREPARING SHIPMENT');

    const query = searchOrder.toLowerCase();
    const patron = ord.patron || {};
    const matchesSearch =
      !searchOrder ||
      (ord.reference || '').toLowerCase().includes(query) ||
      (patron.name || '').toLowerCase().includes(query) ||
      (patron.email || '').toLowerCase().includes(query) ||
      (patron.phone || '').toLowerCase().includes(query) ||
      (ord.cartSummary || '').toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* 1. Header & Summary Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            FULFILLMENT &amp; SETTLEMENTS
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            Order Management Ledger ({filteredOrders.length} Orders)
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ padding: '6px 12px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.75rem' }}>
            <span style={{ color: '#6b7280' }}>Total Volume: </span>
            <strong style={{ color: '#111827' }}>
              {formatPrice(orders.reduce((acc, o) => acc + (o.total || 0), 0))}
            </strong>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        border: '1px solid #f3f4f6'
      }}>
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'preparing', label: 'Preparing Shipment' },
            { id: 'dispatched', label: 'Courier Dispatched' },
            { id: 'delivered', label: 'Delivered' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setOrderFilter(flt.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: orderFilter === flt.id ? 700 : 500,
                backgroundColor: orderFilter === flt.id ? '#0f1115' : '#ffffff',
                color: orderFilter === flt.id ? '#ffffff' : '#4b5563',
                border: `1px solid ${orderFilter === flt.id ? '#0f1115' : '#e5e7eb'}`,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '7px 12px',
          width: '280px'
        }}>
          <SearchIcon size={15} />
          <input
            type="text"
            placeholder="Search reference, customer, email..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.75rem', width: '100%' }}
          />
          {searchOrder && (
            <button
              onClick={() => setSearchOrder('')}
              style={{ border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Orders Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>ORDER REF</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>CUSTOMER INFORMATION</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>DATE / TIME</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>TOTAL</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>PAYMENT STATUS</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>ORDER STATUS (UPDATE)</th>
              <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const patron = ord.patron || {};
                return (
                  <tr
                    key={ord.id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Order Reference */}
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                      {ord.reference}
                    </td>

                    {/* Customer Information: Name, Email, Phone */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 800, color: '#111827' }}>
                        {patron.name || 'Patron'}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#4b5563' }}>
                        {patron.email || 'patron@example.com'}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                        {patron.phone || '+46 8 123 4567'} • {patron.city || 'Stockholm'}
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td style={{ padding: '12px 10px', color: '#6b7280' }}>
                      {ord.timestamp || ord.date || 'Today 14:22'}
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                      {formatPrice(ord.total)}
                    </td>

                    {/* Payment Status */}
                    <td style={{ padding: '12px 10px' }}>
                      <Badge variant={ord.paymentStatus === 'CAPTURED' || ord.paymentStatus === 'SETTLED' ? 'success' : 'warning'}>
                        ● {ord.paymentStatus || 'CAPTURED'}
                      </Badge>
                    </td>

                    {/* Order Status with Live Updater */}
                    <td style={{ padding: '12px 10px' }}>
                      <select
                        value={ord.fulfillmentState}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        style={{
                          backgroundColor: ord.fulfillmentState === 'DELIVERED' ? '#ecfdf5' : ord.fulfillmentState === 'COURIER DISPATCHED' ? '#eff6ff' : '#fef3c7',
                          color: ord.fulfillmentState === 'DELIVERED' ? '#065f46' : ord.fulfillmentState === 'COURIER DISPATCHED' ? '#1e40af' : '#92400e',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="PREPARING SHIPMENT">PREPARING SHIPMENT</option>
                        <option value="COURIER DISPATCHED">COURIER DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    {/* Actions: View Details */}
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setInspectingOrder(ord)}
                        style={{
                          padding: '5px 12px',
                          backgroundColor: '#0f1115',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Order Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Order Details Modal */}
      <AdminOrderDetailsModal
        isOpen={Boolean(inspectingOrder)}
        onClose={() => setInspectingOrder(null)}
        order={inspectingOrder}
      />
    </div>
  );
};
