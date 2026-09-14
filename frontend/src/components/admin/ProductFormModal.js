import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

/**
 * ProductFormModal Component
 * Unified Add & Edit modal supporting all 11 required fields:
 * 1. Product name
 * 2. Description
 * 3. Price
 * 4. Discount price
 * 5. Category
 * 6. Brand
 * 7. Stock quantity
 * 8. Product images
 * 9. Sizes
 * 10. Colors
 * 11. Specifications
 */
export const ProductFormModal = ({ isOpen, onClose, productToEdit = null }) => {
  const { addProduct, updateProduct, showToast } = useStore();
  const isEditing = Boolean(productToEdit);

  // Form state initialized with empty or productToEdit fields
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'Footwear',
    brand: 'UrbanCart Atelier',
    stockQuantity: '25',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
    sizes: 'US 8, US 9, US 10, US 11',
    colors: 'Chalk White, Obsidian Noir',
    specifications: 'Full-grain Italian calfskin, Margom vulcanized rubber outsole'
  });

  // Populate form fields when modal opens or productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      // Format sizes into comma separated string if array
      let sizesStr = 'Standard';
      if (Array.isArray(productToEdit.sizes)) {
        sizesStr = productToEdit.sizes.map(s => typeof s === 'object' ? s.size : s).join(', ');
      } else if (typeof productToEdit.sizes === 'string') {
        sizesStr = productToEdit.sizes;
      }

      // Format colors into comma separated string if array
      let colorsStr = 'Standard';
      if (Array.isArray(productToEdit.colorways)) {
        colorsStr = productToEdit.colorways.map(c => typeof c === 'object' ? c.name : c).join(', ');
      } else if (Array.isArray(productToEdit.colors)) {
        colorsStr = productToEdit.colors.join(', ');
      }

      // Format specifications
      let specsStr = '';
      if (typeof productToEdit.specifications === 'string') {
        specsStr = productToEdit.specifications;
      } else if (productToEdit.provenance?.materials) {
        specsStr = `${productToEdit.provenance.materials} (Origin: ${productToEdit.provenance.origin || 'Europe'})`;
      } else if (typeof productToEdit.specifications === 'object') {
        specsStr = Object.entries(productToEdit.specifications || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
      }

      const img = productToEdit.images?.[0]?.url || productToEdit.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600';

      setForm({
        title: productToEdit.title || productToEdit.name || '',
        description: productToEdit.editorialDescription || productToEdit.description || '',
        price: productToEdit.price !== undefined ? productToEdit.price.toString() : '',
        compareAtPrice: productToEdit.compareAtPrice ? productToEdit.compareAtPrice.toString() : '',
        category: productToEdit.category || 'Footwear',
        brand: productToEdit.brand || 'UrbanCart Atelier',
        stockQuantity: (productToEdit.stockQuantity !== undefined ? productToEdit.stockQuantity : (productToEdit.stock || 25)).toString(),
        imageUrl: img,
        sizes: sizesStr || 'US 8, US 9, US 10, US 11',
        colors: colorsStr || 'Chalk White, Obsidian Noir',
        specifications: specsStr || 'Premium handcrafted atelier goods'
      });
    } else {
      // Default reset for Add mode
      setForm({
        title: '',
        description: 'Disciplined design crafted with premium materials and ergonomic fit.',
        price: '180',
        compareAtPrice: '220',
        category: 'Footwear',
        brand: 'UrbanCart Atelier',
        stockQuantity: '30',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
        sizes: 'US 8, US 9, US 10, US 11',
        colors: 'Chalk White, Obsidian Noir',
        specifications: 'Full-grain Italian calfskin, Margom vulcanized sole'
      });
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast('Please enter a valid product name', 'error');
      return;
    }

    if (!form.price || isNaN(Number(form.price))) {
      showToast('Please specify a valid price', 'error');
      return;
    }

    // Convert sizes string to array
    const sizesArray = form.sizes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({ size: s, available: true }));

    // Convert colors string to colorways array
    const colorwaysArray = form.colors
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)
      .map((c, i) => ({
        name: c,
        hex: i === 0 ? '#0f1115' : i === 1 ? '#F5F5F0' : '#4b5563'
      }));

    const formattedProduct = {
      title: form.title.trim(),
      name: form.title.trim(),
      description: form.description.trim(),
      editorialDescription: form.description.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      category: form.category,
      brand: form.brand.trim() || 'UrbanCart Atelier',
      stockQuantity: Number(form.stockQuantity) || 0,
      stock: Number(form.stockQuantity) || 0,
      inStock: Number(form.stockQuantity) > 0,
      images: [{ url: form.imageUrl.trim() || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600', isPrimary: true }],
      sizes: sizesArray.length > 0 ? sizesArray : [{ size: 'Standard', available: true }],
      colorways: colorwaysArray.length > 0 ? colorwaysArray : [{ name: 'Standard', hex: '#0f1115' }],
      specifications: form.specifications.trim()
    };

    if (isEditing) {
      updateProduct({
        ...productToEdit,
        ...formattedProduct,
        id: productToEdit.id
      });
    } else {
      addProduct(formattedProduct);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="650px"
      title={isEditing ? `Edit Product: ${productToEdit?.title || 'Specimen'}` : 'Add New Atelier Product'}
      subtitle={isEditing ? 'Modify catalog specifications, pricing, and variant matrix.' : 'Create a new specimen with all 11 catalog specifications.'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }}>
        {/* 1. Product Name */}
        <Input
          label="Product Name *"
          placeholder="e.g. Kyoto Minimal Runner"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        {/* 2. Description */}
        <div>
          <label htmlFor="product-form-description" style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
            Description *
          </label>
          <textarea
            id="product-form-description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Detailed editorial description of specimen materials, fit, and origin..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '0.8125rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {/* 3. Price & 4. Discount Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Price (USD) *"
            type="number"
            step="0.01"
            placeholder="160.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            label="Discount Price / Compare At Price ($)"
            type="number"
            step="0.01"
            placeholder="190.00"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
          />
        </div>

        {/* 5. Category & 6. Brand */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label htmlFor="product-form-category" style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
              Category *
            </label>
            <select
              id="product-form-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Footwear">Footwear</option>
              <option value="Premium Sneakers">Premium Sneakers</option>
              <option value="Timepieces">Timepieces</option>
              <option value="Bags & Carry">Bags &amp; Carry</option>
              <option value="Apparel">Apparel</option>
              <option value="Accessories">Accessories</option>
              <option value="Eyewear">Eyewear</option>
            </select>
          </div>

          <Input
            label="Brand *"
            placeholder="e.g. UrbanCart Atelier"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
        </div>

        {/* 7. Stock Quantity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Stock Quantity *"
            type="number"
            placeholder="25"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '4px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Availability Status:
              <strong style={{ marginLeft: '6px', color: Number(form.stockQuantity) > 0 ? '#059669' : '#dc2626' }}>
                {Number(form.stockQuantity) > 0 ? '● In Stock' : '○ Out of Stock'}
              </strong>
            </div>
          </div>
        </div>

        {/* 8. Product Images */}
        <div>
          <Input
            label="Product Image URL *"
            placeholder="https://images.unsplash.com/photo-..."
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
          {form.imageUrl && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={form.imageUrl}
                alt="Product preview"
                style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>Visual specimen preview</span>
            </div>
          )}
        </div>

        {/* 9. Sizes */}
        <Input
          label="Sizes (Comma-Separated)"
          placeholder="e.g. US 8, US 9, US 10, US 11 or S, M, L, XL"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
        />

        {/* 10. Colors */}
        <Input
          label="Colors (Comma-Separated)"
          placeholder="e.g. Chalk White, Obsidian Noir, Sandstone"
          value={form.colors}
          onChange={(e) => setForm({ ...form, colors: e.target.value })}
        />

        {/* 11. Specifications */}
        <div>
          <label htmlFor="product-form-specifications" style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '6px' }}>
            Specifications &amp; Materials
          </label>
          <textarea
            id="product-form-specifications"
            value={form.specifications}
            onChange={(e) => setForm({ ...form, specifications: e.target.value })}
            placeholder="e.g. Full-grain calfskin leather, Margom sole, Waterproof zipper, Origin: Porto"
            rows={2}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '0.8125rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'SAVE PRODUCT CHANGES' : 'PUBLISH PRODUCT TO CATALOG'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
