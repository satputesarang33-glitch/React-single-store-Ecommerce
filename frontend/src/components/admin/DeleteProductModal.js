import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

/**
 * DeleteProductModal Component
 * Confirmation dialog before removing a product from the catalog matrix.
 */
export const DeleteProductModal = ({ isOpen, onClose, productToDelete }) => {
  const { deleteProduct, formatPrice } = useStore();

  if (!productToDelete) return null;

  const handleDelete = () => {
    deleteProduct(productToDelete.id);
    onClose();
  };

  const img = productToDelete.images?.[0]?.url || productToDelete.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="480px"
      title="Delete Product Confirmation"
      subtitle="Verify catalog specimen removal."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Product preview box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px'
        }}>
          <img
            src={img}
            alt={productToDelete.title || productToDelete.name}
            style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.875rem' }}>
              {productToDelete.title || productToDelete.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>
              SKU: {productToDelete.sku} • {formatPrice(productToDelete.price)}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
          Are you sure you want to delete this product from the inventory ledger? This action cannot be undone and will immediately remove the specimen from all public storefront collections.
        </p>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            CONFIRM DELETE PRODUCT
          </button>
        </div>
      </div>
    </Modal>
  );
};
