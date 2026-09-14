import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { operationalStats } from '../../data/stats';
import { Badge } from '../common/Badge';

/**
 * AdminOverviewTab Component
 * Backoffice master executive dashboard with:
 * - 4 Primary KPIs: Total sales, Total orders, Total customers, Total products
 * - Interactive Sales Overview Chart
 * - Top-selling products
 * - Recent orders ledger with payment and fulfillment status badges
 */
export const AdminOverviewTab = () => {
  const { products, orders, setAdminTab, openOrderDetails, formatPrice } = useStore();
  const [salesMetric, setSalesMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [timeframe, setTimeframe] = useState('monthly'); // 'weekly' | 'monthly'

  const stats = operationalStats;

  // Computed / formatted metrics
  const totalSalesFormatted = stats.kpis?.grossRevenue?.formatted || '$148,920.00';
  const totalOrdersCount = stats.kpis?.storeOrders?.formatted || orders.length.toString();
  const totalCustomersCount = stats.kpis?.activeCustomers?.formatted || '892 Patrons';
  const totalProductsCount = products.length.toString();

  // Top selling products data derived from store products
  const topSellingProducts = [
    {
      id: 'uc-fw-086',
      title: 'UrbanCart Mono Low-Top Sneaker',
      category: 'Footwear',
      salesCount: 364,
      revenue: 58240,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200&auto=format&fit=crop',
      stock: 24,
      status: 'In Stock'
    },
    {
      id: 'uc-tm-044',
      title: 'Chronos Minimal Ceramic Watch',
      category: 'Timepieces',
      salesCount: 144,
      revenue: 41760,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop',
      stock: 7,
      status: 'Low Stock'
    },
    {
      id: 'uc-bg-012',
      title: 'Aeropack Pro Minimal Backpack',
      category: 'Bags & Carry',
      salesCount: 130,
      revenue: 24700,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=200&auto=format&fit=crop',
      stock: 18,
      status: 'In Stock'
    },
    {
      id: 'uc-ts-101',
      title: 'Heavyweight Pima Cotton Pocket Tee',
      category: 'Apparel',
      salesCount: 280,
      revenue: 15400,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop',
      stock: 52,
      status: 'In Stock'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Primary Operational Metric Cards: Total sales, Total orders, Total customers, Total products */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Sales */}
        <div
          data-testid="metric-total-sales"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
              Total Sales
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
              +14.2% MoM
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '8px 0 4px 0' }}>
            {totalSalesFormatted}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Gross settled store volume
          </div>
        </div>

        {/* Total Orders */}
        <div
          data-testid="metric-total-orders"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
              Total Orders
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
              +5.6% MoM
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '8px 0 4px 0' }}>
            {totalOrdersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Acquisitions dispatched &amp; active
          </div>
        </div>

        {/* Total Customers */}
        <div
          data-testid="metric-total-customers"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
              Total Customers
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px' }}>
              +12.4% MoM
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '8px 0 4px 0' }}>
            {totalCustomersCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Registered society patrons
          </div>
        </div>

        {/* Total Products */}
        <div
          data-testid="metric-total-products"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#6b7280', textTransform: 'uppercase' }}>
              Total Products
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#1e40af', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '9999px' }}>
              Catalog Active
            </span>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#111827', margin: '8px 0 4px 0' }}>
            {totalProductsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Live atelier specimens
          </div>
        </div>
      </div>

      {/* 2. Sales Overview Chart & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Sales Overview Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase' }}>
                FINANCIAL TRAJECTORY
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                Sales Overview Chart
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Revenue / Orders Switcher */}
              <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '2px' }}>
                <button
                  onClick={() => setSalesMetric('revenue')}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: salesMetric === 'revenue' ? '#0f1115' : 'transparent',
                    color: salesMetric === 'revenue' ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSalesMetric('orders')}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: salesMetric === 'orders' ? '#0f1115' : 'transparent',
                    color: salesMetric === 'orders' ? '#ffffff' : '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  Orders
                </button>
              </div>

              {/* Timeframe Switcher */}
              <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '2px' }}>
                <button
                  onClick={() => setTimeframe('weekly')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: timeframe === 'weekly' ? '#ffffff' : 'transparent',
                    color: timeframe === 'weekly' ? '#111827' : '#6b7280',
                    boxShadow: timeframe === 'weekly' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: timeframe === 'monthly' ? '#ffffff' : 'transparent',
                    color: timeframe === 'monthly' ? '#111827' : '#6b7280',
                    boxShadow: timeframe === 'monthly' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>

          {/* Graphic Visualization Area */}
          <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '12px' }}>
            <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f1115" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0f1115" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Subtle Horizontal Grid lines */}
              <line x1="30" y1="30" x2="580" y2="30" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="580" y2="80" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="130" x2="580" y2="130" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="580" y2="180" stroke="#e5e7eb" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="5" y="34" fontSize="9" fill="#9ca3af" fontWeight="600">
                {salesMetric === 'revenue' ? '$60k' : '600'}
              </text>
              <text x="5" y="84" fontSize="9" fill="#9ca3af" fontWeight="600">
                {salesMetric === 'revenue' ? '$40k' : '400'}
              </text>
              <text x="5" y="134" fontSize="9" fill="#9ca3af" fontWeight="600">
                {salesMetric === 'revenue' ? '$20k' : '200'}
              </text>

              {/* Filled Curve */}
              <path
                d={salesMetric === 'revenue'
                  ? "M 50 140 C 130 135, 190 100, 270 90 C 350 80, 420 40, 490 35 L 560 55 L 560 180 L 50 180 Z"
                  : "M 50 150 C 130 140, 200 115, 270 105 C 340 95, 410 65, 480 60 L 560 70 L 560 180 L 50 180 Z"
                }
                fill="url(#salesGrad)"
              />

              {/* Trajectory Stroke Line */}
              <path
                d={salesMetric === 'revenue'
                  ? "M 50 140 C 130 135, 190 100, 270 90 C 350 80, 420 40, 490 35 L 560 55"
                  : "M 50 150 C 130 140, 200 115, 270 105 C 340 95, 410 65, 480 60 L 560 70"
                }
                fill="none"
                stroke="#0f1115"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="50" cy={salesMetric === 'revenue' ? 140 : 150} r="4" fill="#ffffff" stroke="#0f1115" strokeWidth="2" />
              <circle cx="270" cy={salesMetric === 'revenue' ? 90 : 105} r="4" fill="#ffffff" stroke="#0f1115" strokeWidth="2" />
              <circle cx="490" cy={salesMetric === 'revenue' ? 35 : 60} r="5" fill="#0f1115" stroke="#ffffff" strokeWidth="2" />
              <circle cx="560" cy={salesMetric === 'revenue' ? 55 : 70} r="4" fill="#ffffff" stroke="#0f1115" strokeWidth="2" />

              {/* Peak Callout Badge */}
              <rect x="440" y="8" width="100" height="22" rx="6" fill="#0f1115" />
              <text x="490" y="23" fontSize="10" fill="#ffffff" fontWeight="700" textAnchor="middle">
                {salesMetric === 'revenue' ? 'Peak: $52,100' : 'Peak: 490 Orders'}
              </text>
            </svg>

            {/* X-Axis Timestamps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px', fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', marginTop: '6px' }}>
              <span>OCT 01 - 07</span>
              <span>OCT 08 - 14</span>
              <span style={{ color: '#0f1115' }}>OCT 15 - 21 (CAPSULE DROP)</span>
              <span>OCT 22 - 31</span>
            </div>
          </div>
        </div>

        {/* Category Share Distribution */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase' }}>
              SEGMENT METRICS
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', marginTop: '2px', marginBottom: '18px' }}>
              Sales by Category
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.categoryShare.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{cat.name}</span>
                    <span style={{ fontWeight: 800, color: '#4b5563' }}>{cat.percentage}% ({cat.amount})</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${cat.percentage}%`,
                        backgroundColor: idx === 0 ? '#0f1115' : idx === 1 ? '#4b5563' : idx === 2 ? '#9ca3af' : '#d1d5db',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#fafaf9',
            border: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem'
          }}>
            <span style={{ color: '#6b7280' }}>Average Order Value:</span>
            <strong style={{ color: '#111827', fontWeight: 800 }}>$104.28 (+3.1%)</strong>
          </div>
        </div>
      </div>

      {/* 3. Top-Selling Products Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase' }}>
              CURATED PERFORMANCE
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
              Top-Selling Products
            </h2>
          </div>
          <button
            onClick={() => setAdminTab('inventory')}
            style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f1115', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Manage All Products →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>PRODUCT</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>CATEGORY</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>UNITS SOLD</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>REVENUE GENERATED</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>STOCK RUNWAY</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: '1px solid #f9fafb', transition: 'background-color 0.15s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, color: '#111827' }}>{p.title}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>ID: {p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant="neutral">{p.category}</Badge>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#111827' }}>
                    {p.salesCount.toLocaleString()} units
                  </td>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#059669' }}>
                    {formatPrice(p.revenue)}
                  </td>
                  <td style={{ padding: '12px', color: '#4b5563', fontSize: '0.75rem' }}>
                    {p.stock} units available
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={p.status === 'In Stock' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.08em', color: '#9ca3af', textTransform: 'uppercase' }}>
              DISPATCH QUEUE
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
              Recent Orders ({orders.slice(0, 5).length})
            </h2>
          </div>
          <button
            onClick={() => setAdminTab('orders')}
            style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f1115', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            View Full Orders Ledger →
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>ORDER REF</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>PATRON / CUSTOMER</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>DATE / TIME</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>ITEMS SUMMARY</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>TOTAL</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>PAYMENT STATUS</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>ORDER STATUS</th>
                <th style={{ padding: '10px 12px', fontWeight: 700 }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr
                  key={ord.id}
                  style={{ borderBottom: '1px solid #f9fafb' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                    {ord.reference}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{ord.patron?.name || 'Patron'}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{ord.patron?.city || 'Stockholm, SE'}</div>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#6b7280' }}>
                    {ord.timestamp || ord.date || 'Today 14:22'}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#4b5563', maxWidth: '200px' }}>
                    {ord.cartSummary}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                    {formatPrice(ord.total)}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Badge variant={ord.paymentStatus === 'CAPTURED' || ord.paymentStatus === 'SETTLED' ? 'success' : 'warning'}>
                      {ord.paymentStatus || 'CAPTURED'}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Badge variant={ord.fulfillmentState === 'DELIVERED' ? 'success' : ord.fulfillmentState === 'COURIER DISPATCHED' ? 'info' : 'warning'}>
                      {ord.fulfillmentState}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <button
                      onClick={() => openOrderDetails(ord)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#0f1115',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
