# MallOS POS — Express Backend Integration

## What Was Done

Your frontend-only MallOS Point of Sale app has been upgraded with a **full Express.js backend**.

### New Project Structure

```
Project 3/
├── server.js          ← Express backend (NEW)
├── db.json            ← JSON file database (auto-created)
├── package.json       ← Updated with start scripts
├── public/            ← Frontend files served by Express
│   ├── index.html
│   ├── script.js      ← Refactored to use REST API
│   └── style.css
├── index.html         ← Original (kept as backup)
├── script.js          ← Original (kept as backup)
└── style.css          ← Original (kept as backup)
```

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/admin` | Validate admin PIN |
| `GET` | `/api/products` | List all products (supports `?category=` filter) |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/products` | Add new product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `PATCH` | `/api/products/:id/stock` | Toggle stock status |
| `GET` | `/api/cart` | Get cart (enriched with product data) |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:productId` | Update item quantity |
| `DELETE` | `/api/cart/:productId` | Remove item from cart |
| `DELETE` | `/api/cart` | Clear entire cart |
| `POST` | `/api/coupons/validate` | Validate coupon code |
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/orders` | Checkout (create order) |
| `GET` | `/api/orders/:id` | Get single order |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/analytics` | Get sales analytics |

### How to Run

```bash
npm start
# or
node server.js
```

Then open **http://localhost:3000** in your browser.

### Key Changes

- **Backend**: Express server with RESTful API, input validation, and JSON file persistence
- **Frontend**: All `localStorage` operations replaced with `fetch()` API calls
- **Data persistence**: Uses `db.json` file instead of browser localStorage
- **Admin PIN verification**: Now validated server-side via `/api/auth/admin`
- **Bill calculation**: Works correctly with server-enriched cart data
- **Analytics**: Computed server-side via `/api/analytics`

## Screenshots

### Cart with Bill Summary
![Cart with items and correct bill totals](cart_bill_summary_1776947996105.png)

### Admin Dashboard
![Admin inventory management panel](admin_dashboard_1776948037113.png)
