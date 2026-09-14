import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ChevronRightIcon,
  SearchIcon,
  PackageIcon,
  DownloadIcon,
  TruckIcon,
  ArrowRightIcon
} from '../components/Icons';

/**
 * OrdersPage Component
 * Dedicated Order History page showing:
 * 1. Order ID
 * 2. Order date
 * 3. Total amount
 * 4. Payment status
 * 5. Order status
 * 6. View Details button (navigates to Order Details page)
 */
export const OrdersPage = () => {
  const {
    orders = [],
    formatPrice,
    openOrderDetailsPage,
    setActiveView,
    addToCart,
    products = [],
    showToast
  } = useStore();

  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status badge variant helper
  const getStatusBadgeVariant = (state) => {
    switch (state) {
      case 'DELIVERED':
        return 'success';
      case 'COURIER DISPATCHED':
        return 'info';
      case 'PREPARING SHIPMENT':
      case 'CONFIRMED & PROCESSING':
        return 'warning';
      case 'HOLD ON GATE 2':
      case 'REVIEW REQUIRED':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Filtered orders calculation
  const filteredOrders = orders.filter(ord => {
    const matchesFilter =
      orderStatusFilter === 'all' ||
      (orderStatusFilter === 'active' && ord.fulfillmentState !== 'DELIVERED') ||
      (orderStatusFilter === 'delivered' && ord.fulfillmentState === 'DELIVERED');

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (ord.reference && ord.reference.toLowerCase().includes(q)) ||
      (ord.id && ord.id.toLowerCase().includes(q)) ||
      (ord.cartSummary && ord.cartSummary.toLowerCase().includes(q)) ||
      (ord.courier && ord.courier.toLowerCase().includes(q)) ||
      (ord.items && ord.items.some(i => i.title.toLowerCase().includes(q)));

    return matchesFilter && matchesSearch;
  });

  const handleDownloadInvoice = (order, e) => {
    e?.stopPropagation();
    showToast(`Official invoice dossier for ${order.reference} downloaded`, 'success');
  };

  const handleReorder = (order, e) => {
    e?.stopPropagation();
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        const prod = products.find(p => p.id === (item.productId || item.id)) || item;
        addToCart(prod, item.colorway || item.selectedColor || 'Default', item.size || item.selectedSize || 'Standard', item.quantity || 1);
      });
    } else {
      const sample = products[0] || { id: 'sample', title: order.cartSummary, price: order.total };
      addToCart(sample, 'Default', 'Standard', 1);
    }
    showToast(`Items from order ${order.reference} added to your shopping bag`, 'success');
  };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '32px 0 88px 0' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#6b7280',
              marginBottom: '28px'
            }}
          >
            <button
              onClick={() => setActiveView('storefront')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#6b7280', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Home
            </button>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>My Orders</span>
          </nav>

          {/* Page Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#0f1115', textTransform: 'uppercase' }}>
                PATRON DISPATCH LEDGER
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', margin: '6px 0 8px 0', letterSpacing: '-0.02em' }}>
                My Orders
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
                Review and track your archival acquisitions, live courier waybills, payment receipts, and fulfillment status.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('account')}
              >
                Patron Account
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveView('storefront')}
              >
                Explore Catalog
              </Button>
            </div>
          </div>

          {/* Controls Bar: Filters & Search */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All Orders (${orders.length})` },
                { id: 'active', label: `Active & In Transit (${orders.filter(o => o.fulfillmentState !== 'DELIVERED').length})` },
                { id: 'delivered', label: `Delivered (${orders.filter(o => o.fulfillmentState === 'DELIVERED').length})` }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setOrderStatusFilter(filter.id)}
                  data-testid={`filter-orders-${filter.id}`}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: orderStatusFilter === filter.id ? 700 : 500,
                    backgroundColor: orderStatusFilter === filter.id ? '#0f1115' : '#f3f4f6',
                    color: orderStatusFilter === filter.id ? '#ffffff' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fafaf9',
              border: '1.5px solid #e5e7eb',
              borderRadius: '9999px',
              padding: '8px 16px',
              width: '320px'
            }}>
              <SearchIcon size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, item, or courier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="orders-page-search-input"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.8125rem',
                  width: '100%',
                  color: '#111827'
                }}
              />
            </div>
          </div>

          {/* Orders List / Empty State */}
          {filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e0',
              borderRadius: '20px',
              padding: '80px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fafaf9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#9ca3af'
              }}>
                <PackageIcon size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                No Orders Found
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '8px auto 24px auto', maxWidth: '420px', lineHeight: 1.6 }}>
                {searchQuery || orderStatusFilter !== 'all'
                  ? 'No acquisitions match your current filter criteria or search terms.'
                  : 'You have not placed any orders yet. Discover our latest collection to begin your curation.'}
              </p>
              {searchQuery || orderStatusFilter !== 'all' ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => { setOrderStatusFilter('all'); setSearchQuery(''); }}
                >
                  Reset All Filters
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveView('storefront')}
                >
                  Explore Collection
                </Button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredOrders.map(order => (
                <div
                  key={order.id || order.reference}
                  data-testid={`order-history-card-${order.id || order.reference}`}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e5e0',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Order Primary Details Header Bar:
                      Shows: Order ID, Order date, Total amount, Payment status, Order status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    {/* Left: Order ID & Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span
                          data-testid={`order-id-${order.id || order.reference}`}
                          style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f1115', letterSpacing: '-0.01em' }}
                        >
                          Order ID: {order.reference || order.id}
                        </span>

                        {/* Order Status */}
                        <Badge
                          variant={getStatusBadgeVariant(order.fulfillmentState)}
                          hasDot
                          data-testid={`order-status-${order.id || order.reference}`}
                        >
                          {order.fulfillmentState || 'PROCESSING'}
                        </Badge>
                      </div>

                      {/* Order Date */}
                      <div
                        data-testid={`order-date-${order.id || order.reference}`}
                        style={{ fontSize: '0.75rem', color: '#6b7280' }}
                      >
                        Order Placed: <strong>{order.date || order.timestamp}</strong>
                      </div>
                    </div>

                    {/* Right: Total Amount & Payment Status */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      {/* Total Amount */}
                      <div
                        data-testid={`order-total-${order.id || order.reference}`}
                        style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}
                      >
                        {formatPrice(order.total)}
                      </div>

                      {/* Payment Status */}
                      <div
                        data-testid={`order-payment-status-${order.id || order.reference}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                      >
                        <span style={{ color: '#6b7280' }}>Payment:</span>
                        <span style={{
                          fontWeight: 700,
                          color: order.paymentStatus === 'REVIEW REQUIRED' ? '#dc2626' : '#059669',
                          backgroundColor: order.paymentStatus === 'REVIEW REQUIRED' ? '#fef2f2' : '#ecfdf5',
                          padding: '1px 8px',
                          borderRadius: '4px'
                        }}>
                          {order.paymentStatus || 'CAPTURED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items Preview & Shipping Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    {/* Item summary & thumbnails stack */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Render item images preview */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(order.items && order.items.length > 0
                          ? order.items.slice(0, 3)
                          : [{ image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=120' }]
                        ).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.title || 'Ordered item'}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e5e7eb',
                              backgroundColor: '#f5f5f4'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=120';
                            }}
                          />
                        ))}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                          {order.cartSummary || (order.items && `${order.items.length} items`) || '1 item'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <TruckIcon size={14} />
                          <span>{order.courier || 'DHL Express'}</span>
                          <span>• Waybill: <code>{order.trackingNumber || 'JD9182740192'}</code></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls: Includes the requested "View Details" button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDownloadInvoice(order, e)}
                        icon={DownloadIcon}
                        title="Download official PDF invoice receipt"
                      >
                        Invoice PDF
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleReorder(order, e)}
                      >
                        Reorder
                      </Button>

                      {/* View Details Button (Core Requirement) */}
                      <Button
                        variant="primary"
                        size="sm"
                        icon={ArrowRightIcon}
                        data-testid={`view-order-details-${order.id || order.reference}`}
                        onClick={() => openOrderDetailsPage(order)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
