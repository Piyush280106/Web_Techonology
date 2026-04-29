/* ═══════════════════════════════════════════════════════
   MallOS POS — script.js
   Pure vanilla JS. No frameworks, no external libs.
   Architecture:
     - State (products, cart, orders) managed in memory
       and persisted in localStorage.
     - Each logical section is clearly separated by comments.
     - DOM helpers at the top, feature functions below.
═══════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────
   CONSTANTS & CONFIGURATION
───────────────────────────────────────────────────── */
const ADMIN_PIN       = "1234";
const TAX_RATE        = 0.18;   // 18% GST = 9% CGST + 9% SGST
const CGST_RATE       = 0.09;
const SGST_RATE       = 0.09;
const LS_PRODUCTS_KEY = "mallos_products";
const LS_ORDERS_KEY   = "mallos_orders";
const LS_CART_KEY     = "mallos_cart";

/** Valid coupon codes: key = code, value = {type, value} */
const COUPONS = {
  "SAVE10":   { type: "percent", value: 10 },
  "FLAT100":  { type: "flat",    value: 100 },
  "WELCOME5": { type: "percent", value: 5  },
  "OFF200":   { type: "flat",    value: 200 },
};

/** Status steps for the order tracker */
const ORDER_STATUSES = ["Pending", "Packed", "Ready", "Completed"];

/* ─────────────────────────────────────────────────────
   DEFAULT PRODUCT CATALOG
   (seeded to localStorage on first run)
───────────────────────────────────────────────────── */
const DEFAULT_PRODUCTS = [
  // Clothing
  { id: "p1",  name: "Blue Denim Jacket",    price: 1799, category: "Clothing",     emoji: "🧥", inStock: true },
  { id: "p2",  name: "White Linen Shirt",    price: 899,  category: "Clothing",     emoji: "👔", inStock: true },
  { id: "p3",  name: "Floral Midi Skirt",    price: 1199, category: "Clothing",     emoji: "👗", inStock: true },
  { id: "p4",  name: "Classic Black Tee",    price: 499,  category: "Clothing",     emoji: "👕", inStock: true },
  // Electronics
  { id: "p5",  name: "Wireless Earbuds",     price: 3499, category: "Electronics",  emoji: "🎧", inStock: true },
  { id: "p6",  name: "USB-C Power Bank",     price: 1299, category: "Electronics",  emoji: "🔋", inStock: true },
  { id: "p7",  name: "Smart Watch",          price: 8999, category: "Electronics",  emoji: "⌚", inStock: true },
  { id: "p8",  name: "Portable Speaker",     price: 2199, category: "Electronics",  emoji: "🔊", inStock: false },
  // Groceries
  { id: "p9",  name: "Organic Green Tea",    price: 299,  category: "Groceries",    emoji: "🍵", inStock: true },
  { id: "p10", name: "Almond Trail Mix",     price: 449,  category: "Groceries",    emoji: "🥜", inStock: true },
  { id: "p11", name: "Dark Chocolate Bar",   price: 199,  category: "Groceries",    emoji: "🍫", inStock: true },
  { id: "p12", name: "Himalayan Pink Salt",  price: 149,  category: "Groceries",    emoji: "🧂", inStock: true },
  // Accessories
  { id: "p13", name: "Leather Wallet",       price: 1099, category: "Accessories",  emoji: "👜", inStock: true },
  { id: "p14", name: "Aviator Sunglasses",   price: 1499, category: "Accessories",  emoji: "🕶", inStock: true },
  { id: "p15", name: "Silver Stud Earrings", price: 699,  category: "Accessories",  emoji: "💍", inStock: true },
  { id: "p16", name: "Canvas Tote Bag",      price: 399,  category: "Accessories",  emoji: "🛍", inStock: true },
];

/* ─────────────────────────────────────────────────────
   APPLICATION STATE
───────────────────────────────────────────────────── */
let state = {
  products:       [],   // current product list (from LS)
  cart:           [],   // [{productId, qty}]
  orders:         [],   // persisted order objects
  activeCategory: "All",
  coupon:         null, // applied coupon object {code, type, value}
  currentOrderId: null, // order ID being tracked in customer view
  editingProductId: null, // for admin edit mode
  isAdminView:    false,
};

/* ─────────────────────────────────────────────────────
   LOCALSTORAGE HELPERS
───────────────────────────────────────────────────── */
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.warn("LS write failed:", e); }
}

/* ─────────────────────────────────────────────────────
   BOOTSTRAP — runs once on load
───────────────────────────────────────────────────── */
function bootstrap() {
  // Load or seed products
  const savedProducts = lsGet(LS_PRODUCTS_KEY);
  state.products = (savedProducts && savedProducts.length > 0) ? savedProducts : [...DEFAULT_PRODUCTS];
  if (!savedProducts || savedProducts.length === 0) lsSet(LS_PRODUCTS_KEY, state.products);

  // Load orders
  state.orders = lsGet(LS_ORDERS_KEY) || [];

  // Load cart
  state.cart = lsGet(LS_CART_KEY) || [];

  // Render customer view
  renderProductGrid();
  renderCart();
  bindCustomerEvents();
  bindAdminEvents();

  // Show toast about demo coupons
  setTimeout(() => toast("💡 Try coupons: SAVE10, FLAT100, WELCOME5"), 1200);
}

/* ─────────────────────────────────────────────────────
   DOM QUERY HELPERS
───────────────────────────────────────────────────── */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ─────────────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────────────── */
let toastTimer;
function toast(msg) {
  let el = $("#toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

/* ─────────────────────────────────────────────────────
   UNIQUE ID GENERATOR
───────────────────────────────────────────────────── */
function genId(prefix) {
  return prefix + "-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER VIEW — PRODUCT CATALOG
═══════════════════════════════════════════════════════ */

/** Render product cards filtered by active category */
function renderProductGrid() {
  const grid = $("#productGrid");
  grid.innerHTML = "";

  const filtered = state.activeCategory === "All"
    ? state.products
    : state.products.filter(p => p.category === state.activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty-msg" style="grid-column:1/-1">No products in this category.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card" + (product.inStock ? "" : " out-of-stock");
    card.dataset.id = product.id;
    card.innerHTML = `
      ${!product.inStock ? '<span class="product-oos-tag">OUT OF STOCK</span>' : ""}
      <div class="product-emoji">${product.emoji || "📦"}</div>
      <div class="product-name">${escHtml(product.name)}</div>
      <span class="product-cat">${escHtml(product.category)}</span>
      <div class="product-price">₹${fmtNum(product.price)}</div>
      <button class="btn-add" data-id="${product.id}" ${!product.inStock ? "disabled" : ""}>
        + Add to Cart
      </button>
    `;
    grid.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER VIEW — CART
═══════════════════════════════════════════════════════ */

/** Return the product object by id */
function getProduct(id) { return state.products.find(p => p.id === id); }

/** Add a product to cart or increment its qty */
function addToCart(productId) {
  const existing = state.cart.find(i => i.productId === productId);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ productId, qty: 1 });
  }
  persistCart();
  renderCart();
  toast("✅ Added to cart");
}

/** Change item quantity; remove if qty drops to 0 */
function changeQty(productId, delta) {
  const item = state.cart.find(i => i.productId === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { persistCart(); renderCart(); }
}

/** Remove item entirely from cart */
function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.productId !== productId);
  persistCart();
  renderCart();
}

/** Persist cart to localStorage */
function persistCart() { lsSet(LS_CART_KEY, state.cart); }

/** Calculate bill totals */
function calcBill() {
  const subtotal = state.cart.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return p ? sum + p.price * item.qty : sum;
  }, 0);

  let discount = 0;
  if (state.coupon) {
    if (state.coupon.type === "percent") discount = subtotal * (state.coupon.value / 100);
    else discount = Math.min(state.coupon.value, subtotal); // flat, capped at subtotal
  }

  const taxable = subtotal - discount;
  const cgst    = taxable * CGST_RATE;
  const sgst    = taxable * SGST_RATE;
  const total   = taxable + cgst + sgst;

  return { subtotal, discount, cgst, sgst, total };
}

/** Re-render the cart panel */
function renderCart() {
  const container  = $("#cartItems");
  const emptyMsg   = $("#cartEmpty");
  const checkoutBtn = $("#checkoutBtn");
  const badge      = $("#cartBadge");

  // Update badge
  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalQty;
  badge.classList.toggle("hidden", totalQty === 0);

  // Cart items
  const cartHtml = state.cart.map(item => {
    const p = getProduct(item.productId);
    if (!p) return "";
    const lineTotal = p.price * item.qty;
    return `
      <div class="cart-item" data-id="${p.id}">
        <span class="ci-emoji">${p.emoji || "📦"}</span>
        <div class="ci-info">
          <div class="ci-name" title="${escHtml(p.name)}">${escHtml(p.name)}</div>
          <div class="ci-price">₹${fmtNum(p.price)} each</div>
          <div class="ci-controls">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
            <button class="remove-btn" data-id="${p.id}" title="Remove">🗑</button>
          </div>
        </div>
        <span class="ci-subtotal">₹${fmtNum(lineTotal)}</span>
      </div>
    `;
  }).join("");

  container.innerHTML = cartHtml;
  emptyMsg.classList.toggle("hidden", state.cart.length > 0);
  checkoutBtn.disabled = state.cart.length === 0;

  // Bill summary
  const bill = calcBill();
  $("#subtotalAmt").textContent = `₹${fmtNum(bill.subtotal)}`;
  $("#cgstAmt").textContent     = `₹${fmtNum(bill.cgst)}`;
  $("#sgstAmt").textContent     = `₹${fmtNum(bill.sgst)}`;
  $("#totalAmt").textContent    = `₹${fmtNum(bill.total)}`;

  const discRow = $("#discountRow");
  if (state.coupon && bill.discount > 0) {
    discRow.classList.remove("hidden");
    $("#discountAmt").textContent = `-₹${fmtNum(bill.discount)}`;
  } else {
    discRow.classList.add("hidden");
  }
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER VIEW — COUPON
═══════════════════════════════════════════════════════ */
function applyCoupon() {
  const code = $("#couponInput").value.trim().toUpperCase();
  const msg  = $("#couponMsg");

  if (!code) { msg.textContent = "Please enter a code."; msg.className = "coupon-msg error"; return; }

  if (COUPONS[code]) {
    state.coupon = { code, ...COUPONS[code] };
    msg.textContent = `✅ Coupon "${code}" applied!`;
    msg.className = "coupon-msg success";
    renderCart();
  } else {
    state.coupon = null;
    msg.textContent = `❌ Invalid coupon code.`;
    msg.className = "coupon-msg error";
    renderCart();
  }
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER VIEW — CHECKOUT
═══════════════════════════════════════════════════════ */
function checkout() {
  if (state.cart.length === 0) return;

  const bill = calcBill();
  const orderId = genId("ORD");
  const timestamp = new Date().toISOString();

  // Build order snapshot (copy product data at time of purchase)
  const items = state.cart.map(item => {
    const p = getProduct(item.productId);
    return {
      productId: p.id,
      name:  p.name,
      emoji: p.emoji || "📦",
      price: p.price,
      qty:   item.qty,
      lineTotal: p.price * item.qty,
    };
  });

  const order = {
    id:        orderId,
    items,
    subtotal:  bill.subtotal,
    discount:  bill.discount,
    cgst:      bill.cgst,
    sgst:      bill.sgst,
    total:     bill.total,
    coupon:    state.coupon ? state.coupon.code : null,
    timestamp,
    status:    "Pending",
  };

  // Persist order
  state.orders.push(order);
  lsSet(LS_ORDERS_KEY, state.orders);

  // Clear cart & coupon
  state.cart   = [];
  state.coupon = null;
  $("#couponInput").value = "";
  $("#couponMsg").textContent = "";
  persistCart();
  renderCart();

  // Track this order in customer view
  state.currentOrderId = orderId;

  // Show order confirmation
  showOrderStatus(order);
}

/** Display order status / tracker in customer view */
function showOrderStatus(order) {
  // Hide catalog, show order status
  $(".shop-layout").classList.add("hidden");
  $("#orderStatusSection").classList.remove("hidden");

  // Order ID
  $("#orderConfirmId").textContent = `Order ID: ${order.id} · ${fmtDate(order.timestamp)}`;

  // Items list
  const itemsList = $("#orderItemsList");
  itemsList.innerHTML = order.items.map(i =>
    `<div>${i.emoji} <strong>${escHtml(i.name)}</strong> × ${i.qty} — ₹${fmtNum(i.lineTotal)}</div>`
  ).join("");

  $("#orderTotalConfirm").textContent = `₹${fmtNum(order.total)}`;

  // Render status tracker
  renderStatusTracker(order.status);

  // Poll localStorage for status changes (simulates real-time via LS)
  startStatusPolling(order.id);
}

/** Build step-dot + connector tracker */
function renderStatusTracker(currentStatus) {
  const tracker = $("#statusTracker");
  tracker.innerHTML = "";
  const currentIdx = ORDER_STATUSES.indexOf(currentStatus);

  ORDER_STATUSES.forEach((step, idx) => {
    const isDone   = idx < currentIdx;
    const isActive = idx === currentIdx;

    const stepEl = document.createElement("div");
    stepEl.className = "status-step" + (isDone ? " done" : "") + (isActive ? " active" : "");
    stepEl.innerHTML = `
      <div class="step-dot">${isDone ? "✓" : (isActive ? "●" : "")}</div>
      <div class="step-label">${step}</div>
    `;
    tracker.appendChild(stepEl);

    // Add connector between steps (not after last)
    if (idx < ORDER_STATUSES.length - 1) {
      const conn = document.createElement("div");
      conn.className = "step-connector" + (isDone ? " done" : "");
      tracker.appendChild(conn);
    }
  });
}

/** Poll every 3s for status changes made in admin view */
let statusPollInterval;
function startStatusPolling(orderId) {
  clearInterval(statusPollInterval);
  statusPollInterval = setInterval(() => {
    const freshOrders = lsGet(LS_ORDERS_KEY) || [];
    const fresh = freshOrders.find(o => o.id === orderId);
    if (fresh) {
      state.orders = freshOrders; // sync
      renderStatusTracker(fresh.status);
    }
    // Stop polling if completed
    if (fresh && fresh.status === "Completed") clearInterval(statusPollInterval);
  }, 3000);
}

function returnToShop() {
  clearInterval(statusPollInterval);
  state.currentOrderId = null;
  $(".shop-layout").classList.remove("hidden");
  $("#orderStatusSection").classList.add("hidden");
}

/* ═══════════════════════════════════════════════════════
   ADMIN VIEW — AUTHENTICATION
═══════════════════════════════════════════════════════ */
function openPinModal() {
  $("#pinModal").classList.remove("hidden");
  $("#pinInput").value = "";
  $("#pinError").classList.add("hidden");
  setTimeout(() => $("#pinInput").focus(), 100);
}
function closePinModal() { $("#pinModal").classList.add("hidden"); }

function submitPin() {
  const entered = $("#pinInput").value.trim();
  if (entered === ADMIN_PIN) {
    closePinModal();
    switchToAdmin();
  } else {
    $("#pinError").classList.remove("hidden");
    $("#pinInput").value = "";
    $("#pinInput").focus();
  }
}

/* ═══════════════════════════════════════════════════════
   VIEW SWITCHING
═══════════════════════════════════════════════════════ */
function switchToAdmin() {
  state.isAdminView = true;
  $("#customerView").classList.add("hidden");
  $("#adminView").classList.remove("hidden");
  // Default to inventory tab
  showAdminSection("inventory");
  renderInventoryTable();
}

function switchToCustomer() {
  state.isAdminView = false;
  $("#adminView").classList.add("hidden");
  $("#customerView").classList.remove("hidden");
  clearInterval(statusPollInterval);
}

/** Show one admin section, hide others */
function showAdminSection(name) {
  $$(".admin-section").forEach(s => s.classList.add("hidden"));
  $$(".atab").forEach(t => t.classList.remove("active"));

  $(`#${name}Section`).classList.remove("hidden");
  $(`.atab[data-section="${name}"]`).classList.add("active");

  if (name === "orders")    renderAdminOrders();
  if (name === "analytics") renderAnalytics();
}

/* ═══════════════════════════════════════════════════════
   ADMIN — INVENTORY MANAGEMENT
═══════════════════════════════════════════════════════ */

/** Render the full inventory table */
function renderInventoryTable() {
  const tbody = $("#inventoryBody");
  tbody.innerHTML = "";

  if (state.products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No products. Add one above.</td></tr>`;
    return;
  }

  state.products.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.id = p.id;
    tr.innerHTML = `
      <td style="font-size:1.4rem">${p.emoji || "📦"}</td>
      <td>${escHtml(p.name)}</td>
      <td>${escHtml(p.category)}</td>
      <td><strong>₹${fmtNum(p.price)}</strong></td>
      <td><span class="status-pill ${p.inStock ? "in" : "out"}">${p.inStock ? "In Stock" : "Out of Stock"}</span></td>
      <td class="td-actions">
        <button class="btn-edit"   data-action="edit"   data-id="${p.id}">✏ Edit</button>
        <button class="btn-oos"    data-action="toggle" data-id="${p.id}">${p.inStock ? "📦 Mark OOS" : "✅ Mark In Stock"}</button>
        <button class="btn-danger" data-action="delete" data-id="${p.id}">🗑 Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/** Show the add/edit product form */
function showProductForm(productId = null) {
  state.editingProductId = productId;
  const form   = $("#productForm");
  const title  = $("#formTitle");
  const saveBtn = $("#saveProductBtn");

  if (productId) {
    const p = getProduct(productId);
    title.textContent       = "Edit Product";
    $("#pName").value       = p.name;
    $("#pPrice").value      = p.price;
    $("#pCategory").value   = p.category;
    $("#pEmoji").value      = p.emoji || "";
    saveBtn.textContent     = "💾 Update";
  } else {
    title.textContent       = "Add New Product";
    $("#pName").value       = "";
    $("#pPrice").value      = "";
    $("#pCategory").value   = "Clothing";
    $("#pEmoji").value      = "";
    saveBtn.textContent     = "💾 Save";
  }

  form.classList.remove("hidden");
  $("#pName").focus();
}

function hideProductForm() {
  state.editingProductId = null;
  $("#productForm").classList.add("hidden");
}

/** Save new or updated product */
function saveProduct() {
  const name     = $("#pName").value.trim();
  const price    = parseFloat($("#pPrice").value);
  const category = $("#pCategory").value;
  const emoji    = $("#pEmoji").value.trim() || "📦";

  if (!name)          { toast("❌ Product name is required."); return; }
  if (isNaN(price) || price < 0) { toast("❌ Enter a valid price."); return; }

  if (state.editingProductId) {
    // Edit existing
    const p = getProduct(state.editingProductId);
    p.name     = name;
    p.price    = price;
    p.category = category;
    p.emoji    = emoji;
    toast("✅ Product updated.");
  } else {
    // Add new
    const newProduct = {
      id:       genId("P"),
      name, price, category, emoji,
      inStock:  true,
    };
    state.products.push(newProduct);
    toast("✅ Product added.");
  }

  persistProducts();
  hideProductForm();
  renderInventoryTable();
  renderProductGrid(); // update customer view in background
}

/** Toggle in-stock status */
function toggleStock(productId) {
  const p = getProduct(productId);
  if (!p) return;
  p.inStock = !p.inStock;
  persistProducts();
  renderInventoryTable();
  renderProductGrid();
  toast(p.inStock ? "✅ Marked as In Stock." : "📦 Marked as Out of Stock.");
}

/** Delete product */
function deleteProduct(productId) {
  if (!confirm("Delete this product? This cannot be undone.")) return;
  state.products = state.products.filter(p => p.id !== productId);
  // Remove from any open carts
  state.cart = state.cart.filter(i => i.productId !== productId);
  persistProducts();
  persistCart();
  renderInventoryTable();
  renderProductGrid();
  renderCart();
  toast("🗑 Product deleted.");
}

function persistProducts() { lsSet(LS_PRODUCTS_KEY, state.products); }

/* ═══════════════════════════════════════════════════════
   ADMIN — ORDER MANAGEMENT
═══════════════════════════════════════════════════════ */

function renderAdminOrders() {
  // Always re-read from LS to get fresh data
  state.orders = lsGet(LS_ORDERS_KEY) || [];
  const container = $("#adminOrdersList");
  const countEl   = $("#orderCount");
  countEl.textContent = `${state.orders.length} order${state.orders.length !== 1 ? "s" : ""}`;

  if (state.orders.length === 0) {
    container.innerHTML = `<p class="no-orders-msg">No orders yet. Customers haven't checked out.</p>`;
    return;
  }

  // Show newest first
  const sorted = [...state.orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  container.innerHTML = sorted.map(order => `
    <div class="admin-order-card" data-order-id="${order.id}">
      <div>
        <div class="aoc-id">🧾 ${escHtml(order.id)}</div>
        <div class="aoc-meta">📅 ${fmtDate(order.timestamp)}${order.coupon ? ` · 🏷 ${escHtml(order.coupon)}` : ""}</div>
        <div class="aoc-items">
          ${order.items.map(i =>
            `<div class="aoc-item-row">${i.emoji} ${escHtml(i.name)} × ${i.qty} — ₹${fmtNum(i.lineTotal)}</div>`
          ).join("")}
        </div>
        <div class="aoc-total">Total: ₹${fmtNum(order.total)}</div>
      </div>
      <div class="aoc-status-wrap">
        <label>Order Status</label>
        <select class="status-select" data-order-id="${order.id}">
          ${ORDER_STATUSES.map(s =>
            `<option value="${s}" ${order.status === s ? "selected" : ""}>${s}</option>`
          ).join("")}
        </select>
      </div>
    </div>
  `).join("");

  // Bind status change events
  $$(".status-select").forEach(sel => {
    sel.addEventListener("change", (e) => {
      const ordId = e.target.dataset.orderId;
      const newStatus = e.target.value;
      updateOrderStatus(ordId, newStatus);
    });
  });
}

/** Update an order's status in LS */
function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  lsSet(LS_ORDERS_KEY, state.orders);
  toast(`📦 Order ${orderId} → ${newStatus}`);
}

/* ═══════════════════════════════════════════════════════
   ADMIN — ANALYTICS
═══════════════════════════════════════════════════════ */

function renderAnalytics() {
  state.orders = lsGet(LS_ORDERS_KEY) || [];

  // ── Summary Cards ──
  const totalRevenue = state.orders.reduce((s, o) => s + o.total, 0);
  $("#totalRevenue").textContent  = `₹${fmtNum(totalRevenue)}`;
  $("#totalOrders").textContent   = state.orders.length;
  $("#totalProducts").textContent = state.products.length;

  // ── Top Products ──
  // Aggregate qty sold per product across all orders
  const productSales = {};
  state.orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.name]) productSales[item.name] = { qty: 0, revenue: 0 };
      productSales[item.name].qty     += item.qty;
      productSales[item.name].revenue += item.lineTotal;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 6);

  const topCanvas = $("#topProductsChart");
  const noTop     = $("#noTopProducts");

  if (topProducts.length === 0) {
    topCanvas.classList.add("hidden");
    noTop.classList.remove("hidden");
  } else {
    topCanvas.classList.remove("hidden");
    noTop.classList.add("hidden");
    drawBarChart(
      topCanvas,
      topProducts.map(([name]) => truncStr(name, 12)),
      topProducts.map(([, d]) => d.qty),
      "Units Sold",
      "#f5a623"
    );
  }

  // ── Category Sales ──
  const catSales = {};
  state.orders.forEach(order => {
    order.items.forEach(item => {
      const p = state.products.find(pr => pr.id === item.productId) ||
                { category: "Unknown" };
      if (!catSales[p.category]) catSales[p.category] = 0;
      catSales[p.category] += item.lineTotal;
    });
  });

  const catCanvas = $("#categoryChart");
  const noCat     = $("#noCategoryData");
  const catEntries = Object.entries(catSales).sort((a, b) => b[1] - a[1]);

  if (catEntries.length === 0) {
    catCanvas.classList.add("hidden");
    noCat.classList.remove("hidden");
  } else {
    catCanvas.classList.remove("hidden");
    noCat.classList.add("hidden");
    drawBarChart(
      catCanvas,
      catEntries.map(([name]) => name),
      catEntries.map(([, rev]) => rev),
      "Revenue (₹)",
      "#5b9cf6"
    );
  }
}

/**
 * Draw a simple vertical bar chart on a <canvas> element.
 * Pure Canvas API — no external libraries.
 */
function drawBarChart(canvas, labels, values, yLabel, barColor) {
  const ctx    = canvas.getContext("2d");
  const W      = canvas.width;
  const H      = canvas.height;
  const padL   = 60;
  const padR   = 20;
  const padT   = 20;
  const padB   = 50;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  ctx.clearRect(0, 0, W, H);

  const maxVal = Math.max(...values, 1);
  const n      = labels.length;
  const barW   = Math.floor((chartW / n) * 0.55);
  const gap    = chartW / n;

  // Background
  ctx.fillStyle = "#1a1a1e";
  ctx.fillRect(0, 0, W, H);

  // Grid lines (5 horizontal)
  const gridLines = 5;
  ctx.strokeStyle = "#2e2e36";
  ctx.lineWidth   = 1;
  ctx.fillStyle   = "#8a8a96";
  ctx.font        = "11px 'DM Sans', sans-serif";
  ctx.textAlign   = "right";
  for (let i = 0; i <= gridLines; i++) {
    const y = padT + chartH - (i / gridLines) * chartH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();
    const labelVal = Math.round((i / gridLines) * maxVal);
    ctx.fillText(fmtNum(labelVal), padL - 6, y + 4);
  }

  // Y-axis label (rotated)
  ctx.save();
  ctx.translate(12, padT + chartH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle  = "#8a8a96";
  ctx.textAlign  = "center";
  ctx.font       = "11px 'DM Sans', sans-serif";
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // Bars
  labels.forEach((label, i) => {
    const barH = (values[i] / maxVal) * chartH;
    const x    = padL + i * gap + (gap - barW) / 2;
    const y    = padT + chartH - barH;

    // Bar with rounded top corners
    const radius = 4;
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Value label above bar
    ctx.fillStyle  = "#f0ede8";
    ctx.textAlign  = "center";
    ctx.font       = "bold 11px 'DM Sans', sans-serif";
    ctx.fillText(fmtNum(values[i]), x + barW / 2, y - 6);

    // X-axis label
    ctx.fillStyle  = "#8a8a96";
    ctx.font       = "11px 'DM Sans', sans-serif";
    ctx.fillText(label, x + barW / 2, padT + chartH + 18);
  });

  // X-axis line
  ctx.strokeStyle = "#2e2e36";
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(padL, padT + chartH);
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.stroke();
}

/* ═══════════════════════════════════════════════════════
   EVENT BINDINGS — CUSTOMER VIEW
═══════════════════════════════════════════════════════ */
function bindCustomerEvents() {

  // Category tab filter
  $("#categoryTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    $$(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    state.activeCategory = tab.dataset.cat;
    renderProductGrid();
  });

  // Add to cart (event delegation on product grid)
  $("#productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    addToCart(btn.dataset.id);
  });

  // Cart item controls (qty +/- and remove) via delegation
  $("#cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    const rem = e.target.closest(".remove-btn");

    if (btn) {
      const id  = btn.dataset.id;
      if (btn.dataset.action === "inc") changeQty(id, +1);
      if (btn.dataset.action === "dec") changeQty(id, -1);
    }
    if (rem) removeFromCart(rem.dataset.id);
  });

  // Coupon
  $("#applyCouponBtn").addEventListener("click", applyCoupon);
  $("#couponInput").addEventListener("keydown", (e) => { if (e.key === "Enter") applyCoupon(); });

  // Checkout
  $("#checkoutBtn").addEventListener("click", checkout);

  // New Order button (reset from order status page)
  $("#newOrderBtn").addEventListener("click", returnToShop);

  // Cart toggle (mobile)
  $("#cartToggleBtn").addEventListener("click", () => {
    $("#cartPanel").classList.toggle("open");
  });
  $("#cartCloseBtn").addEventListener("click", () => {
    $("#cartPanel").classList.remove("open");
  });

  // PIN modal triggers
  $("#adminPanelBtn").addEventListener("click", openPinModal);
  $("#pinCancelBtn").addEventListener("click", closePinModal);
  $("#pinSubmitBtn").addEventListener("click", submitPin);
  $("#pinInput").addEventListener("keydown", (e) => { if (e.key === "Enter") submitPin(); });

  // Click outside modal to close
  $("#pinModal").addEventListener("click", (e) => {
    if (e.target === $("#pinModal")) closePinModal();
  });
}

/* ═══════════════════════════════════════════════════════
   EVENT BINDINGS — ADMIN VIEW
═══════════════════════════════════════════════════════ */
function bindAdminEvents() {

  // Logout
  $("#logoutBtn").addEventListener("click", switchToCustomer);

  // Admin tab switching
  $("#adminTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".atab");
    if (!tab) return;
    showAdminSection(tab.dataset.section);
  });

  // Add product button
  $("#addProductBtn").addEventListener("click", () => showProductForm());
  $("#saveProductBtn").addEventListener("click", saveProduct);
  $("#cancelProductBtn").addEventListener("click", hideProductForm);

  // Inventory table actions (edit, toggle OOS, delete)
  $("#inventoryBody").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id     = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "edit")   showProductForm(id);
    if (action === "toggle") toggleStock(id);
    if (action === "delete") deleteProduct(id);
  });
}

/* ═══════════════════════════════════════════════════════
   UTILITY FUNCTIONS
═══════════════════════════════════════════════════════ */

/** Format number with commas and 2 decimal places */
function fmtNum(n) {
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format ISO date string to readable form */
function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true
  });
}

/** Escape HTML to prevent XSS */
function escHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/** Truncate string with ellipsis */
function truncStr(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str;
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", bootstrap);
