/* ═══════════════════════════════════════════════════════
   MallOS POS — script.js (API-Powered Version)
   
   Connects to Express backend REST API.
   All CRUD operations go through fetch() calls.
   No localStorage — server is the source of truth.
═══════════════════════════════════════════════════════ */

"use strict";

/* ─────────────────────────────────────────────────────
   CONSTANTS & CONFIGURATION
───────────────────────────────────────────────────── */
const API_BASE      = "/api";
const TAX_RATE      = 0.18;
const CGST_RATE     = 0.09;
const SGST_RATE     = 0.09;

/** Status steps for the order tracker */
const ORDER_STATUSES = ["Pending", "Packed", "Ready", "Completed"];

/* ─────────────────────────────────────────────────────
   APPLICATION STATE (client-side cache, synced from API)
───────────────────────────────────────────────────── */
let state = {
  products:         [],
  cart:             [],   // enriched cart items from API
  orders:           [],
  activeCategory:   "All",
  coupon:           null, // { code, type, value }
  currentOrderId:   null,
  editingProductId: null,
  isAdminView:      false,
};

/* ─────────────────────────────────────────────────────
   API HELPER — centralized fetch wrapper
───────────────────────────────────────────────────── */
async function api(endpoint, options = {}) {
  const { method = "GET", body } = options;
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) config.body = JSON.stringify(body);

  try {
    const res  = await fetch(`${API_BASE}${endpoint}`, config);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    return json;
  } catch (err) {
    console.error(`API Error [${method} ${endpoint}]:`, err.message);
    throw err;
  }
}

/* ─────────────────────────────────────────────────────
   BOOTSTRAP — runs once on load
───────────────────────────────────────────────────── */
async function bootstrap() {
  try {
    // Load products from server
    const prodRes = await api("/products");
    state.products = prodRes.data;

    // Load cart from server
    const cartRes = await api("/cart");
    state.cart = cartRes.data;

    // Load orders
    const ordRes = await api("/orders");
    state.orders = ordRes.data;

    // Render
    renderProductGrid();
    renderCart();
    bindCustomerEvents();
    bindAdminEvents();

    setTimeout(() => toast("💡 Try coupons: SAVE10, FLAT100, WELCOME5"), 1200);
  } catch (err) {
    console.error("Bootstrap failed:", err);
    toast("⚠ Failed to load data from server");
  }
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

/** Add a product to cart via API */
async function addToCart(productId) {
  try {
    await api("/cart", { method: "POST", body: { productId } });
    // Refresh cart
    const cartRes = await api("/cart");
    state.cart = cartRes.data;
    renderCart();
    toast("✅ Added to cart");
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/** Change item quantity via API */
async function changeQty(productId, delta) {
  const item = state.cart.find(i => i.productId === productId);
  if (!item) return;

  const newQty = item.qty + delta;
  try {
    if (newQty <= 0) {
      await api(`/cart/${productId}`, { method: "DELETE" });
    } else {
      await api(`/cart/${productId}`, { method: "PUT", body: { qty: newQty } });
    }
    const cartRes = await api("/cart");
    state.cart = cartRes.data;
    renderCart();
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/** Remove item from cart via API */
async function removeFromCart(productId) {
  try {
    await api(`/cart/${productId}`, { method: "DELETE" });
    const cartRes = await api("/cart");
    state.cart = cartRes.data;
    renderCart();
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/** Calculate bill totals from cart state */
function calcBill() {
  const subtotal = state.cart.reduce((sum, item) => {
    return sum + (item.lineTotal || 0);
  }, 0);

  let discount = 0;
  if (state.coupon) {
    if (state.coupon.type === "percent") discount = subtotal * (state.coupon.value / 100);
    else discount = Math.min(state.coupon.value, subtotal);
  }

  const taxable = subtotal - discount;
  const cgst    = taxable * CGST_RATE;
  const sgst    = taxable * SGST_RATE;
  const total   = taxable + cgst + sgst;

  return { subtotal, discount, cgst, sgst, total };
}

/** Re-render the cart panel */
function renderCart() {
  const container   = $("#cartItems");
  const checkoutBtn = $("#checkoutBtn");
  const badge       = $("#cartBadge");

  // Update badge
  const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalQty;
  badge.classList.toggle("hidden", totalQty === 0);

  // Cart items — always include the empty message
  let cartHtml = "";

  if (state.cart.length === 0) {
    cartHtml = `<p class="empty-msg" id="cartEmpty">Your cart is empty.</p>`;
  } else {
    cartHtml = state.cart.map(item => {
      const p = item.product;
      if (!p) return "";
      const lineTotal = item.lineTotal;
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
  }

  container.innerHTML = cartHtml;
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
   CUSTOMER VIEW — COUPON (via API)
═══════════════════════════════════════════════════════ */
async function applyCoupon() {
  const code = $("#couponInput").value.trim().toUpperCase();
  const msg  = $("#couponMsg");

  if (!code) { msg.textContent = "Please enter a code."; msg.className = "coupon-msg error"; return; }

  try {
    const res = await api("/coupons/validate", { method: "POST", body: { code } });
    state.coupon = res.data;
    msg.textContent = `✅ Coupon "${code}" applied!`;
    msg.className = "coupon-msg success";
    renderCart();
  } catch (err) {
    state.coupon = null;
    msg.textContent = `❌ Invalid coupon code.`;
    msg.className = "coupon-msg error";
    renderCart();
  }
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER VIEW — CHECKOUT (via API)
═══════════════════════════════════════════════════════ */
async function checkout() {
  if (state.cart.length === 0) return;

  try {
    const body = {};
    if (state.coupon) body.couponCode = state.coupon.code;

    const res = await api("/orders", { method: "POST", body });
    const order = res.data;

    // Clear local cart & coupon
    state.cart   = [];
    state.coupon = null;
    $("#couponInput").value = "";
    $("#couponMsg").textContent = "";
    renderCart();

    // Track this order
    state.currentOrderId = order.id;
    showOrderStatus(order);

    toast("🎉 Order placed successfully!");
  } catch (err) {
    toast(`❌ Checkout failed: ${err.message}`);
  }
}

/** Display order status / tracker */
function showOrderStatus(order) {
  $(".shop-layout").classList.add("hidden");
  $("#orderStatusSection").classList.remove("hidden");

  $("#orderConfirmId").textContent = `Order ID: ${order.id} · ${fmtDate(order.timestamp)}`;

  const itemsList = $("#orderItemsList");
  itemsList.innerHTML = order.items.map(i =>
    `<div>${i.emoji} <strong>${escHtml(i.name)}</strong> × ${i.qty} — ₹${fmtNum(i.lineTotal)}</div>`
  ).join("");

  $("#orderTotalConfirm").textContent = `₹${fmtNum(order.total)}`;

  renderStatusTracker(order.status);
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

    if (idx < ORDER_STATUSES.length - 1) {
      const conn = document.createElement("div");
      conn.className = "step-connector" + (isDone ? " done" : "");
      tracker.appendChild(conn);
    }
  });
}

/** Poll API every 3s for status changes */
let statusPollInterval;
function startStatusPolling(orderId) {
  clearInterval(statusPollInterval);
  statusPollInterval = setInterval(async () => {
    try {
      const res = await api(`/orders/${orderId}`);
      const fresh = res.data;
      renderStatusTracker(fresh.status);
      if (fresh.status === "Completed") clearInterval(statusPollInterval);
    } catch (err) {
      // Silently fail polling
    }
  }, 3000);
}

function returnToShop() {
  clearInterval(statusPollInterval);
  state.currentOrderId = null;
  $(".shop-layout").classList.remove("hidden");
  $("#orderStatusSection").classList.add("hidden");
}

/* ═══════════════════════════════════════════════════════
   ADMIN VIEW — AUTHENTICATION (via API)
═══════════════════════════════════════════════════════ */
function openPinModal() {
  $("#pinModal").classList.remove("hidden");
  $("#pinInput").value = "";
  $("#pinError").classList.add("hidden");
  setTimeout(() => $("#pinInput").focus(), 100);
}
function closePinModal() { $("#pinModal").classList.add("hidden"); }

async function submitPin() {
  const entered = $("#pinInput").value.trim();
  try {
    await api("/auth/admin", { method: "POST", body: { pin: entered } });
    closePinModal();
    switchToAdmin();
  } catch (err) {
    $("#pinError").classList.remove("hidden");
    $("#pinInput").value = "";
    $("#pinInput").focus();
  }
}

/* ═══════════════════════════════════════════════════════
   VIEW SWITCHING
═══════════════════════════════════════════════════════ */
async function switchToAdmin() {
  state.isAdminView = true;
  $("#customerView").classList.add("hidden");
  $("#adminView").classList.remove("hidden");
  showAdminSection("inventory");

  // Refresh products from server
  const prodRes = await api("/products");
  state.products = prodRes.data;
  renderInventoryTable();
}

function switchToCustomer() {
  state.isAdminView = false;
  $("#adminView").classList.add("hidden");
  $("#customerView").classList.remove("hidden");
  clearInterval(statusPollInterval);

  // Refresh products for customer view
  api("/products").then(res => {
    state.products = res.data;
    renderProductGrid();
  });
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
   ADMIN — INVENTORY MANAGEMENT (API-powered)
═══════════════════════════════════════════════════════ */

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

function showProductForm(productId = null) {
  state.editingProductId = productId;
  const form    = $("#productForm");
  const title   = $("#formTitle");
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

/** Save/update product via API */
async function saveProduct() {
  const name     = $("#pName").value.trim();
  const price    = parseFloat($("#pPrice").value);
  const category = $("#pCategory").value;
  const emoji    = $("#pEmoji").value.trim() || "📦";

  if (!name)          { toast("❌ Product name is required."); return; }
  if (isNaN(price) || price < 0) { toast("❌ Enter a valid price."); return; }

  try {
    if (state.editingProductId) {
      // Update existing
      await api(`/products/${state.editingProductId}`, {
        method: "PUT",
        body: { name, price, category, emoji },
      });
      toast("✅ Product updated.");
    } else {
      // Add new
      await api("/products", {
        method: "POST",
        body: { name, price, category, emoji },
      });
      toast("✅ Product added.");
    }

    // Refresh products
    const prodRes = await api("/products");
    state.products = prodRes.data;

    hideProductForm();
    renderInventoryTable();
    renderProductGrid();
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/** Toggle stock via API */
async function toggleStock(productId) {
  try {
    const res = await api(`/products/${productId}/stock`, { method: "PATCH" });
    toast(res.data.inStock ? "✅ Marked as In Stock." : "📦 Marked as Out of Stock.");

    // Refresh
    const prodRes = await api("/products");
    state.products = prodRes.data;
    renderInventoryTable();
    renderProductGrid();
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/** Delete product via API */
async function deleteProduct(productId) {
  if (!confirm("Delete this product? This cannot be undone.")) return;

  try {
    await api(`/products/${productId}`, { method: "DELETE" });
    toast("🗑 Product deleted.");

    // Refresh products & cart
    const prodRes = await api("/products");
    state.products = prodRes.data;

    const cartRes = await api("/cart");
    state.cart = cartRes.data;

    renderInventoryTable();
    renderProductGrid();
    renderCart();
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════
   ADMIN — ORDER MANAGEMENT (API-powered)
═══════════════════════════════════════════════════════ */

async function renderAdminOrders() {
  try {
    const res = await api("/orders");
    state.orders = res.data;
  } catch (err) {
    toast("⚠ Failed to load orders");
    return;
  }

  const container = $("#adminOrdersList");
  const countEl   = $("#orderCount");
  countEl.textContent = `${state.orders.length} order${state.orders.length !== 1 ? "s" : ""}`;

  if (state.orders.length === 0) {
    container.innerHTML = `<p class="no-orders-msg">No orders yet. Customers haven't checked out.</p>`;
    return;
  }

  container.innerHTML = state.orders.map(order => `
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

/** Update order status via API */
async function updateOrderStatus(orderId, newStatus) {
  try {
    await api(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: { status: newStatus },
    });
    toast(`📦 Order ${orderId} → ${newStatus}`);
  } catch (err) {
    toast(`❌ ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════
   ADMIN — ANALYTICS (API-powered)
═══════════════════════════════════════════════════════ */

async function renderAnalytics() {
  try {
    const res = await api("/analytics");
    const data = res.data;

    // Summary cards
    $("#totalRevenue").textContent  = `₹${fmtNum(data.totalRevenue)}`;
    $("#totalOrders").textContent   = data.totalOrders;
    $("#totalProducts").textContent = data.totalProducts;

    // Top Products chart
    const topCanvas = $("#topProductsChart");
    const noTop     = $("#noTopProducts");

    if (data.topProducts.length === 0) {
      topCanvas.classList.add("hidden");
      noTop.classList.remove("hidden");
    } else {
      topCanvas.classList.remove("hidden");
      noTop.classList.add("hidden");
      drawBarChart(
        topCanvas,
        data.topProducts.map(p => truncStr(p.name, 12)),
        data.topProducts.map(p => p.qty),
        "Units Sold",
        "#f5a623"
      );
    }

    // Category Sales chart
    const catCanvas = $("#categoryChart");
    const noCat     = $("#noCategoryData");

    if (data.categorySales.length === 0) {
      catCanvas.classList.add("hidden");
      noCat.classList.remove("hidden");
    } else {
      catCanvas.classList.remove("hidden");
      noCat.classList.add("hidden");
      drawBarChart(
        catCanvas,
        data.categorySales.map(c => c.category),
        data.categorySales.map(c => c.revenue),
        "Revenue (₹)",
        "#5b9cf6"
      );
    }
  } catch (err) {
    toast("⚠ Failed to load analytics");
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

  // Grid lines
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

  // Y-axis label
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

    // Value label
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
  $("#categoryTabs").addEventListener("click", async (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    $$(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    state.activeCategory = tab.dataset.cat;

    // Fetch filtered products from API
    try {
      const res = await api(`/products?category=${encodeURIComponent(state.activeCategory)}`);
      // Keep full list but filter for display
      if (state.activeCategory === "All") {
        state.products = res.data;
      }
    } catch (err) { /* use cached */ }

    renderProductGrid();
  });

  // Add to cart
  $("#productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    addToCart(btn.dataset.id);
  });

  // Cart item controls
  $("#cartItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    const rem = e.target.closest(".remove-btn");

    if (btn) {
      const id = btn.dataset.id;
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

  // New Order
  $("#newOrderBtn").addEventListener("click", returnToShop);

  // Cart toggle (mobile)
  $("#cartToggleBtn").addEventListener("click", () => {
    $("#cartPanel").classList.toggle("open");
  });
  $("#cartCloseBtn").addEventListener("click", () => {
    $("#cartPanel").classList.remove("open");
  });

  // PIN modal
  $("#adminPanelBtn").addEventListener("click", openPinModal);
  $("#pinCancelBtn").addEventListener("click", closePinModal);
  $("#pinSubmitBtn").addEventListener("click", submitPin);
  $("#pinInput").addEventListener("keydown", (e) => { if (e.key === "Enter") submitPin(); });

  $("#pinModal").addEventListener("click", (e) => {
    if (e.target === $("#pinModal")) closePinModal();
  });
}

/* ═══════════════════════════════════════════════════════
   EVENT BINDINGS — ADMIN VIEW
═══════════════════════════════════════════════════════ */
function bindAdminEvents() {

  $("#logoutBtn").addEventListener("click", switchToCustomer);

  $("#adminTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".atab");
    if (!tab) return;
    showAdminSection(tab.dataset.section);
  });

  $("#addProductBtn").addEventListener("click", () => showProductForm());
  $("#saveProductBtn").addEventListener("click", saveProduct);
  $("#cancelProductBtn").addEventListener("click", hideProductForm);

  // Inventory table actions
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

/** Escape HTML */
function escHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/** Truncate string */
function truncStr(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen - 1) + "…" : str;
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", bootstrap);
