import React from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { ChevronRightIcon } from '../components/Icons';

/**
 * PrivacyPolicyPage Component
 */
export const PrivacyPolicyPage = () => {
  const { setActiveView } = useStore();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '40px 0 90px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '32px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Privacy &amp; Data Governance</span>
          </nav>

          <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase' }}>
            LEGAL ARCHIVE • GDPR &amp; CCPA COMPLIANT
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', margin: '8px 0 24px 0' }}>
            Privacy Policy &amp; Security Standards
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '36px' }}>
            Effective Date: January 1, 2026 • Master Catalog v4.12
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75 }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                1. Our Commitment to Patron Sovereignty
              </h2>
              <p>
                UrbanCart Inc. ("UrbanCart", "we", "our") maintains a strict policy of data minimization. We collect only the information required to fulfill orders, process carbon-neutral freight dispatches, and authenticate patron access to the Atelier Circle. We never sell, lease, or monetize your personal information to third-party advertisers.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                2. Information We Collect
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Acquisition Dossier:</strong> Name, delivery destination, contact telephone for SMS waybill alerts, and email confirmation.</li>
                <li><strong>Payment Tokens:</strong> All credit card details are encrypted directly through PCI-DSS Level 1 compliant settlement gateways. UrbanCart servers never store raw PAN numbers or card security codes.</li>
                <li><strong>Device &amp; Telemetry:</strong> Anonymized session telemetry utilized solely for responsive viewport optimization and fraud prevention.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                3. Your Rights (GDPR &amp; Global Privacy)
              </h2>
              <p>
                Every patron maintains the unconditional right to request an export of their complete account dossier, modify their saved residence ledger, or trigger immediate, permanent deletion of their account records. Inquiries may be directed to <strong>privacy@urbancart.internal</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * TermsPage Component
 */
export const TermsPage = () => {
  const { setActiveView } = useStore();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '40px 0 90px 0' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '32px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Terms of Acquisition</span>
          </nav>

          <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase' }}>
            ATELIER COVENANT
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', margin: '8px 0 24px 0' }}>
            Terms &amp; Conditions of Acquisition
          </h1>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '36px' }}>
            Last Revised: January 1, 2026 • Stockholm, Sweden
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '0.9375rem', color: '#374151', lineHeight: 1.75 }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                1. Order Placement &amp; Binding Covenants
              </h2>
              <p>
                By placing an order on UrbanCart, you submit an offer to acquire specimens under these Terms. Orders are confirmed and binding once an electronic receipt with assigned order reference (#UC-XXXXX-X) is dispatched to your registered email address.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                2. 30-Day Atelier Trial &amp; Return Rights
              </h2>
              <p>
                All specimens qualify for a 30-day trial period from the verified date of courier delivery. To receive a full refund, specimens must be returned in reasonable condition with original archival packaging. Prepaid return waybills are supplied through our self-service customer portal.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                3. Limited Capsule Editions &amp; Allocation
              </h2>
              <p>
                Capsule items designated as "LIMITED RUN" are strictly capped at the indicated unit volume (e.g. 150 units). UrbanCart reserves the right to cancel automated bot acquisitions or duplicate purchases exceeding per-patron limits to ensure equitable community allocation.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
