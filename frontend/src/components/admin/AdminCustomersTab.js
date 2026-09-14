import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/api/adminService';
import { Badge } from '../common/Badge';
import { SearchIcon } from '../Icons';

/**
 * AdminCustomersTab Component
 * Backoffice Customer Directory with:
 * - Customer list
 * - Name
 * - Email
 * - Phone
 * - Registration date
 * - Order count
 * - Search filter & summary metrics
 */
export const AdminCustomersTab = () => {
  const { formatPrice } = useStore();
  const defaultPatrons = [
    { id: 'c-1', name: 'Alex Vance', email: 'alex.vance@atelier-member.org', phone: '+1 (555) 234-8901', registrationDate: '2023-11-14', tier: 'ELITE', spent: 1840, ordersCount: 8, location: 'Stockholm, Sweden' },
    { id: 'c-2', name: 'Julian Mercer', email: 'j.mercer@atelier.co', phone: '+46 8 123 4567', registrationDate: '2024-01-20', tier: 'ELITE', spent: 1420, ordersCount: 5, location: 'Stockholm, Sweden' },
    { id: 'c-3', name: 'Elena Rostova', email: 'e.rostova@studio.at', phone: '+43 1 711 0022', registrationDate: '2024-03-08', tier: 'VIP', spent: 920, ordersCount: 3, location: 'Vienna, Austria' },
    { id: 'c-4', name: 'Kaelen Voss', email: 'k.voss@design.de', phone: '+49 30 901820', registrationDate: '2024-05-19', tier: 'MEMBER', spent: 480, ordersCount: 2, location: 'Berlin, Germany' },
    { id: 'c-5', name: 'Marc Becker', email: 'm.becker@atelier.ch', phone: '+41 44 632 1111', registrationDate: '2024-07-02', tier: 'MEMBER', spent: 310, ordersCount: 1, location: 'Zurich, Switzerland' },
    { id: 'c-6', name: 'Sophia Lin', email: 'sophia.lin@designstudio.sg', phone: '+65 6790 5111', registrationDate: '2024-08-15', tier: 'VIP', spent: 760, ordersCount: 4, location: 'Singapore' }
  ];

  const [customers, setCustomers] = useState(defaultPatrons);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    adminService.getCustomers().then(data => {
      if (data && data.length > 0) {
        setCustomers(data);
      }
    });
  }, []);

  // Filter customers by name, email, or phone
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      (cust.name || '').toLowerCase().includes(q) ||
      (cust.email || '').toLowerCase().includes(q) ||
      (cust.phone || '').toLowerCase().includes(q) ||
      (cust.location || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* 1. Header & Summary Stats */}
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
            PATRON DIRECTORY
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
            Customer List ({filteredCustomers.length} Registered Patrons)
          </h2>
        </div>

        {/* Customer Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f3f4f6',
          borderRadius: '9999px',
          padding: '6px 14px',
          width: '280px'
        }}>
          <SearchIcon size={14} />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.75rem', width: '100%' }}
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
      </div>

      {/* 2. Customer List Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>NAME</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>EMAIL</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>PHONE</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>REGISTRATION DATE</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>ORDER COUNT</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>LIFETIME VALUE</th>
              <th style={{ padding: '12px 10px', fontWeight: 700 }}>MEMBERSHIP</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  No patrons found matching your search.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                // Generate initials for avatar circle
                const initials = (cust.name || 'P')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr
                    key={cust.id}
                    style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafaf9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Name */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#0f1115',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.6875rem',
                          fontWeight: 800
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#111827' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#6b7280' }}>{cust.location || 'Global Patron'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '12px 10px', color: '#4b5563' }}>
                      {cust.email}
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '12px 10px', color: '#111827', fontWeight: 600 }}>
                      {cust.phone || '+1 (555) 019-2834'}
                    </td>

                    {/* Registration Date */}
                    <td style={{ padding: '12px 10px', color: '#6b7280' }}>
                      {cust.registrationDate || '2024-01-15'}
                    </td>

                    {/* Order Count */}
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                      {cust.ordersCount} {cust.ordersCount === 1 ? 'order' : 'orders'}
                    </td>

                    {/* Lifetime Value */}
                    <td style={{ padding: '12px 10px', fontWeight: 800, color: '#059669' }}>
                      {formatPrice(cust.spent)}
                    </td>

                    {/* Membership */}
                    <td style={{ padding: '12px 10px' }}>
                      <Badge variant={cust.tier === 'ELITE' ? 'warning' : 'neutral'}>
                        {cust.tier}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
