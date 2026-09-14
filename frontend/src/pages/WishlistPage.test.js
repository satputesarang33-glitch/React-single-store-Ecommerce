import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { WishlistCard, EmptyWishlist, WishlistPage } from './WishlistPage';
import { StoreProvider } from '../context/StoreContext';

// Mock window.scrollTo
beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe('WishlistCard Component', () => {
  const mockItem = {
    id: 'wl-test-1',
    productId: 'uc-fw-086',
    category: 'FOOTWEAR STUDIO',
    title: 'UrbanCart Mono Low-Top Sneaker',
    finish: 'Chalk White',
    price: 160.00,
    compareAtPrice: 190.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500',
    badge: 'BEST SELLER',
  };

  const mockOnRemove = jest.fn();
  const mockOnAddToCart = jest.fn();
  const mockOnViewProduct = jest.fn();
  const mockFormatPrice = (val) => `$${val.toFixed(2)}`;

  it('renders product image, product name, and price', () => {
    render(
      <WishlistCard
        item={mockItem}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        onViewProduct={mockOnViewProduct}
        formatPrice={mockFormatPrice}
      />
    );

    // 1. Product Name
    expect(screen.getByText('UrbanCart Mono Low-Top Sneaker')).toBeInTheDocument();

    // 2. Product Image
    const img = screen.getByAltText('UrbanCart Mono Low-Top Sneaker');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockItem.image);

    // 3. Price
    expect(screen.getByText('$160.00')).toBeInTheDocument();
    expect(screen.getByText('$190.00')).toBeInTheDocument();
  });

  it('renders Add to Cart button and handles click', () => {
    render(
      <WishlistCard
        item={mockItem}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        onViewProduct={mockOnViewProduct}
        formatPrice={mockFormatPrice}
      />
    );

    const addToCartBtn = screen.getByTestId(`add-to-cart-${mockItem.id}`);
    expect(addToCartBtn).toBeInTheDocument();
    expect(addToCartBtn).toHaveTextContent(/Add to Cart/i);

    fireEvent.click(addToCartBtn);
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockItem);
  });

  it('renders Remove from Wishlist button and handles click', () => {
    render(
      <WishlistCard
        item={mockItem}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        onViewProduct={mockOnViewProduct}
        formatPrice={mockFormatPrice}
      />
    );

    const removeBtn = screen.getByTestId(`remove-from-wishlist-${mockItem.id}`);
    expect(removeBtn).toBeInTheDocument();
    expect(removeBtn).toHaveTextContent(/Remove from Wishlist/i);

    fireEvent.click(removeBtn);
    expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
  });

  it('renders quick remove button in top corner and handles click', () => {
    render(
      <WishlistCard
        item={mockItem}
        onRemove={mockOnRemove}
        onAddToCart={mockOnAddToCart}
        onViewProduct={mockOnViewProduct}
        formatPrice={mockFormatPrice}
      />
    );

    const quickRemoveBtn = screen.getByTestId(`quick-remove-${mockItem.id}`);
    expect(quickRemoveBtn).toBeInTheDocument();

    fireEvent.click(quickRemoveBtn);
    expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
  });
});

describe('EmptyWishlist Component', () => {
  const mockOnShop = jest.fn();
  const mockOnAddToWishlist = jest.fn();
  const mockOnAddToCart = jest.fn();
  const mockProducts = [
    {
      id: 'rec-1',
      title: 'Minimal Ceramic Watch',
      category: 'Horology',
      price: 290.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500',
    }
  ];

  it('renders empty wishlist message and Explore Collection button', () => {
    render(
      <EmptyWishlist
        onShop={mockOnShop}
        recommendedProducts={mockProducts}
        onAddToWishlist={mockOnAddToWishlist}
        onAddToCart={mockOnAddToCart}
        formatPrice={(v) => `$${v.toFixed(2)}`}
      />
    );

    expect(screen.getByText('Your Wishlist is Empty')).toBeInTheDocument();
    const exploreBtn = screen.getByRole('button', { name: /Explore Collection/i });
    expect(exploreBtn).toBeInTheDocument();

    fireEvent.click(exploreBtn);
    expect(mockOnShop).toHaveBeenCalled();
  });
});

describe('WishlistPage Full Integration with StoreProvider', () => {
  const mockUser = {
    id: 'usr_patron_01',
    name: 'Patron User',
    email: 'patron@example.com',
    role: 'customer'
  };

  beforeEach(() => {
    localStorage.setItem('urbancart_user', JSON.stringify(mockUser));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders wishlist page with header and items from StoreProvider', () => {
    render(
      <StoreProvider>
        <WishlistPage />
      </StoreProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /My Wishlist/i })).toBeInTheDocument();
    expect(screen.getByText(/Curated Saved Items/i)).toBeInTheDocument();
  });

  it('renders login gate if user is not signed in', () => {
    const { authService } = require('../services/api/authService');
    const originalGetCurrentUser = authService.getCurrentUser;
    authService.getCurrentUser = () => null;

    render(
      <StoreProvider>
        <WishlistPage />
      </StoreProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /Sign In to View Wishlist/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Your Account/i })).toBeInTheDocument();

    authService.getCurrentUser = originalGetCurrentUser;
  });
});
