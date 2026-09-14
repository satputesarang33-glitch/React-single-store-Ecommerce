import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { detectCardBrand, CardPaymentForm } from '../components/checkout/CardPaymentForm';
import { ThreeDSecureModal } from '../components/checkout/ThreeDSecureModal';
import { UpiPayment } from '../components/checkout/UpiPayment';
import { OrderTrackerModal } from '../components/orders/OrderTrackerModal';
import { InvoiceModal } from '../components/orders/InvoiceModal';

describe('Steps 17-20 Features: Payment Gateway, Discounts, Reviews, Order Tracking & Invoice', () => {

  describe('Step 17: Payment Gateway - Card Brand Detection', () => {
    test('detectCardBrand correctly classifies major card networks', () => {
      expect(detectCardBrand('4532 8821 0000 1234')).toBe('visa');
      expect(detectCardBrand('5100 1234 5678 9012')).toBe('mastercard');
      expect(detectCardBrand('3782 822463 10005')).toBe('amex');
      expect(detectCardBrand('6011 0000 0000 0000')).toBe('discover');
      expect(detectCardBrand('6521 5000 0000 0000')).toBe('rupay');
      expect(detectCardBrand('')).toBe('generic');
    });

    test('CardPaymentForm renders virtual card preview and accepts cardholder input', () => {
      const cardData = {
        nameOnCard: 'ALEX MERCER',
        cardNumber: '4532 8821 9900 1122',
        expiryDate: '12/28',
        cvv: '882'
      };
      const handleChange = jest.fn();

      render(<CardPaymentForm cardData={cardData} onChange={handleChange} />);

      expect(screen.getByText('ALEX MERCER')).toBeInTheDocument();
      expect(screen.getByText('4532 8821 9900 1122')).toBeInTheDocument();
      expect(screen.getAllByText('Visa').length).toBeGreaterThanOrEqual(1);
    });

    test('ThreeDSecureModal validates OTP and executes success handler', () => {
      const handleSuccess = jest.fn();
      const handleCancel = jest.fn();

      render(
        <ThreeDSecureModal
          isOpen={true}
          amount={160}
          formatPrice={(p) => `$${p}.00`}
          cardNumber="4532 •••• •••• 8821"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      );

      expect(screen.getByText(/CENTRAL BANK IDENTITY CHECK/i)).toBeInTheDocument();
      expect(screen.getByText(/882104/i)).toBeInTheDocument();

      // Click Auto-Fill Demo OTP
      const autoFillBtn = screen.getByRole('button', { name: /auto-fill/i });
      fireEvent.click(autoFillBtn);

      const submitBtn = screen.getByRole('button', { name: /authorize payment/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/verifying with bank/i)).toBeInTheDocument();
    });

    test('UpiPayment switches between Dynamic QR and UPI ID and supports fast apps', () => {
      const handleChangeUpi = jest.fn();
      const handleSelectApp = jest.fn();

      render(
        <UpiPayment
          upiId="julian@okhdfcbank"
          onChangeUpiId={handleChangeUpi}
          selectedApp="Google Pay"
          onSelectApp={handleSelectApp}
          amount={160}
        />
      );

      // Default is Dynamic QR Code
      expect(screen.getByText(/Scan with any UPI App/i)).toBeInTheDocument();
      expect(screen.getByText(/QR expires in/i)).toBeInTheDocument();

      // Switch to UPI ID tab
      const upiIdTab = screen.getByRole('button', { name: /UPI ID \/ VPA/i });
      fireEvent.click(upiIdTab);

      expect(screen.getByText(/ENTER UPI ID \/ VPA/i)).toBeInTheDocument();
      expect(screen.getByText(/PhonePe/i)).toBeInTheDocument();
    });
  });

  describe('Step 20: Live Order Tracker & Tax Invoice', () => {
    const mockOrder = {
      id: 'ord-test-8821',
      reference: '#UC-88210-A',
      trackingNumber: 'TRK-9900112233',
      date: 'Sep 4, 2026',
      total: 180,
      subtotal: 160,
      shipping: 5,
      tax: 15,
      courier: 'FedEx Priority Air',
      fulfillmentState: 'COURIER DISPATCHED',
      paymentMethod: 'Credit Card (•••• 8821)',
      paymentStatus: 'PAID & SETTLED',
      customer: {
        fullName: 'Julian Mercer',
        email: 'julian@example.com',
        phone: '+1 (555) 234-5678'
      },
      shippingAddress: {
        address: '742 Evergreen Terrace',
        city: 'Brooklyn',
        state: 'NY',
        pincode: '11201',
        country: 'United States'
      },
      items: [
        {
          id: 'it-1',
          title: 'UrbanCart Mono Low-Top Leather Sneaker',
          price: 160,
          quantity: 1,
          color: 'Chalk White',
          size: 'US 10'
        }
      ]
    };

    test('OrderTrackerModal renders courier milestone pipeline and advances step', () => {
      const handleClose = jest.fn();

      render(
        <OrderTrackerModal
          isOpen={true}
          onClose={handleClose}
          order={mockOrder}
          formatPrice={(p) => `$${p}.00`}
        />
      );

      expect(screen.getByText(/LIVE COURIER RADAR/i)).toBeInTheDocument();
      expect(screen.getByText(/TRK-9900112233/i)).toBeInTheDocument();
      expect(screen.getByText(/FedEx Priority Air/i)).toBeInTheDocument();
      expect(screen.getByText(/In Transit \/ Out for Delivery/i)).toBeInTheDocument();

      // Advance milestone button
      const advanceBtn = screen.getByRole('button', { name: /Advance Next Milestone/i });
      fireEvent.click(advanceBtn);

      expect(screen.getAllByText(/Delivered/i).length).toBeGreaterThanOrEqual(1);
    });

    test('InvoiceModal renders official tax invoice document and print action', () => {
      const handleClose = jest.fn();
      window.print = jest.fn();

      render(
        <InvoiceModal
          isOpen={true}
          onClose={handleClose}
          order={mockOrder}
          formatPrice={(p) => `$${p}.00`}
        />
      );

      expect(screen.getAllByText(/TAX INVOICE/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/INV-UC-88210-A/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/VAT ID: US-94105882104/i)).toBeInTheDocument();
      expect(screen.getByText(/UrbanCart Mono Low-Top Leather Sneaker/i)).toBeInTheDocument();
      expect(screen.getByText(/PAID & SETTLED/i)).toBeInTheDocument();

      // Click Print / Save as PDF button
      const printBtn = screen.getByRole('button', { name: /Print \/ Save as PDF/i });
      fireEvent.click(printBtn);

      expect(window.print).toHaveBeenCalledTimes(1);
    });
  });
});
