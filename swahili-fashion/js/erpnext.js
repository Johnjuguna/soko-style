/**
 * SOKO STYLE – ERPNext / Frappe Integration
 * ==============================================================
 * Connects to ERPNext REST API for:
 *   - Product catalog (Items)
 *   - Stock availability
 *   - Sales Orders
 *   - Customer creation
 *   - M-Pesa payment request
 *
 * Config: Update ERPNEXT_CONFIG below with your instance details
 * Docs:   https://docs.erpnext.com/docs/user/manual/en/api
 * ==============================================================
 */

const ERPNEXT_CONFIG = {
  baseUrl:     'https://YOUR-SITE.erpnext.com',  // ← Your ERPNext URL
  apiKey:      'YOUR_API_KEY',                    // ← Settings > API Access
  apiSecret:   'YOUR_API_SECRET',                 // ← Settings > API Access
  priceList:   'Standard Selling',
  currency:    'KES',
  warehouse:   'Finished Goods - SS',
  company:     'Soko Style Ltd',
};

// ── Auth headers ──────────────────────────────────────────────
function erpHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `token ${ERPNEXT_CONFIG.apiKey}:${ERPNEXT_CONFIG.apiSecret}`,
  };
}

// ── Generic fetch wrapper ─────────────────────────────────────
async function erpFetch(endpoint, options = {}) {
  const url = `${ERPNEXT_CONFIG.baseUrl}/api${endpoint}`;
  try {
    const res = await fetch(url, { headers: erpHeaders(), ...options });
    if (!res.ok) throw new Error(`ERPNext ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error('[ERPNext]', err);
    return null;
  }
}

// ── PRODUCTS ──────────────────────────────────────────────────

/**
 * Fetch all clothing items from ERPNext.
 * Returns array: [{ name, item_name, description, item_group, image, standard_rate }]
 */
async function erpGetProducts(filters = {}) {
  const fields = encodeURIComponent(JSON.stringify([
    'name','item_name','description','item_group','image',
    'standard_rate','has_variants','disabled'
  ]));
  const f = encodeURIComponent(JSON.stringify([
    ['disabled','=',0],
    ['is_sales_item','=',1],
    ...Object.entries(filters).map(([k,v]) => [k,'=',v])
  ]));
  const data = await erpFetch(`/resource/Item?fields=${fields}&filters=${f}&limit_page_length=100`);
  return data?.data || [];
}

/**
 * Get item price from ERPNext Price List.
 */
async function erpGetPrice(itemCode) {
  const data = await erpFetch(
    `/resource/Item Price?filters=[["item_code","=","${itemCode}"],["price_list","=","${ERPNEXT_CONFIG.priceList}"]]&fields=["price_list_rate"]`
  );
  return data?.data?.[0]?.price_list_rate || 0;
}

/**
 * Get stock availability.
 */
async function erpGetStock(itemCode) {
  const data = await erpFetch(
    `/resource/Bin?filters=[["item_code","=","${itemCode}"],["warehouse","=","${ERPNEXT_CONFIG.warehouse}"]]&fields=["actual_qty"]`
  );
  return data?.data?.[0]?.actual_qty || 0;
}

// ── CUSTOMER ──────────────────────────────────────────────────

/**
 * Create or get customer in ERPNext.
 */
async function erpCreateCustomer({ name, phone, email }) {
  // Check if exists
  const existing = await erpFetch(
    `/resource/Customer?filters=[["mobile_no","=","${phone}"]]&fields=["name"]`
  );
  if (existing?.data?.length) return existing.data[0].name;

  // Create new
  const res = await erpFetch('/resource/Customer', {
    method: 'POST',
    body: JSON.stringify({
      customer_name: name,
      customer_type: 'Individual',
      mobile_no: phone,
      email_id: email,
      customer_group: 'Individual',
      territory: 'Kenya',
    }),
  });
  return res?.data?.name;
}

// ── SALES ORDER ───────────────────────────────────────────────

/**
 * Create a Sales Order in ERPNext.
 * @param {string} customerName - ERPNext customer docname
 * @param {Array}  items        - [{ item_code, qty, rate, size }]
 * @param {Object} delivery     - { address, city, phone }
 */
async function erpCreateSalesOrder(customerName, items, delivery = {}) {
  const orderItems = items.map(i => ({
    item_code: i.item_code,
    qty: i.qty,
    rate: i.rate,
    uom: 'Nos',
    description: i.size ? `Size: ${i.size}` : '',
  }));

  const res = await erpFetch('/resource/Sales Order', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerName,
      company: ERPNEXT_CONFIG.company,
      currency: ERPNEXT_CONFIG.currency,
      selling_price_list: ERPNEXT_CONFIG.priceList,
      transaction_date: new Date().toISOString().split('T')[0],
      delivery_date: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
      items: orderItems,
      customer_address: delivery.address || '',
      additional_notes: `Delivery to ${delivery.city || 'Nairobi'} | Phone: ${delivery.phone || ''}`,
    }),
  });
  return res?.data;
}

// ── MPESA PAYMENT REQUEST ─────────────────────────────────────

/**
 * Initiate M-Pesa STK Push via ERPNext.
 * Requires M-Pesa integration app installed on Frappe.
 * https://github.com/navariltd/navari-mpesa-b2c
 */
async function erpMpesaPayment({ phone, amount, reference }) {
  const res = await erpFetch('/method/sokostyle.api.mpesa.stk_push', {
    method: 'POST',
    body: JSON.stringify({ phone, amount, reference }),
  });
  return res;
}

// ── FRONTEND INTEGRATION ──────────────────────────────────────

/**
 * Load products from ERPNext and populate the product grids.
 * Falls back to demo products if ERPNext is unavailable.
 */
async function loadProductsFromERP() {
  if (!ERPNEXT_CONFIG.apiKey || ERPNEXT_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.info('[ERPNext] Using demo products (API not configured)');
    return false; // app.js will use demo data
  }

  try {
    const items = await erpGetProducts();
    if (!items.length) return false;

    // Map ERPNext items to app format
    window.PRODUCTS_FROM_ERP = items.map(item => ({
      id: item.name,
      name: item.item_name,
      category: item.item_group?.toLowerCase().replace(' ', '') || 'women',
      price: item.standard_rate || 0,
      image: item.image
        ? `${ERPNEXT_CONFIG.baseUrl}${item.image}`
        : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      description: item.description || '',
      isNew: true,
      isSale: false,
    }));

    console.log('[ERPNext] Loaded', window.PRODUCTS_FROM_ERP.length, 'products');
    return true;
  } catch (err) {
    console.warn('[ERPNext] Could not load products, using demo data', err);
    return false;
  }
}

/**
 * Submit an order from the cart to ERPNext.
 */
async function submitOrderToERP(cartItems, customerInfo) {
  const custName = await erpCreateCustomer(customerInfo);
  if (!custName) throw new Error('Could not create customer');

  const items = cartItems.map(i => ({
    item_code: i.id,
    qty: i.qty,
    rate: i.price,
    size: i.size,
  }));

  const order = await erpCreateSalesOrder(custName, items, {
    city: customerInfo.city,
    phone: customerInfo.phone,
  });

  return order;
}

// Expose globally
window.ERP = {
  getProducts: erpGetProducts,
  getPrice: erpGetPrice,
  getStock: erpGetStock,
  createCustomer: erpCreateCustomer,
  createSalesOrder: erpCreateSalesOrder,
  mpesaPayment: erpMpesaPayment,
  loadProducts: loadProductsFromERP,
  submitOrder: submitOrderToERP,
};

console.log('[ERPNext] Integration module loaded. Configure ERPNEXT_CONFIG to connect.');
