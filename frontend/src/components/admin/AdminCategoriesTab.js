import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { categoriesData } from '../../data/products';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { SearchIcon, PlusIcon } from '../Icons';

/**
 * AdminCategoriesTab Component
 * Comprehensive Category Management UI:
 * - Category list with image, slug, active products count, status
 * - Add category modal
 * - Edit category modal
 * - Delete category action
 * - Activate/Deactivate status toggle
 */
export const AdminCategoriesTab = () => {
  const { showToast } = useStore();
  const [categories, setCategories] = useState(categoriesData.map(c => ({ ...c, active: true })));
  const [searchCategory, setSearchCategory] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form for new category
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    itemsCount: 12,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400'
  });

  // Toggle category active status
  const toggleCategoryStatus = (id) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        const next = !c.active;
        showToast(`${c.name} category is now ${next ? 'Active' : 'Hidden'}`, 'info');
        return { ...c, active: next };
      }
      return c;
    }));
  };

  // Add category submit
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) {
      showToast('Please specify a category name', 'error');
      return;
    }
    const slug = newCat.slug.trim() || newCat.name.toLowerCase().replace(/\s+/g, '-');
    const created = {
      id: slug,
      name: newCat.name.toUpperCase(),
      categoryKey: newCat.name,
      itemsCount: Number(newCat.itemsCount) || 1,
      image: newCat.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400',
      active: true
    };
    setCategories([...categories, created]);
    setIsAddModalOpen(false);
    setNewCat({ name: '', slug: '', itemsCount: 12, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400' });
    showToast(`Created category: ${created.name}`, 'success');
  };

  // Edit category submit
  const handleEditCategorySubmit = (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) {
      showToast('Category name cannot be empty', 'error');
      return;
    }
    setCategories(categories.map(c => {
      if (c.id === editingCategory.id) {
        return {
          ...c,
          ...editingCategory,
          name: editingCategory.name.toUpperCase(),
          itemsCount: Number(editingCategory.itemsCount) || c.itemsCount
        };
      }
      return c;
    }));
    setEditingCategory(null);
    showToast(`Updated category "${editingCategory.name}"`, 'success');
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    setCategories(categories.filter(c => c.id !== deletingCategory.id));
    showToast(`Category "${deletingCategory.name}" deleted`, 'info');
    setDeletingCategory(null);
  };

  // Filtered categories
  const filteredCategories = categories.filter(c => {
    const q = searchCategory.toLowerCase();
    return !searchCategory || (c.name || '').toLowerCase().includes(q) || (c.id || '').toLowerCase().includes(q);
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* 1. Header with Add CTA */}
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
            TAXONOMY CONTROL
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            Store Categories ({categories.length} Taxonomy Classes)
          </h2>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          icon={PlusIcon}
        >
          Add Category
        </Button>
      </div>

      {/* 2. Search filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '9999px',
        padding: '6px 14px',
        width: '280px',
        marginBottom: '20px'
      }}>
        <SearchIcon size={14} />
        <input
          type="text"
          placeholder="Search category name or slug..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.75rem', width: '100%' }}
        />
        {searchCategory && (
          <button
            onClick={() => setSearchCategory('')}
            style={{ border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 3. Categories Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>BANNER</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>CATEGORY NAME</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>SLUG IDENTIFIER</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>ACTIVE SPECIMENS</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>STOREFRONT STATUS</th>
              <th style={{ padding: '12px 10px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  No categories found matching your query.
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 10px' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    />
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                    {cat.name}
                  </td>
                  <td style={{ padding: '12px 10px', color: '#6b7280' }}>
                    <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                      /{cat.id}
                    </code>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 700, color: '#111827' }}>
                    {cat.itemsCount} products
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <Badge variant={cat.active ? 'success' : 'neutral'}>
                      {cat.active ? 'Active' : 'Hidden'}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => toggleCategoryStatus(cat.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: cat.active ? '#fef2f2' : '#ecfdf5',
                          color: cat.active ? '#991b1b' : '#065f46',
                          border: `1px solid ${cat.active ? '#fecaca' : '#a7f3d0'}`,
                          cursor: 'pointer'
                        }}
                      >
                        {cat.active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        style={{
                          padding: '4px 10px',
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
                        onClick={() => setDeletingCategory(cat)}
                        style={{
                          padding: '4px 8px',
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="480px"
        title="Add New Category"
        subtitle="Expands master taxonomy across navigation and storefront filters."
      >
        <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Category Title *"
            placeholder="e.g. Leather Accessories"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            required
          />

          <Input
            label="Slug Identifier (optional)"
            placeholder="e.g. leather-accessories"
            value={newCat.slug}
            onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
          />

          <Input
            label="Initial Product Count"
            type="number"
            value={newCat.itemsCount}
            onChange={(e) => setNewCat({ ...newCat, itemsCount: e.target.value })}
          />

          <Input
            label="Banner Image URL"
            value={newCat.image}
            onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              CREATE CATEGORY
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Edit Category Modal */}
      {editingCategory && (
        <Modal
          isOpen={Boolean(editingCategory)}
          onClose={() => setEditingCategory(null)}
          maxWidth="480px"
          title={`Edit Category: ${editingCategory.name}`}
          subtitle="Modify category taxonomy details and banner imagery."
        >
          <form onSubmit={handleEditCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Category Title *"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              required
            />

            <Input
              label="Product Count"
              type="number"
              value={editingCategory.itemsCount}
              onChange={(e) => setEditingCategory({ ...editingCategory, itemsCount: e.target.value })}
            />

            <Input
              label="Banner Image URL"
              value={editingCategory.image}
              onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                SAVE CATEGORY
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 6. Delete Category Confirmation Modal */}
      {deletingCategory && (
        <Modal
          isOpen={Boolean(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
          maxWidth="440px"
          title="Confirm Category Deletion"
          subtitle="Remove taxonomy classification."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.8125rem', color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
              Are you sure you want to delete the category <strong>{deletingCategory.name}</strong>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <Button type="button" variant="outline" onClick={() => setDeletingCategory(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
