import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountPage } from './AccountPage';
import { StoreProvider, useStore } from '../context/StoreContext';

// Mock window.scrollTo
beforeAll(() => {
  window.scrollTo = jest.fn();
});

// Helper component to render AccountPage with custom initial store state or actions
const RenderAccountPage = () => {
  return (
    <StoreProvider>
      <AccountPage />
    </StoreProvider>
  );
};

const mockCustomerUser = {
  id: 'usr_patron_01',
  name: 'Alex Vance',
  email: 'alex.vance@brand.com',
  phone: '+1 (555) 019-2834',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop',
  memberTier: 'ATELIER CIRCLE ELITE',
  memberSince: 'Mar 2023',
  addresses: [],
  paymentMethods: []
};

describe('Customer Account Section (AccountPage)', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('urbancart_user', JSON.stringify(mockCustomerUser));
  });

  describe('1. Profile Information', () => {
    it('renders customer profile information, member tier, and stats', () => {
      render(<RenderAccountPage />);

      // Banner patron identity
      expect(screen.getByTestId('account-header-banner')).toBeInTheDocument();
      expect(screen.getByTestId('account-user-name')).toHaveTextContent(/Alex Vance/i);
      expect(screen.getByTestId('account-user-email')).toHaveTextContent(/alex\.vance/i);

      // Stat counters
      expect(screen.getByTestId('stat-orders-count')).toBeInTheDocument();
      expect(screen.getByTestId('stat-wishlist-count')).toBeInTheDocument();

      // Profile Information Tab is default active
      expect(screen.getByTestId('profile-information-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Profile Information/i })).toBeInTheDocument();

      // Contact details
      expect(screen.getByText(/Active Patron Record/i)).toBeInTheDocument();
      expect(screen.getByTestId('edit-profile-shortcut-btn')).toBeInTheDocument();
    });
  });

  describe('2. Edit Profile', () => {
    it('allows switching to Edit Profile tab, filling inputs, and saving updates', async () => {
      render(<RenderAccountPage />);

      // Switch to Edit Profile tab
      const editTab = screen.getByTestId('account-tab-edit_profile');
      fireEvent.click(editTab);

      // Verify Edit Profile section is visible
      expect(screen.getByTestId('edit-profile-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Edit Customer Profile/i })).toBeInTheDocument();

      // Form inputs
      const nameInput = screen.getByTestId('input-profile-name');
      const emailInput = screen.getByTestId('input-profile-email');
      const phoneInput = screen.getByTestId('input-profile-phone');

      expect(nameInput).toHaveValue('Alex Vance');

      // Update name
      fireEvent.change(nameInput, { target: { value: 'Alexandria Vance' } });
      expect(nameInput).toHaveValue('Alexandria Vance');

      // Save Profile Changes
      const saveBtn = screen.getByTestId('save-profile-btn');
      fireEvent.click(saveBtn);

      // Should transition back to Profile Information with updated name
      await waitFor(() => {
        expect(screen.getByTestId('account-user-name')).toHaveTextContent('Alexandria Vance');
      });
    });

    it('renders image upload button, file input, and camera badge in edit profile', async () => {
      render(<RenderAccountPage />);

      // Switch to Edit Profile tab
      const editTab = screen.getByTestId('account-tab-edit_profile');
      fireEvent.click(editTab);

      // Verify uploader and file input exist
      const fileInput = screen.getByTestId('avatar-file-input');
      const uploadBtn = screen.getByTestId('upload-avatar-file-btn');
      const cameraBtn = screen.getByTestId('avatar-camera-btn');
      const avatarImg = screen.getByTestId('avatar-preview-img');
      const dropzone = screen.getByTestId('avatar-dropzone');

      expect(fileInput).toBeInTheDocument();
      expect(uploadBtn).toBeInTheDocument();
      expect(cameraBtn).toBeInTheDocument();
      expect(avatarImg).toBeInTheDocument();
      expect(dropzone).toBeInTheDocument();
    });

    it('handles image file selection and allows removing uploaded image', async () => {
      render(<RenderAccountPage />);

      const editTab = screen.getByTestId('account-tab-edit_profile');
      fireEvent.click(editTab);

      const fileInput = screen.getByTestId('avatar-file-input');
      const file = new File(['dummy-image-bytes'], 'avatar-photo.png', { type: 'image/png' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/avatar-photo\.png/i)).toBeInTheDocument();
      });
      expect(screen.getByTestId('remove-uploaded-avatar-btn')).toBeInTheDocument();

      // Click remove
      const removeBtn = screen.getByTestId('remove-uploaded-avatar-btn');
      fireEvent.click(removeBtn);

      await waitFor(() => {
        expect(screen.queryByText(/avatar-photo\.png/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('3. Change Password', () => {
    it('renders password change form with validation and submit handler', async () => {
      render(<RenderAccountPage />);

      // Switch to Change Password tab
      const passwordTab = screen.getByTestId('account-tab-password');
      fireEvent.click(passwordTab);

      expect(screen.getByTestId('change-password-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Change Account Password/i })).toBeInTheDocument();

      const currentPassInput = screen.getByTestId('input-current-password');
      const newPassInput = screen.getByTestId('input-new-password');
      const confirmPassInput = screen.getByTestId('input-confirm-password');
      const submitBtn = screen.getByTestId('change-password-submit-btn');

      // Fill valid passwords
      fireEvent.change(currentPassInput, { target: { value: 'currentSecret123' } });
      fireEvent.change(newPassInput, { target: { value: 'newSecuredPhrase789' } });
      fireEvent.change(confirmPassInput, { target: { value: 'newSecuredPhrase789' } });

      // Verify matching indicator
      expect(screen.getByText(/Passphrases match/i)).toBeInTheDocument();

      // Submit password change
      fireEvent.click(submitBtn);

      // Inputs should clear on success
      await waitFor(() => {
        expect(currentPassInput).toHaveValue('');
        expect(newPassInput).toHaveValue('');
        expect(confirmPassInput).toHaveValue('');
      });
    });
  });

  describe('4. My Orders', () => {
    it('renders orders list, status filter pills, search input, and action buttons', () => {
      render(<RenderAccountPage />);

      // Switch to My Orders tab
      const ordersTab = screen.getByTestId('account-tab-orders');
      fireEvent.click(ordersTab);

      expect(screen.getByTestId('my-orders-section')).toBeInTheDocument();

      // Status filters
      expect(screen.getByTestId('filter-orders-all')).toBeInTheDocument();
      expect(screen.getByTestId('filter-orders-active')).toBeInTheDocument();
      expect(screen.getByTestId('filter-orders-delivered')).toBeInTheDocument();

      // Search bar
      const searchInput = screen.getByTestId('orders-search-input');
      expect(searchInput).toBeInTheDocument();

      // Test searching non-existent order
      fireEvent.change(searchInput, { target: { value: 'XYZ-NON-EXISTENT-ORDER-999' } });
      expect(screen.getByText(/No orders match your filter criteria/i)).toBeInTheDocument();

      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } });
      expect(screen.queryByText(/No orders match your filter criteria/i)).not.toBeInTheDocument();
    });
  });

  describe('5. Wishlist Section', () => {
    it('renders customer wishlist section with items, Add to Bag, and Remove buttons', () => {
      render(<RenderAccountPage />);

      // Switch to Wishlist tab
      const wishlistTab = screen.getByTestId('account-tab-wishlist');
      fireEvent.click(wishlistTab);

      expect(screen.getByTestId('customer-wishlist-section')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Saved Archival Wishlist/i })).toBeInTheDocument();

      // If store has seed wishlist items
      const addBtns = screen.queryAllByRole('button', { name: /Add to Bag/i });
      if (addBtns.length > 0) {
        fireEvent.click(addBtns[0]);
      } else {
        expect(screen.getByText(/Your Wishlist is Empty/i)).toBeInTheDocument();
        expect(screen.getByTestId('wishlist-explore-btn')).toBeInTheDocument();
      }
    });
  });

  describe('6. Logout Action', () => {
    it('opens logout confirmation modal and signs out patron', async () => {
      render(<RenderAccountPage />);

      // Click header sign out button
      const logoutBtn = screen.getByTestId('header-logout-btn');
      fireEvent.click(logoutBtn);

      // Logout modal should open
      expect(screen.getByRole('heading', { name: /Sign Out of Customer Account/i })).toBeInTheDocument();

      // Confirm sign out
      const confirmBtn = screen.getByTestId('confirm-logout-btn');
      fireEvent.click(confirmBtn);

      // Verify transition to non-authenticated state
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: /Customer Sign In Required/i })).toBeInTheDocument();
        expect(screen.getByTestId('sign-in-required-btn')).toBeInTheDocument();
      });
    });
  });
});
