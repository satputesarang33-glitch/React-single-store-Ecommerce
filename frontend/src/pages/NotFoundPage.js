import React from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';

/**
 * NotFoundPage Component (404 Page)
 */
export const NotFoundPage = () => {
  const { setActiveView, openShopCatalog } = useStore();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div style={{
            fontSize: '5rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#0f1115',
            lineHeight: 1
          }}>
            404
          </div>

          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#d97706',
            textTransform: 'uppercase',
            margin: '12px 0'
          }}>
            ARCHIVAL SPECIMEN NOT LOCATED
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
            The requested page does not exist
          </h1>

          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
            The URL path you followed may have been updated, relocated, or temporarily retired from the master archive.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Button variant="primary" size="md" onClick={() => setActiveView('storefront')}>
              RETURN TO STOREFRONT
            </Button>
            <Button variant="secondary" size="md" onClick={() => openShopCatalog('ALL')}>
              EXPLORE ARCHIVE
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
