import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

/**
 * AddProductModal Component
 * Dedicated modal to publish new atelier products into the catalog matrix.
 */
export const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct, showToast } = useStore();

  const [form, setForm] = useState({
    title: '',
    category: 'Footwear',
    brand: 'UrbanCart Studio',
    price: 180,
    compareAtPrice: 210,
    sku: `UC-${Math.floor(100 + Math.random() * 900)}`,
    inStock: true,
    description: 'Disciplined design crafted with premium materials.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      showToast('Please specify a product title', 'error');
      return;
    }

    const newProduct = {
      ...form,
      id: `uc-${Date.now()}`,
      images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400' }],
      rating: 5.0,
      reviewsCount: 1,
      colorways: [{ name: 'Standard', hex: '#0f1115' }],
      sizes: [{ size: 'Default', available: true }]
    };

    addProduct(newProduct);
    onClose();
    setForm({
      title: '',
      category: 'Footwear',
      brand: 'UrbanCart Studio',
      price: 180,
      compareAtPrice: 210,
      sku: `UC-${Math.floor(100 + Math.random() * 900)}`,
      inStock: true,
      description: 'Disciplined design crafted with premium materials.'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="520px"
      title="Create New Atelier Product"
      subtitle="Adds an item directly to the catalog and variant matrix."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Product Title"
          placeholder="e.g. Kyoto Minimal Runner"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
              CATEGORY
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '6px',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Footwear">Footwear</option>
              <option value="Timepieces">Timepieces</option>
              <option value="Bags & Carry">Bags &amp; Carry</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <Input
            label="SKU Identifier"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Input
            label="Price (USD)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
          />
          <Input
            label="Compare At Price"
            type="number"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Brief Dossier Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Button type="submit" variant="primary" fullWidth style={{ marginTop: '10px' }}>
          PUBLISH PRODUCT TO ARCHIVE
        </Button>
      </form>
    </Modal>
  );
};
