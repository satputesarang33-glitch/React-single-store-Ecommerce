import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  BarChartIcon,
  BoxIcon,
  SettingsIcon,
  UserIcon,
  TruckIcon,
  PlusIcon,
  ArrowRightIcon
} from './Icons';

// Import dedicated component stylesheet
import './AdminSidebar.css';

/**
 * ============================================================================
 * AdminSidebar Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Backoffice navigation sidebar for UrbanCart OPS.
 *   Enables administrators to switch between Dashboard Overview, Product Catalog,
 *   Add Product, Orders Tracking, Customer Accounts, and System Settings.
 */
export const AdminSidebar = () => {
  const { activeView, setActiveView, adminTab, setAdminTab } = useStore();

  // Step 1: List of administrative navigation items
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChartIcon },
    { id: 'inventory', label: 'Products', icon: BoxIcon },
    { id: 'add_product', label: 'Add Product', icon: PlusIcon },
    { id: 'orders', label: 'Orders', icon: TruckIcon },
    { id: 'customers', label: 'Customers', icon: UserIcon },
    { id: 'categories', label: 'Categories', icon: BoxIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  // Step 2: Handle switching admin tabs
  const handleMenuClick = (itemId) => {
    setAdminTab(itemId);
    if (activeView !== 'admin_dashboard') {
      setActiveView('admin_dashboard');
    }
  };

  return (
    <aside className="admin-sidebar">
      {/* ── Top Menu Navigation ── */}
      <div>
        <div className="admin-sidebar-section-title">
          BACKOFFICE MANAGEMENT
        </div>

        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === 'admin_dashboard' && adminTab === item.id;

            return (
              <button
                key={item.id}
                data-testid={`admin-nav-${item.id}`}
                onClick={() => handleMenuClick(item.id)}
                className={`admin-sidebar-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Return to Storefront & Status ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => setActiveView('storefront')}
          className="admin-sidebar-return-btn"
        >
          <span>Return to Storefront</span>
          <ArrowRightIcon size={14} />
        </button>

        {/* Engine Status Badge */}
        <div className="admin-sidebar-status-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
            <span>Cloud Engine v4.12</span>
          </div>
          <span style={{
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.5625rem',
            fontWeight: 700
          }}>
            ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
};
