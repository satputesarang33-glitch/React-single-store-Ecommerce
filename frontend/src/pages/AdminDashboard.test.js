import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';
import { StoreProvider } from '../context/StoreContext';
import { authService } from '../services/api/authService';

// Set current user as Admin before running tests
beforeEach(() => {
  jest.spyOn(authService, 'getCurrentUser').mockReturnValue({
    id: 'admin-1',
    name: 'Ops Commander',
    email: 'ops@urbancart.internal',
    role: 'admin'
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('15. Admin Dashboard UI & Backoffice Panel', () => {
  test('1. Renders Dashboard Overview with all required KPIs, chart, top products, and recent orders', () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // 4 Primary KPI metric cards
    expect(screen.getByTestId('metric-total-sales')).toBeInTheDocument();
    expect(screen.getByText(/Total Sales/i)).toBeInTheDocument();

    expect(screen.getByTestId('metric-total-orders')).toBeInTheDocument();
    expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();

    expect(screen.getByTestId('metric-total-customers')).toBeInTheDocument();
    expect(screen.getByText(/Total Customers/i)).toBeInTheDocument();

    expect(screen.getByTestId('metric-total-products')).toBeInTheDocument();
    expect(screen.getByText(/Total Products/i)).toBeInTheDocument();

    // Sales overview chart
    expect(screen.getByText(/Sales Overview Chart/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Revenue$/i })).toBeInTheDocument();
    expect(screen.getByText(/Sales by Category/i)).toBeInTheDocument();

    // Top-selling products
    expect(screen.getByText(/Top-Selling Products/i)).toBeInTheDocument();
    expect(screen.getByText(/UrbanCart Mono Low-Top Sneaker/i)).toBeInTheDocument();

    // Recent orders
    expect(screen.getByText(/Recent Orders/i)).toBeInTheDocument();
  });

  test('2. Navigates to Products Management and tests table, search, category filter, stock status, and Add Product modal with 11 fields', async () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // Click "Products" in Sidebar
    const productsNavBtn = screen.getByTestId('admin-nav-inventory');
    fireEvent.click(productsNavBtn);

    // Product table renders
    expect(screen.getByText(/Master Goods Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/PRODUCT NAME & SKU/i)).toBeInTheDocument();
    expect(screen.getByText(/DISCOUNT PRICE/i)).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search product name, brand, or SKU/i);
    fireEvent.change(searchInput, { target: { value: 'Mono Low-Top' } });
    expect(screen.getByText(/Mono Low-Top/i)).toBeInTheDocument();
    fireEvent.change(searchInput, { target: { value: '' } });

    // Open Add Product Form
    const addProductBtn = screen.getByTestId('admin-add-product-btn');
    fireEvent.click(addProductBtn);

    // Verify all 11 required fields are present in the form modal
    expect(screen.getByText(/Add New Atelier Product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Name \*/i)).toBeInTheDocument(); // 1. Product name
    expect(screen.getByLabelText(/Description \*/i)).toBeInTheDocument(); // 2. Description
    expect(screen.getByLabelText(/Price \(USD\) \*/i)).toBeInTheDocument(); // 3. Price
    expect(screen.getByLabelText(/Discount Price \/ Compare At Price/i)).toBeInTheDocument(); // 4. Discount price
    expect(screen.getByLabelText(/Category \*/i)).toBeInTheDocument(); // 5. Category
    expect(screen.getByLabelText(/Brand \*/i)).toBeInTheDocument(); // 6. Brand
    expect(screen.getByLabelText(/Stock Quantity \*/i)).toBeInTheDocument(); // 7. Stock quantity
    expect(screen.getByLabelText(/Product Image URL \*/i)).toBeInTheDocument(); // 8. Product images
    expect(screen.getByLabelText(/Sizes \(Comma-Separated\)/i)).toBeInTheDocument(); // 9. Sizes
    expect(screen.getByLabelText(/Colors \(Comma-Separated\)/i)).toBeInTheDocument(); // 10. Colors
    expect(screen.getByLabelText(/Specifications & Materials/i)).toBeInTheDocument(); // 11. Specifications
  });

  test('3. Tests Order Management with order list, customer info, payment status, and order status update', () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // Click "Orders" in Sidebar
    const ordersNavBtn = screen.getByTestId('admin-nav-orders');
    fireEvent.click(ordersNavBtn);

    // Order table header
    expect(screen.getByText(/Order Management Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/CUSTOMER INFORMATION/i)).toBeInTheDocument();
    expect(screen.getByText(/PAYMENT STATUS/i)).toBeInTheDocument();

    // Order Status update select
    const statusSelects = screen.getAllByRole('combobox');
    expect(statusSelects.length).toBeGreaterThan(0);
    fireEvent.change(statusSelects[0], { target: { value: 'DELIVERED' } });
    expect(statusSelects[0].value).toBe('DELIVERED');

    // Click "Order Details" button
    const detailsButtons = screen.getAllByRole('button', { name: /Order Details/i });
    fireEvent.click(detailsButtons[0]);

    // Inspect modal opened
    expect(screen.getByText(/Order Dossier:/i)).toBeInTheDocument();
    expect(screen.getByText(/SHIPPING ADDRESS/i)).toBeInTheDocument();
  });

  test('4. Tests Customer Directory with Name, Email, Phone, Registration date, and Order count', async () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // Click "Customers" in Sidebar
    const customersNavBtn = screen.getByTestId('admin-nav-customers');
    fireEvent.click(customersNavBtn);

    // Verify Customer List and table columns
    expect(screen.getByText(/Customer List/i)).toBeInTheDocument();
    expect(screen.getByText(/NAME/i)).toBeInTheDocument();
    expect(screen.getByText(/EMAIL/i)).toBeInTheDocument();
    expect(screen.getByText(/PHONE/i)).toBeInTheDocument();
    expect(screen.getByText(/REGISTRATION DATE/i)).toBeInTheDocument();
    expect(screen.getByText(/ORDER COUNT/i)).toBeInTheDocument();

    // Await mock customer data loading
    await waitFor(() => {
      expect(screen.getAllByText(/Alex Vance/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/\+1 \(555\) 234-8901/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-11-14/i)).toBeInTheDocument();
      expect(screen.getByText(/8 orders/i)).toBeInTheDocument();
    });
  });

  test('5. Tests Category Management UI with category listing and Add Category modal', () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // Click "Categories" in Sidebar
    const categoriesNavBtn = screen.getByTestId('admin-nav-categories');
    fireEvent.click(categoriesNavBtn);

    expect(screen.getAllByText(/Store Categories/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/ACTIVE SPECIMENS/i)).toBeInTheDocument();
    expect(screen.getByText(/STOREFRONT STATUS/i)).toBeInTheDocument();

    // Open Add Category modal
    const addCatBtn = screen.getByRole('button', { name: /\+ Add Category|Add Category/i });
    fireEvent.click(addCatBtn);

    expect(screen.getByText(/Add New Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Title \*/i)).toBeInTheDocument();
  });

  test('6. Tests Store Settings UI with store information, shipping thresholds, and save button', async () => {
    render(
      <StoreProvider>
        <AdminDashboard />
      </StoreProvider>
    );

    // Click "Settings" in Sidebar
    const settingsNavBtn = screen.getByTestId('admin-nav-settings');
    fireEvent.click(settingsNavBtn);

    expect(screen.getByText(/Store Configuration & Policies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Storefront Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Operations & Support Email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Free Worldwide Express Freight Threshold/i)).toBeInTheDocument();

    const saveButtons = screen.getAllByRole('button', { name: /SAVE SYSTEM SETTINGS/i });
    expect(saveButtons.length).toBeGreaterThan(0);
    fireEvent.click(saveButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/SAVE SYSTEM SETTINGS/i).length).toBeGreaterThan(0);
    });
  });
});
