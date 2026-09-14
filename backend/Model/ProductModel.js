import mongoose from 'mongoose';

const colorwaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, default: '#111827' },
  active: { type: Boolean, default: true }
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  stock: { type: Number, default: 10 },
  available: { type: Boolean, default: true }
}, { _id: false });

const imageSchema = new mongoose.Schema({
  id: { type: String, default: () => `img-${Date.now()}-${Math.floor(Math.random() * 1000)}` },
  title: { type: String, default: 'Product View' },
  url: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const provenanceSchema = new mongoose.Schema({
  origin: { type: String, default: 'Porto, Portugal' },
  materials: { type: String, default: 'Hand-selected premium materials' },
  sustainability: { type: String, default: 'ECO CERTIFIED' },
  dispatchBadge: { type: String, default: 'READY TO DISPATCH' }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  sku: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  name: { type: String, trim: true },
  subtitle: { type: String, default: '' },
  permalink: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    index: true
  },
  brand: { type: String, default: 'UrbanCart Atelier' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: null },
  costPerUnit: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  isBestSeller: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stockRunwayDays: { type: Number, default: 14 },
  stockQuantity: { type: Number, default: 25 },
  urgencyText: { type: String, default: 'In Stock • Ready to Ship' },
  provenance: { type: provenanceSchema, default: () => ({}) },
  editorialDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  colorways: [colorwaySchema],
  sizes: [sizeSchema],
  images: [imageSchema],
  collections: [{ type: String }]
}, {
  timestamps: true
});

// Sync name with title & description with editorialDescription
productSchema.pre('validate', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;
  if (!this.description && this.editorialDescription) this.description = this.editorialDescription;
  if (!this.editorialDescription && this.description) this.editorialDescription = this.description;
  if (!this.id) this.id = `uc-${Date.now()}`;
  if (!this.sku) this.sku = `UC-${Math.floor(100 + Math.random() * 900)}`;
});

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Product = mongoose.model('Product', productSchema);
export default Product;
