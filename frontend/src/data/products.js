// UrbanCart General Lifestyle Products Catalogue & Inventory Matrix
export const initialProducts = [
  // 1. PREMIUM SNEAKERS
  {
    id: 'uc-fw-086',
    sku: 'UC-FW-086',
    title: 'UrbanCart Mono Low-Top Leather Sneaker',
    subtitle: 'Minimalist low-top silhouette with Italian calfskin',
    permalink: '/shop/footwear/mono-low-top-sneaker',
    category: 'Premium Sneakers',
    brand: 'UrbanCart Atelier',
    price: 160.00,
    compareAtPrice: 190.00,
    costPerUnit: 56.00,
    rating: 4.8,
    reviewsCount: 142,
    badge: 'BEST SELLER',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 8,
    urgencyText: 'In Stock • Handcrafted in Porto',
    provenance: {
      origin: 'Porto, Portugal',
      materials: 'Full-grain Italian calfskin, biodegradable organic laces, Margom vulcanized rubber sole.',
      sustainability: 'LWG GOLD CERTIFIED LEATHER',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Sculpted from hand-selected Tuscan full-grain calfskin, the Mono Low-Top represents an uncompromising study in structural reduction. Anatomic lasts ensure immediate ergonomic comfort from day one.`,
    colorways: [
      { name: 'Chalk White', hex: '#F5F5F0', active: true },
      { name: 'Obsidian Noir', hex: '#171617', active: true },
      { name: 'Sandstone', hex: '#E5DED7', active: true }
    ],
    sizes: [
      { size: 'US 8', stock: 15 },
      { size: 'US 9', stock: 22 },
      { size: 'US 10', stock: 18 },
      { size: 'US 11', stock: 9 },
      { size: 'US 12', stock: 6 }
    ],
    images: [
      {
        id: 'fw-1',
        title: 'Lateral Profile',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'fw-2',
        title: 'Sole Detail',
        url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Studio Essentials', 'Permanent Collection']
  },
  {
    id: 'uc-fw-092',
    sku: 'UC-FW-092',
    title: 'UrbanCart CloudStrider Knit Runner',
    subtitle: 'Engineered breathable knit with adaptive cushioning',
    permalink: '/shop/footwear/cloudstrider-runner',
    category: 'Premium Sneakers',
    brand: 'UrbanCart Motion',
    price: 185.00,
    compareAtPrice: 215.00,
    costPerUnit: 64.00,
    rating: 4.9,
    reviewsCount: 96,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 14,
    urgencyText: 'Adaptive Energy Return Sole',
    provenance: {
      origin: 'Civitanova Marche, Italy',
      materials: 'Recycled ocean-knit yarn, supercritical nitrogen foam midsole, carbon-rubber traction lugs.',
      sustainability: 'RECYCLED KNIT MONOFILAMENT',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Engineered for high-mileage urban roaming. Seamless 3D woven upper delivers a sock-like fit with zero friction points.`,
    colorways: [
      { name: 'Pure Chalk', hex: '#FFFFFF', active: true },
      { name: 'Core Black', hex: '#1C1D21', active: true }
    ],
    sizes: [
      { size: 'US 8.5', stock: 12 },
      { size: 'US 9.5', stock: 16 },
      { size: 'US 10.5', stock: 8 },
      { size: 'US 11.5', stock: 10 }
    ],
    images: [
      {
        id: 'fw3-1',
        title: 'Runner Profile',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'fw3-2',
        title: 'Heel Structure',
        url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Active Lifestyle', 'Drop 04']
  },

  // 2. CASUAL T-SHIRTS
  {
    id: 'uc-ap-091',
    sku: 'UC-AP-091',
    title: 'UrbanCart Heavyweight Pima Cotton Tee',
    subtitle: '310 GSM combed Peruvian long-staple cotton',
    permalink: '/shop/apparel/heavyweight-pima-tee',
    category: 'Casual T-Shirts',
    brand: 'UrbanCart Atelier',
    price: 55.00,
    compareAtPrice: 68.00,
    costPerUnit: 18.00,
    rating: 4.8,
    reviewsCount: 110,
    badge: 'BEST SELLER',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 20,
    urgencyText: 'Pre-Washed Zero Shrinkage',
    provenance: {
      origin: 'Milled in Lima, Peru',
      materials: '100% Peruvian Pima cotton, blind-stitched hem, 1x1 rib-bound collar.',
      sustainability: 'OEKO-TEX STANDARD 100',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Dense yet breathable 310 GSM drape tailored with a relaxed drop-shoulder cut and pre-washed hand feel that improves with age.`,
    colorways: [
      { name: 'Sand Oat', hex: '#D7C7B0', active: true },
      { name: 'Optic White', hex: '#FFFFFF', active: true },
      { name: 'Faded Black', hex: '#222326', active: true }
    ],
    sizes: [
      { size: 'S', stock: 24 },
      { size: 'M', stock: 40 },
      { size: 'L', stock: 35 },
      { size: 'XL', stock: 18 }
    ],
    images: [
      {
        id: 'ap-1',
        title: 'Front Lay',
        url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'ap-2',
        title: 'Fabric Macro',
        url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Studio Essentials', 'Summer Capsule']
  },
  {
    id: 'uc-ap-095',
    sku: 'UC-AP-095',
    title: 'UrbanCart Relaxed Washed Vintage Tee',
    subtitle: 'Garment-dyed soft-touch organic jersey',
    permalink: '/shop/apparel/washed-vintage-tee',
    category: 'Casual T-Shirts',
    brand: 'UrbanCart Daily',
    price: 48.00,
    compareAtPrice: 58.00,
    costPerUnit: 15.00,
    rating: 4.7,
    reviewsCount: 78,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 16,
    urgencyText: 'Vintage Pigment Dye',
    provenance: {
      origin: 'Porto, Portugal',
      materials: '100% GOTS Organic Cotton (240 GSM).',
      sustainability: 'ORGANIC CERTIFIED',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Specially enzyme washed for an effortless lived-in drape, reinforced crew neckline, and breathable daily softness.`,
    colorways: [
      { name: 'Charcoal Wash', hex: '#374151', active: true },
      { name: 'Sage Green', hex: '#6B7280', active: true }
    ],
    sizes: [
      { size: 'S', stock: 14 },
      { size: 'M', stock: 26 },
      { size: 'L', stock: 22 },
      { size: 'XL', stock: 12 }
    ],
    images: [
      {
        id: 'ap3-1',
        title: 'T-Shirt Studio',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'ap3-2',
        title: 'Casual Fit',
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Daily Goods']
  },

  // 3. SMART WATCHES
  {
    id: 'uc-sw-101',
    sku: 'UC-SW-101',
    title: 'UrbanCart Pulse Active AMOLED Smart Watch',
    subtitle: 'Always-On Retina display with bio-metric health sensors',
    permalink: '/shop/smart-watches/pulse-active-watch',
    category: 'Smart Watches',
    brand: 'UrbanCart Tech',
    price: 220.00,
    compareAtPrice: 260.00,
    costPerUnit: 85.00,
    rating: 4.9,
    reviewsCount: 165,
    badge: 'HOT',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 12,
    urgencyText: '7-Day Battery • 5 ATM Water Resistant',
    provenance: {
      origin: 'Tokyo & Zurich Collaborative Studio',
      materials: 'Aerospace-grade 6000 series aluminum, ceramic back, sapphire crystal touch screen.',
      sustainability: 'RECYCLABLE ALUMINUM ALLOY',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Advanced optical heart-rate sensor, blood oxygen SpO2 monitoring, integrated GPS, and titanium clasp silicone sport band.`,
    colorways: [
      { name: 'Space Gray', hex: '#262930', active: true },
      { name: 'Silver Mist', hex: '#CBD5E1', active: true }
    ],
    sizes: [
      { size: '40mm Case', stock: 18 },
      { size: '44mm Case', stock: 24 }
    ],
    images: [
      {
        id: 'sw-1',
        title: 'Front Display',
        url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'sw-2',
        title: 'On-Wrist Profile',
        url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Smart Living', 'Active Tech']
  },
  {
    id: 'uc-sw-102',
    sku: 'UC-SW-102',
    title: 'UrbanCart Horizon Titanium Smart Watch',
    subtitle: 'Grade 5 Titanium casing with sapphire glass & Milanese band',
    permalink: '/shop/smart-watches/horizon-titanium-watch',
    category: 'Smart Watches',
    brand: 'UrbanCart Tech',
    price: 290.00,
    compareAtPrice: 340.00,
    costPerUnit: 110.00,
    rating: 5.0,
    reviewsCount: 62,
    badge: 'LIMITED',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 5,
    urgencyText: 'Limited Batch • 14-Day Battery',
    provenance: {
      origin: 'Zurich, Switzerland',
      materials: 'Grade 5 Titanium, double anti-reflective sapphire glass, magnetic mesh band.',
      sustainability: 'CIRCULAR TITANIUM',
      dispatchBadge: 'PRIORITY DISPATCH'
    },
    editorialDescription: `Precision crafted horology meets intelligent computing. Sleep architecture tracking, dual-band GPS, and offline payment sync.`,
    colorways: [
      { name: 'Raw Titanium', hex: '#71717A', active: true },
      { name: 'Midnight Black', hex: '#0F1115', active: true }
    ],
    sizes: [
      { size: '42mm Case', stock: 9 },
      { size: '46mm Case', stock: 7 }
    ],
    images: [
      {
        id: 'sw2-1',
        title: 'Titanium Dial',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'sw2-2',
        title: 'Mesh Band',
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Executive Tech', 'Permanent Collection']
  },

  // 4. BACKPACKS
  {
    id: 'uc-bg-012',
    sku: 'UC-BG-012',
    title: 'UrbanCart Aeropack Pro Backpack',
    subtitle: 'Weatherproof 1680D ballistic commuter daypack',
    permalink: '/shop/backpacks/aeropack-pro',
    category: 'Backpacks',
    brand: 'UrbanCart Modular',
    price: 145.00,
    compareAtPrice: 175.00,
    costPerUnit: 52.00,
    rating: 4.9,
    reviewsCount: 88,
    badge: 'BEST SELLER',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 14,
    urgencyText: '16" Suspended Laptop Compartment',
    provenance: {
      origin: 'Kyoto, Japan',
      materials: '1680D Cordura ballistic nylon, YKK AquaGuard zippers, Fidlock magnetic sternum buckle.',
      sustainability: 'BLUESIGN APPROVED CORDURA',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Designed for daily urban commuting and global travel. Features clamshell opening, padded ergonomic shoulder straps, and hidden passport security pocket.`,
    colorways: [
      { name: 'Matte Obsidian', hex: '#111215', active: true },
      { name: 'Slate Gray', hex: '#4B5563', active: true }
    ],
    sizes: [
      { size: '22L Standard', stock: 28 },
      { size: '28L Travel', stock: 14 }
    ],
    images: [
      {
        id: 'bg-1',
        title: 'Front View',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'bg-2',
        title: 'Back Ergonomics',
        url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Studio Essentials', 'Commuter Gear']
  },
  {
    id: 'uc-bg-015',
    sku: 'UC-BG-015',
    title: 'UrbanCart Metro Roll-Top Commuter Backpack',
    subtitle: 'Expandable roll-top volume with quick side zip access',
    permalink: '/shop/backpacks/metro-roll-top',
    category: 'Backpacks',
    brand: 'UrbanCart Daily',
    price: 125.00,
    compareAtPrice: 150.00,
    costPerUnit: 44.00,
    rating: 4.8,
    reviewsCount: 54,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 18,
    urgencyText: 'Water-Resistant TPU Tarpaulin Base',
    provenance: {
      origin: 'Berlin, Germany',
      materials: 'Waterproof ripstop canvas with matte PU coating, anodized aluminum G-hooks.',
      sustainability: 'PFC-FREE COATING',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Adaptive roll-top expansion allows volume adjustment between 18L and 26L. Dedicated quick-draw side zipper allows laptop retrieval without unrolling.`,
    colorways: [
      { name: 'Jet Black', hex: '#18181B', active: true },
      { name: 'Olive Drab', hex: '#4A5548', active: true }
    ],
    sizes: [
      { size: 'Adjustable 18-26L', stock: 25 }
    ],
    images: [
      {
        id: 'bg2-1',
        title: 'Roll-Top Front',
        url: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'bg2-2',
        title: 'Lifestyle Pack',
        url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Urban Commute']
  },

  // 5. HEADPHONES
  {
    id: 'uc-hp-201',
    sku: 'UC-HP-201',
    title: 'UrbanCart Studio Pro Wireless ANC Headphones',
    subtitle: 'High-Fidelity 40mm Beryllium drivers with hybrid active noise cancelling',
    permalink: '/shop/headphones/studio-pro-wireless-anc',
    category: 'Headphones',
    brand: 'UrbanCart Acoustic',
    price: 240.00,
    compareAtPrice: 280.00,
    costPerUnit: 88.00,
    rating: 4.9,
    reviewsCount: 135,
    badge: 'BEST SELLER',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 10,
    urgencyText: '40-Hour Battery • Multipoint Bluetooth 5.3',
    provenance: {
      origin: 'Aarhus, Denmark',
      materials: 'Anodized aluminum headband, memory foam lambskin earcups, custom acoustic tuning.',
      sustainability: 'MODULAR REPLACEABLE CUSHIONS',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Engineered for critical listening and daily focus. Hybrid Active Noise Cancellation eliminates 98% of ambient noise, paired with lossless LDAC audio streaming.`,
    colorways: [
      { name: 'Matte Onyx', hex: '#141416', active: true },
      { name: 'Silver Sand', hex: '#D1D5DB', active: true }
    ],
    sizes: [
      { size: 'Over-Ear Adjustable', stock: 30 }
    ],
    images: [
      {
        id: 'hp-1',
        title: 'Headphones Flat Lay',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'hp-2',
        title: 'Studio Earcup Macro',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Studio Audio', 'Workstation Gear']
  },
  {
    id: 'uc-hp-202',
    sku: 'UC-HP-202',
    title: 'UrbanCart Clarity In-Ear Wireless Earbuds',
    subtitle: 'Graphene acoustic driver with spatial audio & wireless charging case',
    permalink: '/shop/headphones/clarity-wireless-earbuds',
    category: 'Headphones',
    brand: 'UrbanCart Acoustic',
    price: 110.00,
    compareAtPrice: 135.00,
    costPerUnit: 38.00,
    rating: 4.7,
    reviewsCount: 82,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 22,
    urgencyText: 'IPX5 Sweat-Proof • 32h Total Playtime',
    provenance: {
      origin: 'Stockholm, Sweden',
      materials: 'Ultralight composite housing, medical-grade liquid silicone tips (4 sizes).',
      sustainability: 'RECYCLED PACKAGING',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Compact, ergonomic in-ear design with dual beamforming microphones for crystal-clear voice isolation and dynamic transparency mode.`,
    colorways: [
      { name: 'Frosted White', hex: '#F9FAFB', active: true },
      { name: 'Midnight', hex: '#111827', active: true }
    ],
    sizes: [
      { size: 'One Size (S/M/L/XL Tips)', stock: 45 }
    ],
    images: [
      {
        id: 'hp2-1',
        title: 'Earbuds and Case',
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'hp2-2',
        title: 'In-Ear Profile',
        url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Active Lifestyle', 'Pocket Essentials']
  },

  // 6. SUNGLASSES
  {
    id: 'uc-ac-073',
    sku: 'UC-AC-073',
    title: 'UrbanCart Titanium Frame Polarized Sunglasses',
    subtitle: 'Ultralight Japanese beta-titanium with Carl Zeiss UV400 lenses',
    permalink: '/shop/sunglasses/titanium-frame-sunglasses',
    category: 'Sunglasses',
    brand: 'UrbanCart Optic',
    price: 115.00,
    compareAtPrice: 145.00,
    costPerUnit: 38.00,
    rating: 4.8,
    reviewsCount: 76,
    badge: 'HOT',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 15,
    urgencyText: 'Only 14 Grams Total Weight',
    provenance: {
      origin: 'Sabae, Fukui Prefecture, Japan',
      materials: 'Japanese Beta-Titanium frame, Carl Zeiss CR-39 polarized lenses, screwless hinges.',
      sustainability: 'CIRCULAR TITANIUM',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Hand-finished architectural sunglasses featuring screwless tension hinges, hypoallergenic silicone nose pads, and 100% glare filtration.`,
    colorways: [
      { name: 'Gunmetal Silver', hex: '#4B5563', active: true },
      { name: 'Matte Gold', hex: '#D4AF37', active: true }
    ],
    sizes: [
      { size: '49-21 Medium', stock: 32 }
    ],
    images: [
      {
        id: 'sg-1',
        title: 'Front Frame',
        url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'sg-2',
        title: 'Profile Angle',
        url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Eyewear Studio', 'Summer Capsule']
  },
  {
    id: 'uc-ac-078',
    sku: 'UC-AC-078',
    title: 'UrbanCart Classic Wayfarer UV400 Sunglasses',
    subtitle: 'Hand-polished Italian bio-acetate with mineral glass lenses',
    permalink: '/shop/sunglasses/classic-wayfarer',
    category: 'Sunglasses',
    brand: 'UrbanCart Optic',
    price: 95.00,
    compareAtPrice: 120.00,
    costPerUnit: 32.00,
    rating: 4.7,
    reviewsCount: 52,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 20,
    urgencyText: 'Biodegradable Bio-Acetate Frame',
    provenance: {
      origin: 'Belluno, Italy',
      materials: 'Mazzucchelli bio-acetate, 5-barrel German silver hinges, anti-reflective interior coating.',
      sustainability: '100% PLANT-BASED ACETATE',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Timeless geometric square silhouette sculpted from rich tortoiseshell and black acetate blocks. Offers complete UVA/UVB protection.`,
    colorways: [
      { name: 'Classic Tortoise', hex: '#5D4037', active: true },
      { name: 'Deep Gloss Black', hex: '#111827', active: true }
    ],
    sizes: [
      { size: '51-20 Standard', stock: 24 }
    ],
    images: [
      {
        id: 'sg2-1',
        title: 'Wayfarer Sunglasses',
        url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'sg2-2',
        title: 'Outdoor Lighting',
        url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Eyewear Studio']
  },

  // 7. WALLETS
  {
    id: 'uc-wl-019',
    sku: 'UC-WL-019',
    title: 'UrbanCart Slim RFID Leather Bifold Wallet',
    subtitle: 'Vegetable-tanned full-grain leather with RFID shielding',
    permalink: '/shop/wallets/slim-rfid-bifold-wallet',
    category: 'Wallets',
    brand: 'UrbanCart Atelier',
    price: 58.00,
    compareAtPrice: 72.00,
    costPerUnit: 16.00,
    rating: 4.8,
    reviewsCount: 94,
    badge: 'BEST SELLER',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 16,
    urgencyText: 'Holds 8-10 Cards + Flat Bills',
    provenance: {
      origin: 'Florence, Italy',
      materials: 'Tuscan vegetable-tanned leather, waxed polyester thread, RFID blocking composite lining.',
      sustainability: 'NATURAL VEGETABLE TANNED',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Streamlined profile measuring just 8mm thin when loaded. Premium edge-burnished full-grain leather forms a rich personalized patina over time.`,
    colorways: [
      { name: 'Espresso Brown', hex: '#3E2723', active: true },
      { name: 'Onyx Black', hex: '#1C1917', active: true },
      { name: 'Cognac Tan', hex: '#B45309', active: true }
    ],
    sizes: [
      { size: 'Slim 8mm Profile', stock: 35 }
    ],
    images: [
      {
        id: 'wl-1',
        title: 'Wallet Closed',
        url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'wl-2',
        title: 'Card Slot Detail',
        url: 'https://images.unsplash.com/photo-1606503825008-909a67e7535d?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Pocket Essentials', 'Leather Lab']
  },
  {
    id: 'uc-wl-022',
    sku: 'UC-WL-022',
    title: 'UrbanCart Minimalist Cardholder with Money Clip',
    subtitle: 'Aircraft aluminum core with integrated spring money clip',
    permalink: '/shop/wallets/minimalist-cardholder-money-clip',
    category: 'Wallets',
    brand: 'UrbanCart Modular',
    price: 42.00,
    compareAtPrice: 52.00,
    costPerUnit: 12.00,
    rating: 4.9,
    reviewsCount: 118,
    badge: 'NEW',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 25,
    urgencyText: 'Rapid Thumb-Eject Slide',
    provenance: {
      origin: 'Zurich, Switzerland',
      materials: '6061-T6 Anodized aluminum plates, silicone elastic retention band, stainless steel clip.',
      sustainability: '100% RECYCLABLE ALLOY',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Holds up to 6 cards securely with instant thumb slide access. Blocks RFID theft while keeping front pockets feather-light.`,
    colorways: [
      { name: 'Anodized Black', hex: '#18181B', active: true },
      { name: 'Titanium Gunmetal', hex: '#52525B', active: true }
    ],
    sizes: [
      { size: 'Card Size (6 Cards)', stock: 50 }
    ],
    images: [
      {
        id: 'wl2-1',
        title: 'Cardholder Flat',
        url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'wl2-2',
        title: 'Minimal Pocket Fit',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Pocket Essentials']
  },

  // 8. FITNESS ACCESSORIES
  {
    id: 'uc-fit-301',
    sku: 'UC-FIT-301',
    title: 'UrbanCart Weighted Aluminum Speed Jump Rope',
    subtitle: 'Dual ball-bearing mechanism with coated steel cable',
    permalink: '/shop/fitness/weighted-speed-jump-rope',
    category: 'Fitness Accessories',
    brand: 'UrbanCart Motion',
    price: 38.00,
    compareAtPrice: 48.00,
    costPerUnit: 11.00,
    rating: 4.8,
    reviewsCount: 68,
    badge: 'POPULAR',
    isBestSeller: false,
    inStock: true,
    stockRunwayDays: 20,
    urgencyText: 'Dual High-Speed Ball Bearings',
    provenance: {
      origin: 'Tokyo, Japan',
      materials: 'Knurled 6061 aerospace aluminum handles, tangle-free PVC coated steel cable.',
      sustainability: 'LIFETIME DURABILITY WARRANTY',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Engineered for smooth rotational velocity and intense cardio conditioning. Fully adjustable cable length with removable handle weights.`,
    colorways: [
      { name: 'Stealth Black', hex: '#111827', active: true },
      { name: 'Electric Amber', hex: '#D97706', active: true }
    ],
    sizes: [
      { size: '10ft Adjustable Cable', stock: 40 }
    ],
    images: [
      {
        id: 'fit-1',
        title: 'Speed Rope Studio',
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'fit-2',
        title: 'Knurled Handle Macro',
        url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Active Lifestyle', 'Training Gear']
  },
  {
    id: 'uc-fit-302',
    sku: 'UC-FIT-302',
    title: 'UrbanCart High-Density Recovery Foam Roller',
    subtitle: 'Deep tissue myofascial release with grid trigger zones',
    permalink: '/shop/fitness/high-density-recovery-roller',
    category: 'Fitness Accessories',
    brand: 'UrbanCart Motion',
    price: 45.00,
    compareAtPrice: 55.00,
    costPerUnit: 14.00,
    rating: 4.9,
    reviewsCount: 84,
    badge: 'RECOMMENDED',
    isBestSeller: true,
    inStock: true,
    stockRunwayDays: 15,
    urgencyText: 'Multi-Density Vibration Absorbing Matrix',
    provenance: {
      origin: 'Cologne, Germany',
      materials: 'Eco-friendly high-density EVA foam surrounding an uncrushable hollow PVC core.',
      sustainability: 'TOXIN-FREE 100% RECYCLABLE EVA',
      dispatchBadge: 'READY TO DISPATCH'
    },
    editorialDescription: `Target muscle soreness, accelerate post-workout recovery, and release deep myofascial tension with specialized dual-zone surface contours.`,
    colorways: [
      { name: 'Obsidian Grid', hex: '#1F2937', active: true },
      { name: 'Granite Slate', hex: '#64748B', active: true }
    ],
    sizes: [
      { size: '13-Inch Standard', stock: 28 },
      { size: '18-Inch Extended', stock: 16 }
    ],
    images: [
      {
        id: 'fit2-1',
        title: 'Roller Grid Studio',
        url: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1200&auto=format&fit=crop',
        isPrimary: true
      },
      {
        id: 'fit2-2',
        title: 'Workout Setup',
        url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
        isPrimary: false
      }
    ],
    collections: ['Active Lifestyle', 'Recovery & Wellness']
  }
];

// All 8 General Lifestyle Categories
export const categoriesData = [
  {
    id: 'sneakers',
    name: 'PREMIUM SNEAKERS',
    categoryKey: 'Premium Sneakers',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'tshirts',
    name: 'CASUAL T-SHIRTS',
    categoryKey: 'Casual T-Shirts',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'smartwatches',
    name: 'SMART WATCHES',
    categoryKey: 'Smart Watches',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'backpacks',
    name: 'BACKPACKS',
    categoryKey: 'Backpacks',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'headphones',
    name: 'HEADPHONES',
    categoryKey: 'Headphones',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sunglasses',
    name: 'SUNGLASSES',
    categoryKey: 'Sunglasses',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'wallets',
    name: 'WALLETS',
    categoryKey: 'Wallets',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'fitness',
    name: 'FITNESS ACCESSORIES',
    categoryKey: 'Fitness Accessories',
    itemsCount: 2,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
  }
];
