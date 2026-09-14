import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  calculateSubtotal,
  calculateTotal,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartTotal,
  selectAppliedCoupon,
  selectDiscountAmount
} from './slices/cartSlice';
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  selectWishlistItems,
  selectIsInWishlist
} from './slices/wishlistSlice';
import authReducer, {
  setCurrentUser,
  logoutUser,
  updateUserProfile,
  selectCurrentUser,
  selectIsAuthenticated
} from './slices/authSlice';
import productsReducer, {
  addProduct,
  updateProduct,
  deleteProduct,
  selectAllProducts
} from './slices/productsSlice';
import ordersReducer, {
  addOrder,
  updateOrderStatus,
  selectAllOrders
} from './slices/ordersSlice';
import uiReducer, {
  setActiveView,
  setAdminTab,
  setCartOpen,
  showToast,
  selectActiveView,
  selectAdminTab,
  selectIsCartOpen,
  selectToast
} from './slices/uiSlice';

describe('16. State Management with Redux Toolkit', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        auth: authReducer,
        products: productsReducer,
        orders: ordersReducer,
        ui: uiReducer
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('1. Cart Slice Functionality', () => {
    test('calculateSubtotal and calculateTotal calculate prices accurately', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];
      const subtotal = calculateSubtotal(items);
      expect(subtotal).toBe(250);

      // Free shipping threshold met (>= 250 -> shipping = 0, tax = 250 * 0.08 = 20, total = 270)
      const calculationsFree = calculateTotal(subtotal, 250, 15, 0.08);
      expect(calculationsFree.shipping).toBe(0);
      expect(calculationsFree.tax).toBe(20);
      expect(calculationsFree.total).toBe(270);

      // Under threshold (< 250 -> shipping = 15)
      const calculationsStandard = calculateTotal(100, 250, 15, 0.08);
      expect(calculationsStandard.shipping).toBe(15);
      expect(calculationsStandard.tax).toBe(8);
      expect(calculationsStandard.total).toBe(123);
    });

    test('addItem adds a new item and calculates subtotal & total', () => {
      const newItem = {
        cartId: 'c-test-1',
        productId: 'prod-1',
        title: 'Atelier Sneaker',
        price: 150,
        quantity: 1,
        color: 'Chalk White',
        size: '10.0'
      };

      store.dispatch(addItem(newItem));

      const state = store.getState();
      const items = selectCartItems(state);
      expect(items.some((i) => i.productId === 'prod-1')).toBe(true);
      expect(selectCartSubtotal(state)).toBeGreaterThan(0);
      expect(selectCartTotal(state)).toBeGreaterThan(0);

      // Verify localStorage persistence
      const savedInStorage = JSON.parse(localStorage.getItem('urbancart_redux_cart'));
      expect(savedInStorage.some((i) => i.productId === 'prod-1')).toBe(true);
    });

    test('addItem increments quantity if identical variant already exists', () => {
      const item = {
        productId: 'prod-unique',
        title: 'Minimal Watch',
        price: 200,
        quantity: 1,
        color: 'Obsidian',
        size: '40mm'
      };

      store.dispatch(addItem(item));
      store.dispatch(addItem(item));

      const state = store.getState();
      const added = selectCartItems(state).find((i) => i.productId === 'prod-unique');
      expect(added.quantity).toBe(2);
    });

    test('updateQuantity modifies quantity or removes item if quantity is zero', () => {
      const item = {
        cartId: 'c-update-test',
        productId: 'prod-update',
        title: 'Pima Tee',
        price: 60,
        quantity: 2
      };

      store.dispatch(addItem(item));
      store.dispatch(updateQuantity({ cartId: 'c-update-test', quantity: 5 }));

      let state = store.getState();
      let found = selectCartItems(state).find((i) => i.cartId === 'c-update-test');
      expect(found.quantity).toBe(5);

      // Update to 0 removes item
      store.dispatch(updateQuantity({ cartId: 'c-update-test', quantity: 0 }));
      state = store.getState();
      found = selectCartItems(state).find((i) => i.cartId === 'c-update-test');
      expect(found).toBeUndefined();
    });

    test('removeItem removes item and recalculates totals', () => {
      const item = {
        cartId: 'c-remove-test',
        productId: 'prod-remove',
        title: 'Cardholder',
        price: 75,
        quantity: 1
      };

      store.dispatch(addItem(item));
      store.dispatch(removeItem('c-remove-test'));

      const state = store.getState();
      const found = selectCartItems(state).find((i) => i.cartId === 'c-remove-test');
      expect(found).toBeUndefined();
    });

    test('clearCart empties all items and resets totals to zero', () => {
      store.dispatch(clearCart());

      const state = store.getState();
      expect(selectCartItems(state).length).toBe(0);
      expect(selectCartCount(state)).toBe(0);
      expect(selectCartSubtotal(state)).toBe(0);
      expect(selectCartTotal(state)).toBe(0);

      // Verify localStorage was updated
      const storageItems = JSON.parse(localStorage.getItem('urbancart_redux_cart'));
      expect(storageItems).toEqual([]);
    });

    test('applyCoupon calculates percentage, fixed, and free shipping discounts correctly', () => {
      // Clear cart first, then add items totaling $200
      store.dispatch(clearCart());
      store.dispatch(addItem({ cartId: 'c-cpn-1', productId: 'p1', price: 100, quantity: 2 }));

      // 1. Percentage coupon URBAN20 (20% off $200 = $40 discount)
      store.dispatch(applyCoupon('URBAN20'));
      let state = store.getState();
      expect(selectAppliedCoupon(state)?.code).toBe('URBAN20');
      expect(selectDiscountAmount(state)).toBe(40);

      // 2. Fixed coupon SAVE25 ($25 off $200)
      store.dispatch(applyCoupon('SAVE25'));
      state = store.getState();
      expect(selectAppliedCoupon(state)?.code).toBe('SAVE25');
      expect(selectDiscountAmount(state)).toBe(25);

      // 3. Free shipping coupon FREESHIP
      store.dispatch(applyCoupon('FREESHIP'));
      state = store.getState();
      expect(selectAppliedCoupon(state)?.code).toBe('FREESHIP');
      expect(state.cart.shipping).toBe(0);

      // 4. removeCoupon removes discount and restores normal calculation
      store.dispatch(removeCoupon());
      state = store.getState();
      expect(selectAppliedCoupon(state)).toBeNull();
      expect(selectDiscountAmount(state)).toBe(0);

      // 5. Invalid coupon sets error and does not apply
      store.dispatch(applyCoupon('NONEXISTENT_CODE'));
      state = store.getState();
      expect(selectAppliedCoupon(state)).toBeNull();
      expect(state.cart.couponError).toBe('Invalid coupon code');
    });
  });

  describe('2. Wishlist Slice Functionality', () => {
    test('addToWishlist adds an item if not present', () => {
      const item = {
        id: 'wl-test-1',
        productId: 'prod-wl-1',
        title: 'Leather Duffle',
        price: 320
      };

      store.dispatch(addToWishlist(item));

      const state = store.getState();
      const wishlist = selectWishlistItems(state);
      expect(wishlist.some((i) => i.productId === 'prod-wl-1')).toBe(true);

      // Verify localStorage persistence
      const savedWishlist = JSON.parse(localStorage.getItem('urbancart_redux_wishlist'));
      expect(savedWishlist.some((i) => i.productId === 'prod-wl-1')).toBe(true);
    });

    test('removeFromWishlist removes an item by ID', () => {
      const item = {
        id: 'wl-remove-1',
        productId: 'prod-wl-del',
        title: 'Titanium Glasses',
        price: 220
      };

      store.dispatch(addToWishlist(item));
      store.dispatch(removeFromWishlist('prod-wl-del'));

      const state = store.getState();
      expect(selectIsInWishlist(state, 'prod-wl-del')).toBe(false);
    });

    test('check whether product is in wishlist using selectIsInWishlist', () => {
      const item = {
        id: 'wl-check-1',
        productId: 'prod-check-1',
        title: 'Ceramic Mug',
        price: 45
      };

      let state = store.getState();
      expect(selectIsInWishlist(state, 'prod-check-1')).toBe(false);

      store.dispatch(addToWishlist(item));
      state = store.getState();
      expect(selectIsInWishlist(state, 'prod-check-1')).toBe(true);
    });

    test('toggleWishlist adds if absent and removes if present', () => {
      const item = {
        id: 'wl-toggle-1',
        productId: 'prod-toggle',
        title: 'Merino Scarf',
        price: 85
      };

      // 1. Toggle adds
      store.dispatch(toggleWishlist(item));
      let state = store.getState();
      expect(selectIsInWishlist(state, 'prod-toggle')).toBe(true);

      // 2. Toggle removes
      store.dispatch(toggleWishlist(item));
      state = store.getState();
      expect(selectIsInWishlist(state, 'prod-toggle')).toBe(false);
    });
  });

  describe('3. Authentication Slice Functionality', () => {
    test('setCurrentUser, logoutUser, and updateUserProfile work accurately', () => {
      const user = {
        id: 'u-1',
        name: 'Patron Vance',
        email: 'vance@example.com',
        role: 'patron'
      };

      store.dispatch(setCurrentUser(user));
      let state = store.getState();
      expect(selectCurrentUser(state)).toEqual(user);
      expect(selectIsAuthenticated(state)).toBe(true);

      store.dispatch(updateUserProfile({ name: 'Alex Vance Updated' }));
      state = store.getState();
      expect(selectCurrentUser(state).name).toBe('Alex Vance Updated');

      store.dispatch(logoutUser());
      state = store.getState();
      expect(selectCurrentUser(state)).toBeNull();
      expect(selectIsAuthenticated(state)).toBe(false);
    });
  });

  describe('4. Products Slice Functionality', () => {
    test('handles addProduct, updateProduct, and deleteProduct CRUD', () => {
      const newProduct = {
        id: 'uc-new-product',
        title: 'Architect Pen',
        price: 95,
        category: 'Accessories',
        brand: 'UrbanCart',
        stockQuantity: 40
      };

      store.dispatch(addProduct(newProduct));
      let state = store.getState();
      let products = selectAllProducts(state);
      expect(products.some((p) => p.id === 'uc-new-product')).toBe(true);

      store.dispatch(updateProduct({ id: 'uc-new-product', price: 110, title: 'Architect Pen Pro' }));
      state = store.getState();
      const updated = selectAllProducts(state).find((p) => p.id === 'uc-new-product');
      expect(updated.price).toBe(110);
      expect(updated.title).toBe('Architect Pen Pro');

      store.dispatch(deleteProduct('uc-new-product'));
      state = store.getState();
      expect(selectAllProducts(state).some((p) => p.id === 'uc-new-product')).toBe(false);
    });
  });

  describe('5. Orders Slice Functionality', () => {
    test('handles addOrder and updateOrderStatus', () => {
      const order = {
        id: 'ord-test-123',
        reference: '#UC-TEST-123',
        fulfillmentState: 'PREPARING SHIPMENT',
        total: 180
      };

      store.dispatch(addOrder(order));
      let state = store.getState();
      expect(selectAllOrders(state).some((o) => o.id === 'ord-test-123')).toBe(true);

      store.dispatch(updateOrderStatus({ orderId: 'ord-test-123', status: 'DELIVERED' }));
      state = store.getState();
      const updated = selectAllOrders(state).find((o) => o.id === 'ord-test-123');
      expect(updated.fulfillmentState).toBe('DELIVERED');
    });
  });

  describe('6. UI State Slice Functionality', () => {
    test('handles view, tab, drawer, and toast updates', () => {
      store.dispatch(setActiveView('cart'));
      store.dispatch(setAdminTab('orders'));
      store.dispatch(setCartOpen(true));
      store.dispatch(showToast({ message: 'Catalog Updated', type: 'success' }));

      const state = store.getState();
      expect(selectActiveView(state)).toBe('cart');
      expect(selectAdminTab(state)).toBe('orders');
      expect(selectIsCartOpen(state)).toBe(true);
      expect(selectToast(state).message).toBe('Catalog Updated');
    });
  });
});
