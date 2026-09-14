import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchIcon, PlusIcon } from '../Icons';
import { ProductFormModal } from './ProductFormModal';
import { DeleteProductModal } from './DeleteProductModal';

/**
 * AdminProductsTab Component
 * Comprehensive product catalog ledger with:
 * - Product table with detailed columns
 * - Add product form modal (11 fields)
 * - Edit product form modal (11 fields)
 * - Delete product confirmation modal
 * - Product search filter
 * - Category filter
 * - Stock status filter & inline toggle
 */
export const AdminProductsTab = ({ initialOpenAddModal = false }) => {
  const { products, updateProduct, formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK'

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialOpenAddModal);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Filter products by search text, category, and stock status
  const filteredProducts = products.filter((p) => {
    const title = (p.title || p.name || '').toLowerCase();
    const sku = (p.sku || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    // 1. Search Query filter
    const matchesSearch = !searchQuery || title.includes(query) || sku.includes(query) || brand.includes(query) || cat.includes(query);

    // 2. Category filter
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory || (selectedCategory === 'Footwear' && p.category === 'Premium Sneakers');

    // 3. Stock Status filter
    const stockQty = p.stockQuantity !== undefined ? p.stockQuantity : (p.stock !== undefined ? p.stock : (p.inStock ? 20 : 0));
    let matchesStock = true;
    if (stockFilter === 'IN_STOCK') {
      matchesStock = p.inStock && stockQty > 0;
    } else if (stockFilter === 'OUT_OF_STOCK') {
      matchesStock = !p.inStock || stockQty === 0;
    } else if (stockFilter === 'LOW_STOCK') {
      matchesStock = stockQty > 0 && stockQty <= 10;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Extract unique categories for filter dropdown
  const categoriesList = ['ALL', 'Footwear', 'Timepieces', 'Bags & Carry', 'Apparel', 'Accessories', 'Eyewear'];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* 1. Header with Catalog Count & Add Product CTA */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CATALOG MANAGEMENT
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            Master Goods Catalog ({filteredProducts.length} of {products.length} Products)
          </h2>
        </div>

        <Button
          data-testid="admin-add-product-btn"
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          icon={PlusIcon}
        >
          Add Product
        </Button>
      </div>

      {/* 2. Filters Bar: Search, Category Filter, Stock Status Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: '22px',
        flexWrap: 'wrap',
        padding: '14px',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        border: '1px solid #f3f4f6'
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 14px',
          minWidth: '280px',
          flex: 1
        }}>
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search product name, brand, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.8125rem',
              width: '100%'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#111827'
              }}
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563' }}>Stock Status:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '0.8125rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#111827'
              }}
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="LOW_STOCK">Low Stock (≤ 10)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Product Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>PRODUCT NAME &amp; SKU</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>CATEGORY</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>BRAND</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>PRICE</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>DISCOUNT PRICE</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>QUANTITY</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>STOCK STATUS</th>
              <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '48px 16px', textAlign: 'center', color: '#9ca3af' }}>
                  No products found matching your search or filter parameters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const img = p.images?.[0]?.url || p.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200';
                const stockQty = p.stockQuantity !== undefined ? p.stockQuantity : (p.stock !== undefined ? p.stock : (p.inStock ? 20 : 0));

                return (
                  <tr
                    key={p.id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Product Name & SKU */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={img}
                          alt={p.title || p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, color: '#111827' }}>{p.title || p.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>SKU: {p.sku || p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 10px' }}>
                      <Badge variant="neutral">{p.category}</Badge>
                    </td>

                    {/* Brand */}
                    <td style={{ padding: '12px 10px', color: '#4b5563', fontWeight: 600 }}>
                      {p.brand || 'UrbanCart Atelier'}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                      {formatPrice(p.price)}
                    </td>

                    {/* Discount Price */}
                    <td style={{ padding: '12px 10px', color: p.compareAtPrice ? '#6b7280' : '#9ca3af' }}>
                      {p.compareAtPrice ? formatPrice(p.compareAtPrice) : '—'}
                    </td>

                    {/* Stock Quantity */}
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: stockQty <= 10 ? '#dc2626' : '#111827' }}>
                      {stockQty} units
                    </td>

                    {/* Stock Status & Quick Toggle */}
                    <td style={{ padding: '12px 10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const nextInStock = !p.inStock;
                          updateProduct({
                            ...p,
                            inStock: nextInStock,
                            stockQuantity: nextInStock ? (p.stockQuantity || 25) : 0
                          });
                        }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: p.inStock ? '#ecfdf5' : '#fef2f2',
                          color: p.inStock ? '#065f46' : '#991b1b',
                          border: `1px solid ${p.inStock ? '#a7f3d0' : '#fecaca'}`,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Click to toggle stock status"
                      >
                        <span>{p.inStock ? '●' : '○'}</span>
                        <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: '#f3f4f6',
                            color: '#111827',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProduct(p)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fee2e2',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        productToEdit={null}
      />

      {/* 5. Edit Product Modal */}
      <ProductFormModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        productToEdit={editingProduct}
      />

      {/* 6. Delete Product Confirmation Modal */}
      <DeleteProductModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        productToDelete={deletingProduct}
      />
    </div>
  );
};
