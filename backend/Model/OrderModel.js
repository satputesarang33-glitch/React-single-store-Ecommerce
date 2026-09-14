import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: { type: String, default: () => `item-${Date.now()}-${Math.floor(Math.random() * 1000)}` },
  productId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General Lifestyle' },
  color: { type: String, default: 'Standard' },
  colorway: { type: String, default: 'Standard' },
  size: { type: String, default: 'Standard' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, default: '' }
}, { _id: false });

const timelineEventSchema = new mongoose.Schema({
  step: { type: String, default: '' },
  label: { type: String, default: '' },
  date: { type: String, default: 'Just now' },
  completed: { type: Boolean, default: false },
  done: { type: Boolean, default: false },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  reference: { type: String, required: true },
  userId: { type: String, default: null },
  patron: {
    name: { type: String, default: 'Valued Patron' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    phone: { type: String, default: '' },
    isVip: { type: Boolean, default: false }
  },
  customer: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  cartSummary: { type: String, default: '' },
  itemsCount: { type: Number, default: 1 },
  subtotal: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 },
  timestamp: { type: String, default: 'Just now' },
  date: { type: String, default: () => new Date().toISOString() },
  paymentStatus: {
    type: String,
    default: 'CAPTURED'
  },
  fulfillmentState: {
    type: String,
    default: 'CONFIRMED & PROCESSING'
  },
  courier: { type: String, default: 'DHL Express Global' },
  trackingNumber: { type: String, default: () => `JD${Math.floor(1000000000 + Math.random() * 9000000000)}` },
  deliveryMethod: { type: String, default: 'Express Courier' },
  shippingAddress: {
    fullName: { type: String, default: '' },
    recipient: { type: String, default: '' },
    street: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    pincode: { type: String, default: '' },
    country: { type: String, default: 'India' },
    phone: { type: String, default: '' }
  },
  paymentMethod: {
    type: mongoose.Schema.Types.Mixed,
    default: 'Credit Card'
  },
  timeline: [timelineEventSchema],
  items: [orderItemSchema]
}, {
  timestamps: true
});

orderSchema.pre('validate', function () {
  if (!this.id) this.id = `ord-${Date.now()}`;
  if (!this.reference) {
    this.reference = `#UC-${Math.floor(10000 + Math.random() * 90000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  }
  if (!this.cartSummary && this.items && this.items.length > 0) {
    this.cartSummary = `${this.items.length} item(s) (${this.items.map(i => i.title).slice(0, 2).join(', ')}${this.items.length > 2 ? '...' : ''})`;
  }
  if (!this.itemsCount && this.items) {
    this.itemsCount = this.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
  }
  if (!this.timeline || this.timeline.length === 0) {
    this.timeline = [
      { step: 'Order Placed', label: 'Order Placed & Verified', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, done: true, description: 'Order entered production queue' },
      { step: 'Payment Confirmed', label: 'Payment Settlement', date: 'Authorized', completed: true, done: true, description: 'Payment captured' },
      { step: 'Quality Inspection', label: 'Quality & Craftsmanship Inspection', date: 'In progress', completed: true, done: true, current: true, description: 'Checked at distribution hub' },
      { step: 'Courier Handover', label: 'Courier Handover', date: 'Pending', completed: false, done: false, description: 'Awaiting dispatch' },
      { step: 'Delivered', label: 'Delivered', date: 'Estimated 2-3 days', completed: false, done: false, description: 'Direct handover' }
    ];
  }
});

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
