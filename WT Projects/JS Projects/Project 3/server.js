/* ═══════════════════════════════════════════════════════
   MallOS POS — Express Backend (server.js)
   
   REST API for Products, Cart, Orders, Coupons & Analytics.
   Data persisted in a JSON file (db.json) for simplicity.
   
   Endpoints:
     GET    /api/products          — list all products
     GET    /api/products/:id      — get single product
     POST   /api/products          — add new product
     PUT    /api/products/:id      — update a product
     DELETE /api/products/:id      — delete a product
     PATCH  /api/products/:id/stock — toggle in-stock status

     GET    /api/cart               — get current cart
     POST   /api/cart               — add item to cart
     PUT    /api/cart/:productId    — update item qty
     DELETE /api/cart/:productId    — remove item from cart
     DELETE /api/cart               — clear entire cart

     POST   /api/coupons/validate   — validate a coupon code

     GET    /api/orders             — list all orders
     POST   /api/orders             — create a new order (checkout)
     PATCH  /api/orders/:id/status  — update order status

     GET    /api/analytics          — get analytics summary

     POST   /api/auth/admin         — validate admin PIN
═══════════════════════════════════════════════════════ */

const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// ── Database File ──────────────────────────────────────
const DB_PATH = path.join(__dirname, "db.json");

// ── Constants ──────────────────────────────────────────
const ADMIN_PIN = "1234";
const CGST_RATE = 0.09;
const SGST_RATE = 0.09;

const COUPONS = {
  SAVE10:   { type: "percent", value: 10 },
  FLAT100:  { type: "flat",    value: 100 },
  WELCOME5: { type: "percent", value: 5  },
  OFF200:   { type: "flat",    value: 200 },
};

const ORDER_STATUSES = ["Pending", "Packed", "Ready", "Completed"];

const DEFAULT_PRODUCTS = [
  { id: "p1",  name: "Blue Denim Jacket",    price: 1799, category: "Clothing",    emoji: "🧥", inStock: true },
  { id: "p2",  name: "White Linen Shirt",    price: 899,  category: "Clothing",    emoji: "👔", inStock: true },
  { id: "p3",  name: "Floral Midi Skirt",    price: 1199, category: "Clothing",    emoji: "👗", inStock: true },
  { id: "p4",  name: "Classic Black Tee",    price: 499,  category: "Clothing",    emoji: "👕", inStock: true },
  { id: "p5",  name: "Wireless Earbuds",     price: 3499, category: "Electronics", emoji: "🎧", inStock: true },
  { id: "p6",  name: "USB-C Power Bank",     price: 1299, category: "Electronics", emoji: "🔋", inStock: true },
  { id: "p7",  name: "Smart Watch",          price: 8999, category: "Electronics", emoji: "⌚", inStock: true },
  { id: "p8",  name: "Portable Speaker",     price: 2199, category: "Electronics", emoji: "🔊", inStock: false },
  { id: "p9",  name: "Organic Green Tea",    price: 299,  category: "Groceries",   emoji: "🍵", inStock: true },
  { id: "p10", name: "Almond Trail Mix",     price: 449,  category: "Groceries",   emoji: "🥜", inStock: true },
  { id: "p11", name: "Dark Chocolate Bar",   price: 199,  category: "Groceries",   emoji: "🍫", inStock: true },
  { id: "p12", name: "Himalayan Pink Salt",  price: 149,  category: "Groceries",   emoji: "🧂", inStock: true },
  { id: "p13", name: "Leather Wallet",       price: 1099, category: "Accessories", emoji: "👜", inStock: true },
  { id: "p14", name: "Aviator Sunglasses",   price: 1499, category: "Accessories", emoji: "🕶", inStock: true },
  { id: "p15", name: "Silver Stud Earrings", price: 699,  category: "Accessories", emoji: "💍", inStock: true },
  { id: "p16", name: "Canvas Tote Bag",      price: 399,  category: "Accessories", emoji: "🛍", inStock: true },
];

// ── DB Read/Write Helpers ──────────────────────────────
function readDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading DB:", e.message);
  }
  // Seed default data
  const db = {
    products: [...DEFAULT_PRODUCTS],
    cart: [],
    orders: [],
  };
  writeDB(db);
  return db;
}

function writeDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing DB:", e.message);
  }
}

// ── ID Generator ───────────────────────────────────────
function genId(prefix) {
  return prefix + "-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

/* ═══════════════════════════════════════════════════════
   AUTH ROUTES
═══════════════════════════════════════════════════════ */
app.post("/api/auth/admin", (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    return res.json({ success: true, message: "Access granted" });
  }
  return res.status(401).json({ success: false, message: "Incorrect PIN" });
});

/* ═══════════════════════════════════════════════════════
   PRODUCT ROUTES
═══════════════════════════════════════════════════════ */

// GET /api/products — list all (optional ?category=Clothing)
app.get("/api/products", (req, res) => {
  const db = readDB();
  let products = db.products;

  if (req.query.category && req.query.category !== "All") {
    products = products.filter(p => p.category === req.query.category);
  }

  res.json({ success: true, data: products });
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, data: product });
});

// POST /api/products — add new product
app.post("/api/products", (req, res) => {
  const { name, price, category, emoji } = req.body;

  // Validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Product name is required" });
  }
  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ success: false, message: "Valid price is required" });
  }
  const validCategories = ["Clothing", "Electronics", "Groceries", "Accessories"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ success: false, message: "Invalid category" });
  }

  const db = readDB();
  const newProduct = {
    id: genId("P"),
    name: name.trim(),
    price: Number(price),
    category,
    emoji: emoji || "📦",
    inStock: true,
  };
  db.products.push(newProduct);
  writeDB(db);

  res.status(201).json({ success: true, data: newProduct, message: "Product added" });
});

// PUT /api/products/:id — update product
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });

  const { name, price, category, emoji } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Product name cannot be empty" });
    }
    db.products[idx].name = name.trim();
  }
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Valid price is required" });
    }
    db.products[idx].price = Number(price);
  }
  if (category !== undefined) {
    const validCategories = ["Clothing", "Electronics", "Groceries", "Accessories"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    db.products[idx].category = category;
  }
  if (emoji !== undefined) db.products[idx].emoji = emoji || "📦";

  writeDB(db);
  res.json({ success: true, data: db.products[idx], message: "Product updated" });
});

// DELETE /api/products/:id
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Product not found" });

  const deleted = db.products.splice(idx, 1)[0];

  // Also remove from cart if present
  db.cart = db.cart.filter(i => i.productId !== req.params.id);

  writeDB(db);
  res.json({ success: true, data: deleted, message: "Product deleted" });
});

// PATCH /api/products/:id/stock — toggle stock status
app.patch("/api/products/:id/stock", (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  product.inStock = !product.inStock;
  writeDB(db);

  res.json({
    success: true,
    data: product,
    message: product.inStock ? "Marked as In Stock" : "Marked as Out of Stock",
  });
});

/* ═══════════════════════════════════════════════════════
   CART ROUTES
═══════════════════════════════════════════════════════ */

// GET /api/cart
app.get("/api/cart", (req, res) => {
  const db = readDB();
  // Enrich cart items with product info
  const enriched = db.cart.map(item => {
    const product = db.products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || null,
      lineTotal: product ? product.price * item.qty : 0,
    };
  }).filter(item => item.product !== null);

  res.json({ success: true, data: enriched });
});

// POST /api/cart — add item { productId }
app.post("/api/cart", (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

  const db = readDB();
  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  if (!product.inStock) return res.status(400).json({ success: false, message: "Product is out of stock" });

  const existing = db.cart.find(i => i.productId === productId);
  if (existing) {
    existing.qty++;
  } else {
    db.cart.push({ productId, qty: 1 });
  }
  writeDB(db);

  res.json({ success: true, message: "Added to cart", data: db.cart });
});

// PUT /api/cart/:productId — update qty { qty }
app.put("/api/cart/:productId", (req, res) => {
  const { qty } = req.body;
  if (qty === undefined || isNaN(Number(qty))) {
    return res.status(400).json({ success: false, message: "Valid qty is required" });
  }

  const db = readDB();
  const item = db.cart.find(i => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

  const newQty = Number(qty);
  if (newQty <= 0) {
    db.cart = db.cart.filter(i => i.productId !== req.params.productId);
  } else {
    item.qty = newQty;
  }
  writeDB(db);

  res.json({ success: true, data: db.cart });
});

// DELETE /api/cart/:productId — remove single item
app.delete("/api/cart/:productId", (req, res) => {
  const db = readDB();
  db.cart = db.cart.filter(i => i.productId !== req.params.productId);
  writeDB(db);
  res.json({ success: true, message: "Item removed", data: db.cart });
});

// DELETE /api/cart — clear cart
app.delete("/api/cart", (req, res) => {
  const db = readDB();
  db.cart = [];
  writeDB(db);
  res.json({ success: true, message: "Cart cleared" });
});

/* ═══════════════════════════════════════════════════════
   COUPON ROUTES
═══════════════════════════════════════════════════════ */

// POST /api/coupons/validate — { code }
app.post("/api/coupons/validate", (req, res) => {
  const code = (req.body.code || "").trim().toUpperCase();
  if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });

  if (COUPONS[code]) {
    return res.json({ success: true, data: { code, ...COUPONS[code] }, message: `Coupon "${code}" is valid` });
  }
  return res.status(404).json({ success: false, message: "Invalid coupon code" });
});

/* ═══════════════════════════════════════════════════════
   ORDER ROUTES
═══════════════════════════════════════════════════════ */

// GET /api/orders
app.get("/api/orders", (req, res) => {
  const db = readDB();
  // Newest first
  const sorted = [...db.orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ success: true, data: sorted });
});

// POST /api/orders — create order (checkout)
// Optionally accepts { couponCode } in body
app.post("/api/orders", (req, res) => {
  const db = readDB();

  if (db.cart.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const { couponCode } = req.body;

  // Build order items from cart
  const items = [];
  for (const cartItem of db.cart) {
    const product = db.products.find(p => p.id === cartItem.productId);
    if (!product) continue;
    items.push({
      productId: product.id,
      name: product.name,
      emoji: product.emoji || "📦",
      price: product.price,
      qty: cartItem.qty,
      lineTotal: product.price * cartItem.qty,
    });
  }

  if (items.length === 0) {
    return res.status(400).json({ success: false, message: "No valid items in cart" });
  }

  // Calculate bill
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

  let discount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      appliedCoupon = code;
      if (COUPONS[code].type === "percent") {
        discount = subtotal * (COUPONS[code].value / 100);
      } else {
        discount = Math.min(COUPONS[code].value, subtotal);
      }
    }
  }

  const taxable = subtotal - discount;
  const cgst = taxable * CGST_RATE;
  const sgst = taxable * SGST_RATE;
  const total = taxable + cgst + sgst;

  const order = {
    id: genId("ORD"),
    items,
    subtotal,
    discount,
    cgst,
    sgst,
    total,
    coupon: appliedCoupon,
    timestamp: new Date().toISOString(),
    status: "Pending",
  };

  db.orders.push(order);
  db.cart = []; // Clear cart after checkout
  writeDB(db);

  res.status(201).json({ success: true, data: order, message: "Order placed successfully" });
});

// GET /api/orders/:id
app.get("/api/orders/:id", (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
});

// PATCH /api/orders/:id/status — { status }
app.patch("/api/orders/:id/status", (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}` });
  }

  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = status;
  writeDB(db);

  res.json({ success: true, data: order, message: `Order status updated to ${status}` });
});

/* ═══════════════════════════════════════════════════════
   ANALYTICS ROUTE
═══════════════════════════════════════════════════════ */

app.get("/api/analytics", (req, res) => {
  const db = readDB();

  const totalRevenue = db.orders.reduce((s, o) => s + o.total, 0);
  const totalOrders  = db.orders.length;
  const totalProducts = db.products.length;

  // Top-selling products
  const productSales = {};
  db.orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.name]) productSales[item.name] = { qty: 0, revenue: 0 };
      productSales[item.name].qty += item.qty;
      productSales[item.name].revenue += item.lineTotal;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 6)
    .map(([name, data]) => ({ name, ...data }));

  // Category-wise sales
  const catSales = {};
  db.orders.forEach(order => {
    order.items.forEach(item => {
      const product = db.products.find(p => p.id === item.productId) || { category: "Unknown" };
      if (!catSales[product.category]) catSales[product.category] = 0;
      catSales[product.category] += item.lineTotal;
    });
  });

  const categorySales = Object.entries(catSales)
    .sort((a, b) => b[1] - a[1])
    .map(([category, revenue]) => ({ category, revenue }));

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      totalProducts,
      topProducts,
      categorySales,
    },
  });
});

/* ═══════════════════════════════════════════════════════
   CATCH-ALL — Serve index.html for SPA routing
═══════════════════════════════════════════════════════ */
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ═══════════════════════════════════════════════════════
   START SERVER
═══════════════════════════════════════════════════════ */
app.listen(PORT, () => {
  console.log(`\n  🛍  MallOS POS Server running at http://localhost:${PORT}\n`);
  console.log(`  API endpoints available at http://localhost:${PORT}/api\n`);
});
