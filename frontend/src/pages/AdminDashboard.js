import React from 'react';
import { useStore } from '../context/StoreContext';
import { AdminTopBar } from '../components/AdminTopBar';
import { AdminSidebar } from '../components/AdminSidebar';
import { Button } from '../components/common/Button';
import { DownloadIcon } from '../components/Icons';

// Separated Admin Tab Components
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminProductsTab } from '../components/admin/AdminProductsTab';
import { AdminCustomersTab } from '../components/admin/AdminCustomersTab';
import { AdminCategoriesTab } from '../components/admin/AdminCategoriesTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import { AdminLoginPage } from './AdminLoginPage';

/**
 * AdminDashboard Page
 * Clean, modular Backoffice Master Controller.
 * Delegates view rendering to dedicated, separated admin tab components.
 */
export const AdminDashboard = ({ initialTab }) => {
  const { adminTab, setAdminTab, currentUser, showToast } = useStore();

  React.useEffect(() => {
    if (initialTab && setAdminTab) {
      setAdminTab(initialTab);
    }
  }, [initialTab, setAdminTab]);

  // If user is not logged in as admin, show dedicated AdminLoginPage
  if (!currentUser || currentUser.role !== 'admin') {
    return <AdminLoginPage />;
  }

  const handleExport = () => {
    showToast('Exporting Operational Ledger Dossier (CSV & PDF)...', 'info');
  };

  // Human-readable titles according to the active tab
  const tabTitles = {
    overview: { category: 'STORE OPERATIONS', title: 'Operational Overview' },
    orders: { category: 'ORDERS & DISPATCH', title: 'Orders & Fulfillment Ledger' },
    inventory: { category: 'PRODUCTS & INVENTORY', title: 'Catalog & Inventory Control' },
    add_product: { category: 'CATALOG CREATION', title: 'Add New Product Specimen' },
    customers: { category: 'PATRON DIRECTORY', title: 'Society Patrons Directory' },
    categories: { category: 'TAXONOMY', title: 'Store Categories & Taxonomies' },
    settings: { category: 'CONFIGURATION', title: 'Storefront System Settings' }
  };

  const currentTabInfo = tabTitles[adminTab] || tabTitles.overview;

  return (
    <div className="admin-dashboard-root" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminTopBar />

      <div className="admin-layout-container" style={{ display: 'flex', flexGrow: 1 }}>
        <AdminSidebar />

        <main className="admin-main-viewport" style={{ flexGrow: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {/* Top Operational Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#6b7280',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>ADMIN CONSOLE</span>
                <span>/</span>
                <span>{currentTabInfo.category}</span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.75rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#111827',
                marginTop: '4px'
              }}>
                {currentTabInfo.title}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#4b5563',
                marginTop: '4px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span>Live Store Sync • All Systems Normal</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={handleExport} icon={DownloadIcon}>
                Export Dossier
              </Button>
            </div>
          </div>

          {/* Render Separated Component Based on Active Admin Tab */}
          {adminTab === 'overview' && <AdminOverviewTab />}
          {adminTab === 'orders' && <AdminOrdersTab />}
          {(adminTab === 'inventory' || adminTab === 'add_product') && (
            <AdminProductsTab initialOpenAddModal={adminTab === 'add_product'} />
          )}
          {adminTab === 'customers' && <AdminCustomersTab />}
          {adminTab === 'categories' && <AdminCategoriesTab />}
          {adminTab === 'settings' && <AdminSettingsTab />}
        </main>
      </div>
    </div>
  );
};
