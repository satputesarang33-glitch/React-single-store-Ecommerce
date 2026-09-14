import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/api/adminService';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

/**
 * AdminSettingsTab Component
 * Comprehensive Backoffice Store Settings UI covering:
 * - General Store Profile & Contact Information
 * - Localization & Currency
 * - Shipping & Fulfillment Thresholds
 * - Payment & Checkout Configuration
 * - Inventory & Order Automation
 */
export const AdminSettingsTab = () => {
  const { showToast, currency, setCurrency } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  // Settings form state
  const [settings, setSettings] = useState({
    storeName: 'UrbanCart Atelier Goods',
    tagline: 'Curated Editorial Lifestyle Goods & Functional Objects',
    supportEmail: 'ops.support@urbancart.internal',
    contactPhone: '+1 (555) 019-2834',
    atelierAddress: 'Nordic Distribution Hub, Grev Turegatan 14, 114 46 Stockholm, Sweden',
    defaultCurrency: currency || 'USD',
    timezone: 'UTC+1 (Stockholm, Berlin, Paris)',
    unitSystem: 'metric',
    freeShippingThreshold: 250,
    standardShippingFee: 15,
    estimatedLeadTime: '2-4 Business Days via DHL Express',
    enableCardPayment: true,
    enableDigitalWallets: true,
    enableCashOnDelivery: false,
    taxRate: 8.0,
    lowStockThreshold: 5,
    autoArchiveOrders: true,
    sendEmailNotifications: true
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminService.saveStoreSettings(settings);
      if (settings.defaultCurrency !== currency && setCurrency) {
        setCurrency(settings.defaultCurrency);
      }
      showToast('Store settings saved and synchronized successfully', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px' }}>
      {/* Top Banner Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            STOREFRONT SYSTEM SETTINGS
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            Store Configuration &amp; Policies
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', margin: 0 }}>
            Configure global store parameters, freight thresholds, checkout gateways, and automated logistics.
          </p>
        </div>

        <Button type="submit" variant="primary" size="md" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'SAVE SYSTEM SETTINGS'}
        </Button>
      </div>

      {/* 1. General Store Identity & Contact Information */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>1. Store Identity &amp; Contact Information</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Storefront Name *"
            value={settings.storeName}
            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            required
          />

          <Input
            label="Tagline / Editorial Subtitle"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />

          <Input
            label="Operations &amp; Support Email *"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            required
          />

          <Input
            label="Customer Service Phone"
            value={settings.contactPhone}
            onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Physical Distribution Hub / Dispatch Address"
              value={settings.atelierAddress}
              onChange={(e) => setSettings({ ...settings, atelierAddress: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 2. Localization & Currency */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          2. Localization &amp; Currency
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
              DEFAULT CURRENCY
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="USD">USD ($) • United States</option>
              <option value="EUR">EUR (€) • European Union</option>
              <option value="GBP">GBP (£) • United Kingdom</option>
              <option value="JPY">JPY (¥) • Japan</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
              TIMEZONE
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="UTC+1 (Stockholm, Berlin, Paris)">UTC+1 (Stockholm, Berlin, Paris)</option>
              <option value="UTC-5 (New York, Toronto)">UTC-5 (New York, Toronto)</option>
              <option value="UTC+0 (London, Dublin)">UTC+0 (London, Dublin)</option>
              <option value="UTC+9 (Tokyo, Seoul)">UTC+9 (Tokyo, Seoul)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
              MEASUREMENT SYSTEM
            </label>
            <select
              value={settings.unitSystem}
              onChange={(e) => setSettings({ ...settings, unitSystem: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <option value="metric">Metric (kg, cm, mm)</option>
              <option value="imperial">Imperial (lb, in, ft)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Shipping & Fulfillment Thresholds */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          3. Shipping &amp; Delivery Thresholds
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="Free Worldwide Express Freight Threshold ($)"
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
          />

          <Input
            label="Standard Courier Surcharge ($)"
            type="number"
            value={settings.standardShippingFee}
            onChange={(e) => setSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
          />

          <div style={{ gridColumn: 'span 2' }}>
            <Input
              label="Fulfillment Dispatch SLA Note"
              value={settings.estimatedLeadTime}
              onChange={(e) => setSettings({ ...settings, estimatedLeadTime: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 4. Payment Methods & Order Automation */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          4. Payment Gateways &amp; Order Policies
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card payments */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={settings.enableCardPayment}
              onChange={(e) => setSettings({ ...settings, enableCardPayment: e.target.checked })}
              style={{ accentColor: '#0f1115', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 700, color: '#111827' }}>Accept Major Credit &amp; Debit Cards (Visa, Mastercard, Amex)</span>
          </label>

          {/* Digital Wallets */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={settings.enableDigitalWallets}
              onChange={(e) => setSettings({ ...settings, enableDigitalWallets: e.target.checked })}
              style={{ accentColor: '#0f1115', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 700, color: '#111827' }}>Accept One-Touch Digital Wallets (Apple Pay &amp; Google Pay)</span>
          </label>

          {/* Cash on Delivery */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={settings.enableCashOnDelivery}
              onChange={(e) => setSettings({ ...settings, enableCashOnDelivery: e.target.checked })}
              style={{ accentColor: '#0f1115', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 700, color: '#111827' }}>Enable Cash on Delivery (COD) for eligible metropolitan zones</span>
          </label>

          {/* Auto archive */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={settings.autoArchiveOrders}
              onChange={(e) => setSettings({ ...settings, autoArchiveOrders: e.target.checked })}
              style={{ accentColor: '#0f1115', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 700, color: '#111827' }}>Auto-Archive Delivered Acquisitions after 30 days</span>
          </label>

          {/* Email Notifications */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.8125rem' }}>
            <input
              type="checkbox"
              checked={settings.sendEmailNotifications}
              onChange={(e) => setSettings({ ...settings, sendEmailNotifications: e.target.checked })}
              style={{ accentColor: '#0f1115', width: '16px', height: '16px' }}
            />
            <span style={{ fontWeight: 700, color: '#111827' }}>Send Automated Dispatch &amp; Waybill Tracking Emails to Patrons</span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <Input
            label="Estimated Sales Tax Rate (%)"
            type="number"
            step="0.1"
            value={settings.taxRate}
            onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
          />

          <Input
            label="Low Stock Alert Threshold (Units)"
            type="number"
            value={settings.lowStockThreshold}
            onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Save Settings Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 0' }}>
        <Button type="submit" variant="primary" size="lg" disabled={isSaving}>
          {isSaving ? 'SAVING CHANGES...' : 'SAVE SYSTEM SETTINGS'}
        </Button>
      </div>
    </form>
  );
};
