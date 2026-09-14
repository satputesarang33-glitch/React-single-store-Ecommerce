import React from 'react';
import { useStore } from '../context/StoreContext';
import { BellIcon, PlusIcon, SearchIcon } from './Icons';

// Import dedicated component stylesheet
import './AdminTopBar.css';

/**
 * ============================================================================
 * AdminTopBar Component — Step-by-Step Modular Architecture
 * ============================================================================
 * 
 * Purpose:
 *   Top utility bar for the OPS Backoffice portal.
 *   Provides command search, system online status indicator, storefront quick-link,
 *   New Product modal trigger, and administrator profile display.
 */
export const AdminTopBar = () => {
  const { openAdminEditor, setActiveView } = useStore();

  return (
    <header className="admin-topbar">
      {/* ── Left Section: Logo, Flagship & Status ── */}
      <div className="admin-topbar-left">
        <div 
          onClick={() => setActiveView('admin_dashboard')}
          className="admin-topbar-brand"
        >
          <span className="admin-topbar-brand-title">UrbanCart</span>
          <span className="admin-topbar-ops-tag">OPS</span>
        </div>

        <div className="admin-topbar-divider" />

        {/* Flagship Selector */}
        <div className="admin-flagship-selector">
          <span>UrbanCart Flagship</span>
          <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>▾</span>
        </div>

        {/* Online Status Pill */}
        <div className="admin-online-status">
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>Online</span>
        </div>
      </div>

      {/* ── Middle Section: Command Search Bar ── */}
      <div className="admin-topbar-search">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SearchIcon size={15} />
          <input
            type="text"
            placeholder="Command Search"
          />
        </div>
        <kbd style={{
          fontSize: '0.625rem',
          padding: '2px 6px',
          backgroundColor: '#ffffff',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontWeight: 600,
          color: '#4b5563'
        }}>
          ⌘K
        </kbd>
      </div>

      {/* ── Right Section: Actions & Admin Profile ── */}
      <div className="admin-topbar-actions">
        {/* Switch back to Storefront */}
        <button
          onClick={() => setActiveView('storefront')}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            color: '#111827',
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <span>Storefront ↗</span>
        </button>

        {/* New Product Button */}
        <button
          onClick={() => openAdminEditor()}
          className="admin-topbar-btn"
        >
          <PlusIcon size={14} />
          <span>New Product</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '6px', color: '#4b5563' }}>
          <BellIcon size={19} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '7px',
            height: '7px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }} />
        </div>

        {/* Admin User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingLeft: '12px',
          borderLeft: '1px solid #e5e5e0'
        }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
            alt="Alex Vance"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              Alex Vance
            </div>
            <div style={{ fontSize: '0.625rem', color: '#6b7280' }}>
              Principal Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
