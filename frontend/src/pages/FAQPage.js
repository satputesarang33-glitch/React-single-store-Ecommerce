import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { TopNoticeBar } from '../components/TopNoticeBar';
import { StorefrontNav } from '../components/StorefrontNav';
import { Footer } from '../components/Footer';
import { ChevronRightIcon, SearchIcon, PlusIcon, MinusIcon } from '../components/Icons';

/**
 * FAQPage Component
 * Interactive accordion FAQ covering Shipping, Returns, Materials, and Atelier Care.
 */
export const FAQPage = () => {
  const { setActiveView } = useStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIndices, setOpenIndices] = useState([0]); // Open first question by default

  const toggleAccordion = (idx) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter(i => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const faqData = [
    {
      category: 'Shipping & Logistics',
      question: 'What are your worldwide delivery timeframes and carriers?',
      answer: 'All orders are dispatched within 24 hours from our regional distribution hubs in Stockholm and Zurich via DHL Express Worldwide and SwissPost Priority. Delivery within Europe takes 1-2 business days; North America takes 2-3 business days; and Asia-Pacific takes 3-4 business days.'
    },
    {
      category: 'Shipping & Logistics',
      question: 'How do I qualify for complimentary worldwide express shipping?',
      answer: 'All acquisitions with a cart total of $250 or greater automatically receive complimentary Worldwide Express shipping at checkout. Orders below this threshold ship for a flat regional rate of $15.'
    },
    {
      category: 'Returns & 30-Day Trial',
      question: 'How does the 30-day Atelier trial and returns process work?',
      answer: 'We invite you to wear and inspect your specimens for up to 30 days. If you are not completely satisfied, initiate a return from your Patron Portal. We provide a prepaid, carbon-neutral DHL return label and refund your original payment upon scanning at the depot.'
    },
    {
      category: 'Returns & 30-Day Trial',
      question: 'Can I exchange an item for another size or colorway?',
      answer: 'Yes. Size and colorway exchanges are processed immediately with priority zero-wait dispatch before we even receive your returning pair, ensuring your reserved size does not deplete.'
    },
    {
      category: 'Materials & Sizing',
      question: 'How should I choose my size in UrbanCart sneakers?',
      answer: 'Our Mono Low-Top and CloudStrider runners fit true to European standard sizing. If you typically sit between sizes, we recommend sizing down for low-top leather models (as Italian calfskin relaxes 2-3mm to your anatomical shape) and sizing up for active knit runners.'
    },
    {
      category: 'Materials & Sizing',
      question: 'What is LWG Gold-Rated calfskin and how do I maintain it?',
      answer: 'Leather Working Group (LWG) Gold certification represents the highest benchmark in environmentally audited, water-efficient, and ethical leather production. Clean using a soft micro-fiber cloth and natural beeswax balsam twice a year to preserve hydration.'
    },
    {
      category: 'Atelier Society',
      question: 'What privileges are included with Atelier Circle membership?',
      answer: 'Atelier Circle members receive private 48-hour priority access to limited capsule releases (typically capped at 150-300 units), invitations to annual archival events, and dedicated phone consultation with master cobblers.'
    },
    {
      category: 'Atelier Society',
      question: 'How do I track my active shipment in real time?',
      answer: 'Visit your Patron Portal and click "Orders & Tracking". Each order features an itemized dossier, courier waybill number, and a live 4-step fulfillment progress stepper updated directly from our logistics API.'
    }
  ];

  const categories = ['ALL', 'Shipping & Logistics', 'Returns & 30-Day Trial', 'Materials & Sizing', 'Atelier Society'];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCat = activeCategory === 'ALL' || faq.category === activeCategory;
    const q = searchFilter.toLowerCase();
    const matchesSearch = !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNoticeBar />
      <StorefrontNav />

      <main style={{ flexGrow: 1, padding: '40px 0 90px 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '32px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveView('storefront')}>Home</span>
            <ChevronRightIcon size={12} />
            <span style={{ color: '#111827', fontWeight: 600 }}>Frequently Asked Questions</span>
          </nav>

          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase' }}>
              KNOWLEDGE BASE
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', margin: '8px 0 12px 0' }}>
              Frequently Asked Questions
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#6b7280', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
              Everything you need to know about our craftsmanship, delivery SLA, 30-day trial guarantee, and patron privileges.
            </p>

            {/* Search Input */}
            <div style={{
              position: 'relative',
              maxWidth: '480px',
              margin: '28px auto 0 auto',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ position: 'absolute', left: '16px', color: '#9ca3af' }}>
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                placeholder="Search shipping, returns, sizing, materials..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#fafaf9',
                  border: '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  padding: '12px 20px 12px 46px',
                  fontSize: '0.8125rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: activeCategory === c ? 700 : 500,
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    backgroundColor: activeCategory === c ? '#0f1115' : '#f3f4f6',
                    color: activeCategory === c ? '#ffffff' : '#4b5563',
                    border: '1px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredFaqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                No questions found matching your search. Please contact our concierge desk.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '14px',
                      backgroundColor: '#ffffff',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-subtle)',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      style={{
                        width: '100%',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        gap: '16px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 800, color: '#d97706', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {faq.category}
                        </div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', marginTop: '2px' }}>
                          {faq.question}
                        </h3>
                      </div>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111827',
                        flexShrink: 0
                      }}>
                        {isOpen ? <MinusIcon size={14} /> : <PlusIcon size={14} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div style={{
                        padding: '0 24px 20px 24px',
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        lineHeight: 1.65,
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Need More Assistance Banner */}
          <div style={{
            marginTop: '48px',
            backgroundColor: '#fafaf9',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>
              Still have questions regarding your acquisition?
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '4px', marginBottom: '16px' }}>
              Our dedicated concierge team is available Mon-Fri, 08:00 - 20:00 CET.
            </p>
            <button
              onClick={() => setActiveView('contact')}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.75rem', fontWeight: 700 }}
            >
              CONTACT CLIENT CONCIERGE →
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
