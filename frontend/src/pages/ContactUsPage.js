import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ChevronRightIcon, HeadphonesIcon, TruckIcon, ShieldCheckIcon } from '../components/Icons';

/**
 * ContactUsPage Component
 * Interactive client care desk with message submission, concierge hours,
 * atelier address, and dispatch inquiry support.
 */
export const ContactUsPage = () => {
  const { setActiveView, showToast } = useStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'Order & Shipping Status',
    orderRef: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry dispatched to client concierge team', 'success');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '40px 0 90px 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '32px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Contact &amp; Client Concierge</span>
          </nav>

          <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase' }}>
              CLIENT CONCIERGE
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', marginTop: '6px' }}>
              How May We Assist You?
            </h1>
            <p style={{ fontSize: '1rem', color: '#4b5563', marginTop: '8px', lineHeight: 1.6 }}>
              Whether you need sizing guidance, custom colorway availability, or order tracking assistance, our dedicated concierge team is at your service.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '56px', alignItems: 'start' }} className="checkout-layout-grid">
            {/* Left Column: Form */}
            <div style={{
              backgroundColor: '#fafaf9',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✉️</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
                    Inquiry Received
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px', marginBottom: '24px', lineHeight: 1.6 }}>
                    Thank you, <strong>{form.name}</strong>. A dedicated concierge specialist will respond to <strong>{form.email}</strong> within 4 hours.
                  </p>
                  <Button variant="secondary" size="md" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <Input
                    label="Your Name"
                    placeholder="e.g. Alex Vance"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="patron@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />

                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                      INQUIRY SUBJECT
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '0.8125rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        marginTop: '6px',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Order & Shipping Status">Order &amp; Shipping Status</option>
                      <option value="Sizing & Fit Consultation">Sizing &amp; Fit Consultation</option>
                      <option value="Returns & Exchanges">Returns &amp; Exchanges</option>
                      <option value="Atelier Society Membership">Atelier Society Membership</option>
                      <option value="Press & Commercial Partnerships">Press &amp; Commercial Partnerships</option>
                    </select>
                  </div>

                  <Input
                    label="Order Reference (Optional)"
                    placeholder="e.g. #UC-10492-X"
                    value={form.orderRef}
                    onChange={(e) => setForm({ ...form, orderRef: e.target.value })}
                  />

                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                      MESSAGE
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please describe how we can assist..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.8125rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        marginTop: '6px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        backgroundColor: '#ffffff',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" fullWidth style={{ marginTop: '8px' }}>
                    DISPATCH INQUIRY
                  </Button>
                </form>
              )}
            </div>

            {/* Right Column: Channels & Hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1115'
                  }}>
                    <HeadphonesIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>Concierge Desk</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>● Active Now (Avg response &lt; 15 mins)</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6 }}>
                  Email:{' '}
                  <strong style={{ color: '#111827' }}>concierge@urbancart.internal</strong>
                  <br />
                  Direct Wire:{' '}
                  <strong style={{ color: '#111827' }}>+1 (800) 492-8820</strong>
                  <br />
                  Operational Hours:{' '}
                  <span>Mon – Fri, 08:00 – 20:00 CET</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0f1115'
                  }}>
                    <TruckIcon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>Dispatch Hub</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Global Returns &amp; Exchanges</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.6 }}>
                  UrbanCart Logistics Terminal<br />
                  Grev Turegatan 14<br />
                  114 46 Stockholm, Sweden
                </p>
              </div>

              <div style={{
                backgroundColor: '#fafaf9',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <ShieldCheckIcon size={24} style={{ color: '#059669', flexShrink: 0 }} />
                <div style={{ fontSize: '0.75rem', color: '#4b5563', lineHeight: 1.5 }}>
                  <strong>30-Day Atelier Trial Guarantee:</strong> All returns are prepaid and handled with carbon-neutral courier logistics.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
