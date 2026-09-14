import React from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { ChevronRightIcon } from '../components/Icons';

/**
 * AboutUsPage Component
 * Architectural narrative about UrbanCart's philosophy, atelier craftsmanship,
 * global workshop studios, and sustainability commitment.
 */
export const AboutUsPage = () => {
  const { setActiveView, openShopCatalog } = useStore();

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
            <span style={{ color: '#111827', fontWeight: 600 }}>About UrbanCart</span>
          </nav>

          {/* Hero Statement */}
          <div style={{ maxWidth: '820px', marginBottom: '64px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase' }}>
              OUR MANIFESTO
            </div>
            <h1 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f1115',
              lineHeight: 1.12,
              marginTop: '8px',
              marginBottom: '20px'
            }}>
              Disciplined design for considered living.
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.7 }}>
              UrbanCart was founded in 2023 under a single foundational conviction: the modern world has enough disposable goods. What we lack are enduring, precision-engineered essentials designed to improve with age rather than end in a landfill.
            </p>
          </div>

          {/* Visual Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '72px'
          }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '360px' }}>
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop"
                alt="Shoe Craftsmanship"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '360px' }}>
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop"
                alt="Atelier Studio Model"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Core Pillars */}
          <div style={{ marginBottom: '72px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>
              THREE ATELIER PRINCIPLES
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '32px' }}>
              How We Build Every Single Specimen
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {[
                {
                  number: '01',
                  title: 'Cold-Formed Lasting & Anatomy',
                  desc: 'Every footwear last and ergonomic backpack harness is modeled around anatomical load distribution, removing synthetic fillers in favor of cork and memory foam matrices.'
                },
                {
                  number: '02',
                  title: 'Certified Ethical Provenance',
                  desc: 'We publish full supply-chain transparency. From LWG Gold-rated tanneries in Tuscany to Swiss titanium milling, every material carries traceable provenance.'
                },
                {
                  number: '03',
                  title: 'Radical Simplicity',
                  desc: 'No frivolous external branding or transient trends. Every seam, zip pull, and lug exists for structural utility, creating silhouettes that remain relevant for decades.'
                }
              ].map((p) => (
                <div
                  key={p.number}
                  style={{
                    backgroundColor: '#fafaf9',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '32px'
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706', marginBottom: '12px' }}>
                    {p.number}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.65 }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop Studios Map */}
          <div style={{
            backgroundColor: '#0f1115',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '56px 40px',
            marginBottom: '72px'
          }}>
            <div style={{ maxWidth: '600px', marginBottom: '40px' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#d97706', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                GLOBAL COLLABORATIVE WORKSHOPS
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '6px', color: '#ffffff' }}>
                Crafted in Specialized Ateliers
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '10px', lineHeight: 1.6 }}>
                Rather than centralizing in mass factories, we partner with heritage multi-generational family workshops that specialize in their historic disciplines.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {[
                { city: 'Porto, Portugal', specialty: 'Handcrafted Footwear & Leatherwork' },
                { city: 'Kyoto, Japan', specialty: 'Cordura Ballistic Carry & Weatherproofing' },
                { city: 'Zurich, Switzerland', specialty: 'Precision Horology & Titanium Engineering' },
                { city: 'Lima, Peru', specialty: '310 GSM Long-Staple Pima Cotton Knitwear' }
              ].map((loc, i) => (
                <div key={i} style={{ borderLeft: '2px solid #d97706', paddingLeft: '16px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{loc.city}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>{loc.specialty}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Strip */}
          <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              Experience the Craft
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '24px' }}>
              Every order includes a 30-day trial with prepaid carbon-neutral returns.
            </p>
            <Button variant="primary" size="lg" onClick={() => openShopCatalog('ALL')}>
              DISCOVER LIFESTYLE GOODS
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
