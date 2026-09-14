import { createSlice } from '@reduxjs/toolkit';
import { initialOrders } from '../../data/orders';

const initialState = {
  items: initialOrders,
  selectedOrder: null,
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.items = action.payload;
    },
    addOrder: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.items.find(
        (o) => o.id === orderId || o.reference === orderId
      );
      if (order) {
        order.fulfillmentState = status;
      }
      if (state.selectedOrder && (state.selectedOrder.id === orderId || state.selectedOrder.reference === orderId)) {
        state.selectedOrder.fulfillmentState = status;
      }
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    }
  }
});

export const { setOrders, addOrder, updateOrderStatus, setSelectedOrder } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.items;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrderById = (state, orderId) =>
  state.orders.items.find((o) => o.id === orderId || o.reference === orderId);

export default ordersSlice.reducer;
