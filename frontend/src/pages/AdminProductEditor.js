import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AdminTopBar } from '../components/AdminTopBar';
import { AdminSidebar } from '../components/AdminSidebar';
import {
  ChevronRightIcon
} from '../components/Icons';

export const AdminProductEditor = () => {
  const {
    products,
    selectedProductId,
    updateProduct,
    openProductDetail,
    setActiveView,
    showToast
  } = useStore();

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Editable local form state
  const [formData, setFormData] = useState({
    title: currentProduct.title || 'Mono Classic Low-Top Sneaker',
    permalink: currentProduct.permalink || '/shop/footwear/mono-classic-low-top',
    subtitle: currentProduct.subtitle || 'Redefining the low-top silhouette',
    editorialDescription: currentProduct.editorialDescription || '',
    price: currentProduct.price || 160.00,
    compareAtPrice: currentProduct.compareAtPrice || 190.00,
    costPerUnit: currentProduct.costPerUnit || 56.00,
    chargeTax: true,
    enableFinancing: true,
    categoryFull: currentProduct.categoryFull || 'Footwear > Low-Top Sneaker',
    brand: currentProduct.brand || 'UrbanCart Atelier',
    collections: currentProduct.collections || ['Studio Essentials', 'Permanent Collection 2025', 'Drop 04'],
    newCollectionTag: '',
    colorways: currentProduct.colorways || [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Obsidian Noir', hex: '#171617' },
      { name: 'Sandstone Beige', hex: '#E5DED7' }
    ],
    sizes: currentProduct.sizes || [],
    fulfillmentLocation: currentProduct.fulfillment?.location || 'Bin-D-06 • Brooklyn Distribution Hub',
    trackStock: true,
    continueSelling: false,
    weight: currentProduct.fulfillment?.weight || '1.2 kg',
    dimensions: currentProduct.fulfillment?.dimensions || '32 × 20 × 12 cm'
  });

  // Calculate gross margin live
  const marginDollar = Math.max(0, formData.price - formData.costPerUnit);
  const marginPercent = formData.price > 0 ? ((marginDollar / formData.price) * 100).toFixed(1) : 0;

  const handleSaveDraft = () => {
    updateProduct({ ...currentProduct, ...formData });
    showToast('Draft version saved locally', 'info');
  };

  const handlePublish = () => {
    updateProduct({ ...currentProduct, ...formData });
    showToast('Product Dossier & Variant Matrix published live to Storefront!', 'success');
  };

  const handleAddCollection = () => {
    if (formData.newCollectionTag.trim()) {
      setFormData({
        ...formData,
        collections: [...formData.collections, formData.newCollectionTag.trim()],
        newCollectionTag: ''
      });
    }
  };

  const handleRemoveCollection = (index) => {
    setFormData({
      ...formData,
      collections: formData.collections.filter((_, i) => i !== index)
    });
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminTopBar />

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <AdminSidebar />

        <main style={{ flexGrow: 1, padding: '32px 36px', overflowY: 'auto' }}>
          {/* Header & Status */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#6b7280',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>ADMIN CONSOLE</span>
                <span>/</span>
                <span>INVENTORY &amp; CATALOG</span>
                <span>/</span>
                <span>PRODUCTS &amp; INVENTORY</span>
                <span>/</span>
                <span style={{ color: '#111827' }}>AUTHOR SKU: {currentProduct.sku}</span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.625rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#111827',
                marginTop: '4px'
              }}>
                Product Dossier &amp; Variant Matrix: {formData.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #a7f3d0'
                }}>
                  ACTIVE • LIVE ON STOREFRONT
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setActiveView('admin_dashboard')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#4b5563'
                }}
              >
                Discard Changes
              </button>

              <button
                onClick={() => openProductDetail(currentProduct.id)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Preview on Storefront</span>
                <ChevronRightIcon size={12} />
              </button>

              <button
                onClick={handleSaveDraft}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#111827'
                }}
              >
                Save Draft
              </button>

              <button
                onClick={handlePublish}
                style={{
                  backgroundColor: '#0f1115',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
              >
                Publish Updates
              </button>
            </div>
          </div>

          {/* 2-Column Grid Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 1: General Information */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                    General Information
                  </div>
                  <span style={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.08em' }}>
                    ATELIER ARCHIVE SPEC
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>
                      PRODUCT TITLE
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        outline: 'none',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>
                        PERMALINK SLUG
                      </label>
                      <input
                        type="text"
                        value={formData.permalink}
                        onChange={e => setFormData({ ...formData, permalink: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: '#4b5563',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>
                        ARCHIVAL SUMMARY / SUBTITLE
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Editorial Craftsmanship Description */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' }}>
                        EDITORIAL CRAFTSMANSHIP DESCRIPTION
                      </label>
                      <span style={{ fontSize: '0.625rem', color: '#9ca3af' }}>164 WORDS</span>
                    </div>

                    {/* Toolbar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      backgroundColor: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderBottom: 'none',
                      borderRadius: '6px 6px 0 0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#4b5563'
                    }}>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px' }}>B</span>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px', fontStyle: 'italic' }}>I</span>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px' }}>T</span>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px' }}>🔗</span>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px' }}>•≡</span>
                      <span style={{ padding: '2px 6px', cursor: 'pointer', borderRadius: '4px' }}>&lt;/&gt;</span>
                    </div>

                    <textarea
                      rows={6}
                      value={formData.editorialDescription}
                      onChange={e => setFormData({ ...formData, editorialDescription: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '0 0 6px 6px',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: '#374151',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Media Gallery & Asset Sequences */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                    Media Gallery &amp; Asset Sequences
                  </div>
                  <span style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 700 }}>
                    5 ASSETS SEQUENCED
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>
                  {currentProduct.images?.slice(0, 4).map((img, idx) => (
                    <div
                      key={img.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <div style={{ width: '100%', paddingTop: '80%', position: 'relative' }}>
                        <img
                          src={img.url}
                          alt={img.title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {idx === 0 && (
                          <span style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            backgroundColor: '#0f1115',
                            color: '#ffffff',
                            fontSize: '0.5625rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '3px'
                          }}>
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '6px 8px', fontSize: '0.625rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {img.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload additional asset drop area */}
                <div
                  onClick={() => showToast('Asset sequence uploader ready (CDN connected)', 'info')}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>
                    Upload Additional High-Res Asset
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '4px' }}>
                    Drag &amp; drop master TIFF, RAW, or 3000px WebP files.
                  </div>
                </div>
              </div>

              {/* Section 5: Multi-Variant & Inventory Matrix */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                    Multi-Variant &amp; Inventory Matrix
                  </div>
                  <button 
                    onClick={() => showToast('Editing colorway and sizing attributes modal', 'info')}
                    style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2563eb' }}
                  >
                    Edit Attributes
                  </button>
                </div>

                {/* Active Colorways */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', marginBottom: '8px' }}>
                    ACTIVE COLORWAY FACETS (3)
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {formData.colorways.map((cw, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 600
                        }}
                      >
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cw.hex, border: '1px solid rgba(0,0,0,0.2)' }} />
                        <span>{cw.name}</span>
                        <span style={{ color: '#9ca3af' }}>{cw.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizing Scales */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', marginBottom: '8px' }}>
                    STANDARD US SIZING SCALES (10 ACTIVE / 10)
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentProduct.sizes?.map((sz) => (
                      <span
                        key={sz.size}
                        style={{
                          backgroundColor: '#0f1115',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700
                        }}
                      >
                        US {sz.size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* SKU Table preview */}
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '8px 12px' }}>VARIANT</th>
                        <th style={{ padding: '8px 12px' }}>SKU</th>
                        <th style={{ padding: '8px 12px' }}>AVAILABLE</th>
                        <th style={{ padding: '8px 12px' }}>THRESHOLD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { variant: 'Chalk White • US 9.5', sku: 'UC-FW-086-WHT-09.5', avail: 14, threshold: 5 },
                        { variant: 'Chalk White • US 10.0', sku: 'UC-FW-086-WHT-10.0', avail: 3, threshold: 5, alert: true },
                        { variant: 'Chalk White • US 10.5', sku: 'UC-FW-086-WHT-10.5', avail: 7, threshold: 5 },
                        { variant: 'Obsidian Noir • US 10.0', sku: 'UC-FW-086-BLK-10.0', avail: 8, threshold: 5 },
                        { variant: 'Sandstone Beige • US 10.0', sku: 'UC-FW-086-SND-10.0', avail: 27, threshold: 5 }
                      ].map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{item.variant}</td>
                          <td style={{ padding: '10px 12px', color: '#6b7280' }}>{item.sku}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700, color: item.alert ? '#dc2626' : '#111827' }}>
                            {item.avail} {item.alert && <span style={{ fontSize: '0.625rem', color: '#dc2626' }}>(Critical)</span>}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#6b7280' }}>{item.threshold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 2: Commercial Economics */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>
                    Commercial Economics
                  </div>
                  <span style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 700 }}>USD ($)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                        BASE RETAIL PRICE
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                        COMPARE-AT PRICE
                      </label>
                      <input
                        type="number"
                        value={formData.compareAtPrice}
                        onChange={e => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                        COST PER UNIT
                      </label>
                      <input
                        type="number"
                        value={formData.costPerUnit}
                        onChange={e => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.8125rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                        GROSS MARGIN
                      </label>
                      <div style={{
                        padding: '8px 10px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        color: '#059669'
                      }}>
                        {marginPercent}% • ${marginDollar.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#374151', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.chargeTax}
                        onChange={e => setFormData({ ...formData, chargeTax: e.target.checked })}
                      />
                      <span>Charge automated consumption tax on this item</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#374151', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.enableFinancing}
                        onChange={e => setFormData({ ...formData, enableFinancing: e.target.checked })}
                      />
                      <span>Enable Klarna / Affirm installment underwriting</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Classification & Taxonomy */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  Classification &amp; Taxonomy
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                      PRODUCT CATEGORY
                    </label>
                    <select
                      value={formData.categoryFull}
                      onChange={e => setFormData({ ...formData, categoryFull: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        outline: 'none',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value="Footwear > Low-Top Sneaker">Footwear &gt; Low-Top Sneaker</option>
                      <option value="Bags & Carry > Technical Daypack">Bags &amp; Carry &gt; Technical Daypack</option>
                      <option value="Timepieces > Precision Horology">Timepieces &gt; Precision Horology</option>
                      <option value="Apparel > Heavyweight Knitwear">Apparel &gt; Heavyweight Knitwear</option>
                      <option value="Accessories > Small Leather Goods">Accessories &gt; Small Leather Goods</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                      BRAND / ARCHIVAL SUB-LINE
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Collections */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '6px' }}>
                      CURATED COLLECTIONS
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {formData.collections.map((col, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            fontWeight: 600
                          }}
                        >
                          {col}
                          <button
                            onClick={() => handleRemoveCollection(idx)}
                            style={{ color: '#1d4ed8', padding: '0 2px' }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Add collection tag..."
                        value={formData.newCollectionTag}
                        onChange={e => setFormData({ ...formData, newCollectionTag: e.target.value })}
                        style={{
                          flexGrow: 1,
                          padding: '6px 10px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={handleAddCollection}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#f3f4f6',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Logistics & Fulfillment */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  Logistics &amp; Fulfillment
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#4b5563', marginBottom: '4px' }}>
                      PRIMARY FULFILLMENT LOCATION
                    </label>
                    <input
                      type="text"
                      value={formData.fulfillmentLocation}
                      onChange={e => setFormData({ ...formData, fulfillmentLocation: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.trackStock}
                      onChange={e => setFormData({ ...formData, trackStock: e.target.checked })}
                    />
                    <span>Track Real-time Stock Count</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.continueSelling}
                      onChange={e => setFormData({ ...formData, continueSelling: e.target.checked })}
                    />
                    <span>Continue Selling When Depleted</span>
                  </label>

                  {/* Shipping Package Metrics */}
                  <div style={{
                    paddingTop: '12px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 700 }}>WEIGHT</div>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 700 }}>DIMENSIONS</div>
                      <input
                        type="text"
                        value={formData.dimensions}
                        onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          marginTop: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
