import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrdersPage } from './OrdersPage';
import { OrderDetailsPage } from './OrderDetailsPage';
import { StoreProvider, useStore } from '../context/StoreContext';

// Mock window.scrollTo
beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe('14. My Orders & Order Details Page Suite', () => {
  describe('My Orders Page (OrdersPage)', () => {
    it('renders Order ID, Order date, Total amount, Payment status, Order status, and View Details button for orders', () => {
      render(
        <StoreProvider>
          <OrdersPage />
        </StoreProvider>
      );

      // Page Title & Breadcrumb
      expect(screen.getByRole('heading', { level: 1, name: /My Orders/i })).toBeInTheDocument();
      expect(screen.getByText(/PATRON DISPATCH LEDGER/i)).toBeInTheDocument();

      // Check first seed order (#UC-98214-X)
      // 1. Order ID
      expect(screen.getByText(/Order ID: #UC-98214-X/i)).toBeInTheDocument();

      // 2. Order date
      expect(screen.getByText(/2024-10-31 14:22/i)).toBeInTheDocument();

      // 3. Total amount
      expect(screen.getByText('$245.00')).toBeInTheDocument();

      // 4. Payment status
      expect(screen.getByTestId('order-payment-status-ord-98214')).toHaveTextContent(/CAPTURED/i);

      // 5. Order status
      expect(screen.getByTestId('order-status-ord-98214')).toHaveTextContent(/COURIER DISPATCHED/i);

      // 6. View Details button
      const viewDetailsBtn = screen.getByTestId('view-order-details-ord-98214');
      expect(viewDetailsBtn).toBeInTheDocument();
      expect(viewDetailsBtn).toHaveTextContent(/View Details/i);
    });

    it('filters orders by status (All, Active, Delivered) and searches orders', () => {
      render(
        <StoreProvider>
          <OrdersPage />
        </StoreProvider>
      );

      // Filter: Delivered
      const deliveredFilter = screen.getByTestId('filter-orders-delivered');
      fireEvent.click(deliveredFilter);

      // Delivered order should be visible
      expect(screen.getByText(/#UC-98212-Z/i)).toBeInTheDocument();
      // Dispatched order should not match delivered filter
      expect(screen.queryByText(/#UC-98214-X/i)).not.toBeInTheDocument();

      // Search bar
      const searchInput = screen.getByTestId('orders-page-search-input');
      fireEvent.change(searchInput, { target: { value: 'Ceramic' } });

      // Reset filter to all to test search across all
      const allFilter = screen.getByTestId('filter-orders-all');
      fireEvent.click(allFilter);

      expect(screen.getByText(/#UC-98213-Y/i)).toBeInTheDocument();
    });
  });

  describe('Order Details Page (OrderDetailsPage)', () => {
    it('shows Ordered products, Shipping address, Payment method, Order timeline, and Total amount', () => {
      render(
        <StoreProvider>
          <OrderDetailsPage />
        </StoreProvider>
      );

      // Order ID & Status Header
      expect(screen.getByTestId('order-details-id')).toHaveTextContent(/#UC-98214-X/i);
      expect(screen.getByTestId('order-details-status-badge')).toHaveTextContent(/COURIER DISPATCHED/i);

      // 1. Order timeline
      const timelineSection = screen.getByTestId('section-order-timeline');
      expect(timelineSection).toBeInTheDocument();
      expect(screen.getByText('Order Timeline')).toBeInTheDocument();
      expect(screen.getByText('Order Placed')).toBeInTheDocument();
      expect(screen.getByText('Payment Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Quality Inspected')).toBeInTheDocument();
      expect(screen.getByText('Courier Handover')).toBeInTheDocument();

      // 2. Ordered products
      const productsSection = screen.getByTestId('section-ordered-products');
      expect(productsSection).toBeInTheDocument();
      expect(screen.getByText(/Ordered Products/i)).toBeInTheDocument();
      expect(screen.getByText('UrbanCart Mono Low-Top Sneaker')).toBeInTheDocument();
      expect(screen.getByText('UrbanCart Heavyweight Pima Cotton Tee')).toBeInTheDocument();

      // 3. Shipping address
      const addressSection = screen.getByTestId('section-shipping-address');
      expect(addressSection).toBeInTheDocument();
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();
      expect(screen.getByText('Julian Mercer')).toBeInTheDocument();
      expect(screen.getByText(/Grev Turegatan 14, 3TR/i)).toBeInTheDocument();
      expect(screen.getByText(/Stockholm/i)).toBeInTheDocument();

      // 4. Payment method
      const paymentSection = screen.getByTestId('section-payment-method');
      expect(paymentSection).toBeInTheDocument();
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
      expect(paymentSection).toHaveTextContent(/VISA/i);
      expect(paymentSection).toHaveTextContent(/•••• •••• •••• 4242/i);

      // 5. Total amount
      const totalSection = screen.getByTestId('section-total-amount');
      expect(totalSection).toBeInTheDocument();
      expect(screen.getByText(/Financial Summary & Total Amount/i)).toBeInTheDocument();
      expect(screen.getByTestId('order-details-grand-total')).toHaveTextContent('$245.00');

      // Navigational controls
      expect(screen.getByTestId('back-to-orders-btn')).toBeInTheDocument();
      expect(screen.getByTestId('download-pdf-invoice-btn')).toBeInTheDocument();
      expect(screen.getByTestId('order-details-reorder-btn')).toBeInTheDocument();
    });
  });

  describe('Integration Flow: Navigating from Orders to Order Details', () => {
    const TestOrderFlowApp = () => {
      const { activeView, setActiveView } = useStore();
      return (
        <div>
          <button onClick={() => setActiveView('orders')} data-testid="nav-to-orders">
            Go To Orders
          </button>
          {activeView === 'orders' && <OrdersPage />}
          {activeView === 'order_details' && <OrderDetailsPage />}
        </div>
      );
    };

    it('clicking View Details navigates to Order Details and back button returns to My Orders', () => {
      render(
        <StoreProvider>
          <TestOrderFlowApp />
        </StoreProvider>
      );

      // Navigate to orders view
      fireEvent.click(screen.getByTestId('nav-to-orders'));
      expect(screen.getByRole('heading', { level: 1, name: /My Orders/i })).toBeInTheDocument();

      // Click "View Details" on the first order
      const viewDetailsBtn = screen.getByTestId('view-order-details-ord-98214');
      fireEvent.click(viewDetailsBtn);

      // Verify we are on Order Details page
      expect(screen.getByTestId('order-details-id')).toHaveTextContent(/#UC-98214-X/i);
      expect(screen.getByTestId('section-ordered-products')).toBeInTheDocument();
      expect(screen.getByTestId('section-order-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('section-shipping-address')).toBeInTheDocument();
      expect(screen.getByTestId('section-payment-method')).toBeInTheDocument();
      expect(screen.getByTestId('section-total-amount')).toBeInTheDocument();

      // Click "← Back to My Orders"
      const backBtn = screen.getByTestId('back-to-orders-btn');
      fireEvent.click(backBtn);

      // Verify returned to My Orders page
      expect(screen.getByRole('heading', { level: 1, name: /My Orders/i })).toBeInTheDocument();
    });
  });
});

