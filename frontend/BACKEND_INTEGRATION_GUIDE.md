# UrbanCart Backend Integration Guide

This guide details the API contracts, data models, and instructions for connecting the UrbanCart frontend to any live backend framework (Node.js/Express, Python/FastAPI/Django, Go, Ruby on Rails, NestJS, or Supabase/Firebase).

---

## 1. Quick Start: Connecting a Real Backend

By default, the application runs using `apiClient.js` in **Mock Mode** with realistic async latency and `localStorage` session storage.

To connect your live backend:

1. Create or edit `.env` in the `frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_USE_MOCK=false
   ```
2. Start your backend server listening on `http://localhost:5000`.
3. Restart the React dev server: `npm start`.

---

## 2. Authentication & Authorization

All authenticated requests include the JWT bearer token in the `Authorization` header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints:
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate with email & password | Public |
| `POST` | `/api/auth/register` | Create a new customer patron account | Public |
| `GET` | `/api/auth/me` | Fetch active customer profile | Authenticated |
| `PATCH`| `/api/auth/profile` | Update profile info, addresses, preferences | Authenticated |
| `POST` | `/api/auth/logout` | Invalidate token or clear session | Authenticated |

#### Sample Login Request:
```json
{
  "email": "alex.vance@atelier-member.org",
  "password": "Password123!"
}
```

#### Sample Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_patron_01",
    "name": "Alex Vance",
    "email": "alex.vance@atelier-member.org",
    "role": "customer",
    "memberTier": "ATELIER CIRCLE ELITE",
    "addresses": [ ... ],
    "paymentMethods": [ ... ]
  }
}
```

---

## 3. Product Catalog APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Query products with category, price, and search filters | Public |
| `GET` | `/api/products/:id` | Get individual product dossier with variants & reviews | Public |
| `POST` | `/api/products` | Create product (SKU, title, price, variants) | Admin Only |
| `PUT` | `/api/products/:id` | Update product details or inventory | Admin Only |
| `DELETE`| `/api/products/:id`| Archive or delete product | Admin Only |

#### Query Parameters for `GET /api/products`:
- `category`: `ALL` | `Footwear` | `Timepieces` | `Bags & Carry` | `Apparel` | `Accessories`
- `maxPrice`: Numeric filter (e.g. `250`)
- `search`: Search query string
- `sortBy`: `featured` | `price-asc` | `price-desc` | `rating`

---

## 4. Orders & Checkout APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/orders` | Fetch orders (filtered by current user or all for admin) | Authenticated |
| `GET` | `/api/orders/:id` | Retrieve single order details with shipment tracking | Authenticated |
| `POST` | `/api/orders` | Create confirmed order upon checkout completion | Public/Auth |
| `PATCH`| `/api/orders/:id/status` | Update fulfillment state (`PREPARING SHIPMENT`, `COURIER DISPATCHED`, `DELIVERED`) | Admin Only |

#### Sample Order Placement Payload:
```json
{
  "patron": {
    "name": "Julian Mercer",
    "email": "j.mercer@atelier.co",
    "city": "Stockholm, Sweden",
    "address": "Grev Turegatan 14",
    "postalCode": "114 46"
  },
  "items": [
    {
      "productId": "uc-fw-086",
      "title": "Mono Classic Low-Top Sneaker",
      "color": "Chalk White",
      "size": "10.0",
      "price": 160.0,
      "quantity": 1
    }
  ],
  "shippingMethod": "express",
  "shippingCost": 0,
  "subtotal": 160.0,
  "total": 160.0,
  "paymentMethod": "card"
}
```

---

## 5. Architectural Directory Layout

```
frontend/src/
├── services/
│   └── api/
│       ├── apiClient.js        # Base fetch client with mock toggle & auth headers
│       ├── authService.js      # Login, Register, Profile, Addresses
│       ├── productService.js   # Catalog queries & admin mutations
│       └── orderService.js     # Checkout, Order Ledger & Courier Tracking
├── context/
│   └── StoreContext.js         # Unified React State connecting UI to Service APIs
├── components/
│   ├── common/                 # Reusable UI primitives (Button, Modal, Badge, Input)
│   ├── AuthModal.js            # Login / Sign Up / Password Recovery
│   ├── MobileNavDrawer.js      # Responsive hamburger slide-out navigation
│   ├── OrderDetailsModal.js    # Itemized order inspector & invoice downloader
│   └── StorefrontNav.js        # Header with Auth avatar dropdown & responsive controls
└── pages/
    ├── AccountPage.js          # Full customer account, orders, & addresses portal
    ├── AdminDashboard.js       # OPS Console (Overview, Orders, Inventory, Customers)
    └── CheckoutPage.js         # 4-step luxury checkout flow
```
