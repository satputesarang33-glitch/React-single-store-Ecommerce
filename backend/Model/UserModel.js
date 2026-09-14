import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  id: { type: String, default: () => `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}` },
  title: { type: String, default: 'Primary Address' },
  recipient: { type: String, default: '' },
  fullName: { type: String, default: '' },
  street: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  pincode: { type: String, default: '' },
  country: { type: String, default: 'United States' },
  phone: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const paymentMethodSchema = new mongoose.Schema({
  id: { type: String, default: () => `pm-${Date.now()}-${Math.floor(Math.random() * 1000)}` },
  brand: { type: String, default: 'Visa' },
  last4: { type: String, default: '4242' },
  expiry: { type: String, default: '12/28' },
  holder: { type: String, default: 'PATRON HOLDER' },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const preferencesSchema = new mongoose.Schema({
  emailOrderUpdates: { type: Boolean, default: true },
  smsShipmentAlerts: { type: Boolean, default: true },
  newsletter: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { type: String, default: '', trim: true },
  password: {
    type: String,
    required: function () {
      return !this.authProvider || this.authProvider === 'local';
    }
  },
  googleId: { type: String, default: null },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=160&auto=format&fit=crop'
  },
  memberTier: {
    type: String,
    default: 'Verified Customer'
  },
  memberSince: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  },
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  preferences: { type: preferencesSchema, default: () => ({}) },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

// Auto-generate human-friendly id if not provided
userSchema.pre('validate', function () {
  if (!this.id) {
    this.id = this.role === 'admin' ? `usr_admin_${Date.now()}` : `usr_patron_${Date.now()}`;
  }
});

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe JSON serialization (strip password)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
