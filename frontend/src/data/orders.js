// UrbanCart Ledger & Dispatch Order Settlements
export const initialOrders = [
  {
    id: 'ord-98214',
    reference: '#UC-98214-X',
    patron: {
      name: 'Julian Mercer',
      email: 'j.mercer@atelier.co',
      city: 'Stockholm, SE',
      phone: '+46 8 123 4567',
      isVip: true
    },
    cartSummary: '2 items (Mono Sneaker + Pima Tee)',
    itemsCount: 2,
    subtotal: 215.00,
    shipping: 15.00,
    tax: 15.00,
    total: 245.00,
    timestamp: 'Today 14:22',
    date: '2024-10-31 14:22',
    paymentStatus: 'CAPTURED', // CAPTURED, SETTLED, REVIEW REQUIRED, REFUNDED
    fulfillmentState: 'COURIER DISPATCHED', // COURIER DISPATCHED, PREPARING SHIPMENT, DELIVERED, HOLD ON GATE 2
    courier: 'DHL Express Global',
    trackingNumber: 'JD01460000889201',
    deliveryMethod: 'Express Carbon-Neutral Courier',
    shippingAddress: {
      fullName: 'Julian Mercer',
      recipient: 'Julian Mercer',
      street: 'Grev Turegatan 14, 3TR',
      address: 'Grev Turegatan 14, 3TR',
      city: 'Stockholm',
      state: 'Stockholm County',
      postalCode: '114 46',
      country: 'Sweden',
      phone: '+46 8 123 4567'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      holder: 'JULIAN MERCER',
      expiry: '08/28',
      label: 'Credit Card (Visa •••• 4242)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-31 14:22', completed: true, description: 'Order authorized and entered production queue' },
      { step: 'Payment Confirmed', date: '2024-10-31 14:25', completed: true, description: 'Visa settlement captured successfully' },
      { step: 'Quality Inspected', date: '2024-10-31 16:00', completed: true, description: 'Double-checked at Nordic Distribution Hub' },
      { step: 'Courier Handover', date: '2024-10-31 18:30', completed: true, current: true, description: 'Package scanned into DHL Express flight network' },
      { step: 'Delivered', date: 'Est. Nov 02, 2024', completed: false, description: 'Direct courier signature upon delivery' }
    ],
    items: [
      {
        id: 'item-1',
        productId: 'uc-fw-086',
        title: 'UrbanCart Mono Low-Top Sneaker',
        category: 'FOOTWEAR STUDIO',
        colorway: 'Chalk White',
        size: 'EU 43 / US 10.0',
        price: 160.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300'
      },
      {
        id: 'item-2',
        productId: 'uc-ap-012',
        title: 'UrbanCart Heavyweight Pima Cotton Tee',
        category: 'ATELIER APPAREL',
        colorway: 'Sand Oat',
        size: 'L',
        price: 55.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300'
      }
    ]
  },
  {
    id: 'ord-98213',
    reference: '#UC-98213-Y',
    patron: {
      name: 'Elena Rostova',
      email: 'e.rostova@design.org',
      city: 'Vienna, AT',
      phone: '+43 1 987 6543',
      isVip: false
    },
    cartSummary: '1 item (Chronos Ceramic Watch)',
    itemsCount: 1,
    subtotal: 290.00,
    shipping: 0.00,
    tax: 0.00,
    total: 290.00,
    timestamp: 'Today 12:45',
    date: '2024-10-31 12:45',
    paymentStatus: 'SETTLED',
    fulfillmentState: 'PREPARING SHIPMENT',
    courier: 'SwissPost Priority',
    trackingNumber: 'CH990214881',
    deliveryMethod: 'Priority Air Freight',
    shippingAddress: {
      fullName: 'Elena Rostova',
      recipient: 'Elena Rostova',
      street: 'Herrengasse 19, Top 4',
      address: 'Herrengasse 19, Top 4',
      city: 'Vienna',
      state: 'Vienna',
      postalCode: '1010',
      country: 'Austria',
      phone: '+43 1 987 6543'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Mastercard',
      last4: '8812',
      holder: 'ELENA ROSTOVA',
      expiry: '11/27',
      label: 'Credit Card (Mastercard •••• 8812)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-31 12:45', completed: true, description: 'Order placed online' },
      { step: 'Payment Confirmed', date: '2024-10-31 12:46', completed: true, description: 'Payment settled via Mastercard' },
      { step: 'Quality Inspected', date: '2024-10-31 15:10', completed: true, current: true, description: 'Ceramic movement timing verified' },
      { step: 'Courier Handover', date: 'Pending', completed: false, description: 'Awaiting courier dispatch handover' },
      { step: 'Delivered', date: 'Est. Nov 03, 2024', completed: false, description: 'Direct handover to patron' }
    ],
    items: [
      {
        id: 'item-3',
        productId: 'uc-wt-004',
        title: 'UrbanCart Chronos Ceramic Timepiece',
        category: 'HOROLOGY & OBJECTS',
        colorway: 'Matte Obsidian',
        size: '40mm',
        price: 290.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=300'
      }
    ]
  },
  {
    id: 'ord-98212',
    reference: '#UC-98212-Z',
    patron: {
      name: 'Kaelen Voss',
      email: 'k.voss@studio-arch.com',
      city: 'Berlin, DE',
      phone: '+49 30 112233',
      isVip: true
    },
    cartSummary: '1 item (Modular Daypack 22L)',
    itemsCount: 1,
    subtotal: 180.00,
    shipping: 15.00,
    tax: 0.00,
    total: 195.00,
    timestamp: 'Yesterday 19:10',
    date: '2024-10-30 19:10',
    paymentStatus: 'SETTLED',
    fulfillmentState: 'DELIVERED',
    courier: 'FedEx International Connect',
    trackingNumber: 'FX849102847',
    deliveryMethod: 'FedEx Priority Freight',
    shippingAddress: {
      fullName: 'Kaelen Voss',
      recipient: 'Kaelen Voss',
      street: 'Torstrasse 140',
      address: 'Torstrasse 140',
      city: 'Berlin',
      state: 'Berlin',
      postalCode: '10119',
      country: 'Germany',
      phone: '+49 30 112233'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '1109',
      holder: 'KAELEN VOSS',
      expiry: '04/29',
      label: 'Credit Card (Visa •••• 1109)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-30 19:10', completed: true, description: 'Order confirmed' },
      { step: 'Payment Confirmed', date: '2024-10-30 19:11', completed: true, description: 'Settled via Visa' },
      { step: 'Quality Inspected', date: '2024-10-30 20:00', completed: true, description: 'Waterproof seam sealing verified' },
      { step: 'Courier Handover', date: '2024-10-31 08:00', completed: true, description: 'Dispatched with FedEx flight' },
      { step: 'Delivered', date: '2024-10-31 16:45', completed: true, current: true, description: 'Delivered to recipient in Berlin' }
    ],
    items: [
      {
        id: 'item-4',
        productId: 'uc-bg-021',
        title: 'UrbanCart Modular Daypack 22L',
        category: 'TRAVEL & CARRY',
        colorway: 'Slate Graphite',
        size: '22 Liters',
        price: 180.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300'
      }
    ]
  },
  {
    id: 'ord-98211',
    reference: '#UC-98211-W',
    patron: {
      name: 'Maya Lin-Duarte',
      email: 'maya@in-duarte.io',
      city: 'New York, US',
      phone: '+1 (212) 555-0199',
      isVip: false
    },
    cartSummary: '3 items (Pima Tee × 2, Bifold Wallet)',
    itemsCount: 3,
    subtotal: 210.00,
    shipping: 10.00,
    tax: 15.00,
    total: 235.00,
    timestamp: 'Yesterday 16:04',
    date: '2024-10-30 16:04',
    paymentStatus: 'REVIEW REQUIRED',
    fulfillmentState: 'HOLD ON GATE 2',
    courier: 'UPS Worldwide Saver',
    trackingNumber: '1Z9999999999999999',
    deliveryMethod: 'UPS Express International',
    shippingAddress: {
      fullName: 'Maya Lin-Duarte',
      recipient: 'Maya Lin-Duarte',
      street: '450 West 14th Street, Apt 8B',
      address: '450 West 14th Street, Apt 8B',
      city: 'New York',
      state: 'NY',
      postalCode: '10014',
      country: 'United States',
      phone: '+1 (212) 555-0199'
    },
    paymentMethod: {
      type: 'card',
      brand: 'American Express',
      last4: '3004',
      holder: 'MAYA LIN-DUARTE',
      expiry: '09/26',
      label: 'American Express (•••• 3004)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-30 16:04', completed: true, description: 'Order submitted by patron' },
      { step: 'Payment Confirmed', date: '2024-10-30 16:05', completed: true, description: 'Pre-authorization on Amex' },
      { step: 'Quality Inspected', date: '2024-10-30 17:00', completed: true, current: true, description: 'Customs clearance review pending' },
      { step: 'Courier Handover', date: 'Pending', completed: false, description: 'Courier dispatch awaiting gate release' },
      { step: 'Delivered', date: 'Est. Nov 04, 2024', completed: false, description: 'Signature delivery in Manhattan' }
    ],
    items: [
      {
        id: 'item-5',
        productId: 'uc-ap-012',
        title: 'UrbanCart Heavyweight Pima Cotton Tee',
        category: 'ATELIER APPAREL',
        colorway: 'Washed Black',
        size: 'M',
        price: 55.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=300'
      },
      {
        id: 'item-6',
        productId: 'uc-wl-009',
        title: 'UrbanCart Bridle Leather Bifold Wallet',
        category: 'LEATHER GOODS',
        colorway: 'Cognac Brown',
        size: 'Standard',
        price: 100.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300'
      }
    ]
  },
  {
    id: 'ord-98210',
    reference: '#UC-98210-V',
    patron: {
      name: 'Henrik Lindqvist',
      email: 'h.lindqvist@scandic.se',
      city: 'Copenhagen, DK',
      phone: '+45 33 11 22 33',
      isVip: true
    },
    cartSummary: '2 items (Sneaker Chalk White, Merino Socks)',
    itemsCount: 2,
    subtotal: 175.00,
    shipping: 10.00,
    tax: 0.00,
    total: 185.00,
    timestamp: 'Oct 29 11:15',
    date: '2024-10-29 11:15',
    paymentStatus: 'SETTLED',
    fulfillmentState: 'DELIVERED',
    courier: 'PostNord Direct',
    trackingNumber: 'PN772910482',
    deliveryMethod: 'Nordic Ground Express',
    shippingAddress: {
      fullName: 'Henrik Lindqvist',
      recipient: 'Henrik Lindqvist',
      street: 'Bredgade 28, 2. th',
      address: 'Bredgade 28, 2. th',
      city: 'Copenhagen',
      state: 'Capital Region',
      postalCode: '1260',
      country: 'Denmark',
      phone: '+45 33 11 22 33'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '7721',
      holder: 'HENRIK LINDQVIST',
      expiry: '06/27',
      label: 'Credit Card (Visa •••• 7721)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-29 11:15', completed: true, description: 'Order entered ledger' },
      { step: 'Payment Confirmed', date: '2024-10-29 11:16', completed: true, description: 'Captured via Visa' },
      { step: 'Quality Inspected', date: '2024-10-29 13:00', completed: true, description: 'Artisan QA certified' },
      { step: 'Courier Handover', date: '2024-10-29 16:30', completed: true, description: 'Scanned at PostNord depot' },
      { step: 'Delivered', date: '2024-10-30 10:15', completed: true, current: true, description: 'Delivered to doorstep in Copenhagen' }
    ],
    items: [
      {
        id: 'item-7',
        productId: 'uc-fw-086',
        title: 'UrbanCart Mono Low-Top Sneaker',
        category: 'FOOTWEAR STUDIO',
        colorway: 'Chalk White',
        size: 'EU 44 / US 10.5',
        price: 160.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300'
      },
      {
        id: 'item-8',
        productId: 'uc-sk-001',
        title: 'UrbanCart Ribbed Merino Wool Socks',
        category: 'STUDIO ESSENTIALS',
        colorway: 'Charcoal Melange',
        size: 'One Size',
        price: 15.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=300'
      }
    ]
  },
  {
    id: 'ord-98209',
    reference: '#UC-98209-U',
    patron: {
      name: 'Sophia Aris',
      email: 'sophia@atelier-paris.fr',
      city: 'Paris, FR',
      phone: '+33 1 42 68 55 00',
      isVip: false
    },
    cartSummary: '1 item (Titanium Eyewear Gunmetal)',
    itemsCount: 1,
    subtotal: 135.00,
    shipping: 10.00,
    tax: 0.00,
    total: 145.00,
    timestamp: 'Oct 29 09:30',
    date: '2024-10-29 09:30',
    paymentStatus: 'CAPTURED',
    fulfillmentState: 'COURIER DISPATCHED',
    courier: 'Colissimo International',
    trackingNumber: 'FR910284729',
    deliveryMethod: 'Colissimo Priority Express',
    shippingAddress: {
      fullName: 'Sophia Aris',
      recipient: 'Sophia Aris',
      street: '12 Rue de la Paix',
      address: '12 Rue de la Paix',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75002',
      country: 'France',
      phone: '+33 1 42 68 55 00'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Mastercard',
      last4: '5519',
      holder: 'SOPHIA ARIS',
      expiry: '02/28',
      label: 'Credit Card (Mastercard •••• 5519)'
    },
    timeline: [
      { step: 'Order Placed', date: '2024-10-29 09:30', completed: true, description: 'Order registered' },
      { step: 'Payment Confirmed', date: '2024-10-29 09:31', completed: true, description: 'Mastercard authorized' },
      { step: 'Quality Inspected', date: '2024-10-29 11:30', completed: true, description: 'Optic frame hinges calibrated' },
      { step: 'Courier Handover', date: '2024-10-29 14:00', completed: true, current: true, description: 'In transit with Colissimo Paris' },
      { step: 'Delivered', date: 'Est. Nov 01, 2024', completed: false, description: 'Personal delivery' }
    ],
    items: [
      {
        id: 'item-9',
        productId: 'uc-ew-015',
        title: 'UrbanCart Japanese Titanium Eyewear',
        category: 'OPTICAL & SHADES',
        colorway: 'Matte Gunmetal',
        size: '49-20-145',
        price: 135.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=300'
      }
    ]
  }
];
