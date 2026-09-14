import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StoreProvider, useStore, CURRENCY_CONFIG } from './StoreContext';
import { StorefrontNav } from '../components/StorefrontNav';
import { CurrencyModal } from '../components/CurrencyModal';

// Test consumer component to verify formatPrice and currency switching
const CurrencyTestConsumer = () => {
  const { currency, setCurrency, formatPrice } = useStore();

  return (
    <div>
      <div data-testid="current-currency">{currency}</div>
      <div data-testid="price-sneakers">{formatPrice(160)}</div>
      <div data-testid="price-backpack">{formatPrice(85)}</div>
      <div data-testid="price-expensive">{formatPrice(1200)}</div>
      <button data-testid="set-inr-btn" onClick={() => setCurrency('INR')}>
        Set INR
      </button>
      <button data-testid="set-usd-btn" onClick={() => setCurrency('USD')}>
        Set USD
      </button>
    </div>
  );
};

describe('Indian Currency (INR / ₹) System', () => {
  it('contains INR in CURRENCY_CONFIG with symbol ₹', () => {
    expect(CURRENCY_CONFIG.INR).toBeDefined();
    expect(CURRENCY_CONFIG.INR.symbol).toBe('₹');
    expect(CURRENCY_CONFIG.INR.rate).toBe(86.5);
    expect(CURRENCY_CONFIG.INR.label).toMatch(/INR/);
  });

  it('formats prices in Indian Rupees (₹) with Indian numbering format when INR is selected', () => {
    render(
      <StoreProvider>
        <CurrencyTestConsumer />
      </StoreProvider>
    );

    // Initially in test mode it starts with USD
    expect(screen.getByTestId('current-currency')).toHaveTextContent('USD');
    expect(screen.getByTestId('price-sneakers')).toHaveTextContent('$160.00');

    // Switch to Indian Currency (INR)
    act(() => {
      fireEvent.click(screen.getByTestId('set-inr-btn'));
    });

    expect(screen.getByTestId('current-currency')).toHaveTextContent('INR');
    
    // Check that Indian Rupee symbol is displayed
    const sneakerPrice = screen.getByTestId('price-sneakers').textContent;
    expect(sneakerPrice).toContain('₹');
    // 160 * 86.5 = 13,840
    expect(sneakerPrice).toBe('₹13,840');

    // 85 * 86.5 = 7,353 (rounded)
    const backpackPrice = screen.getByTestId('price-backpack').textContent;
    expect(backpackPrice).toContain('₹');
    expect(backpackPrice).toBe('₹7,353');

    // 1200 * 86.5 = 1,03,800 (Indian lakh numbering)
    const expensivePrice = screen.getByTestId('price-expensive').textContent;
    expect(expensivePrice).toContain('₹');
    expect(expensivePrice).toBe('₹1,03,800');
  });

  it('opens CurrencyModal from StorefrontNav and selects INR', () => {
    render(
      <StoreProvider>
        <StorefrontNav />
        <CurrencyModal />
        <CurrencyTestConsumer />
      </StoreProvider>
    );

    // Nav currency switcher pill exists
    const navPill = screen.getByTestId('nav-currency-switcher');
    expect(navPill).toBeInTheDocument();

    // Click to open CurrencyModal
    fireEvent.click(navPill);

    // Currency modal opens with heading
    expect(screen.getByRole('heading', { name: /Select Currency & Region/i })).toBeInTheDocument();

    // Click on INR option
    const inrOption = screen.getByText(/INR \(₹\) • India/i);
    expect(inrOption).toBeInTheDocument();
    fireEvent.click(inrOption);

    // The active currency should now be INR
    expect(screen.getByTestId('current-currency')).toHaveTextContent('INR');
    expect(screen.getByTestId('price-sneakers').textContent).toContain('₹');
  });
});
