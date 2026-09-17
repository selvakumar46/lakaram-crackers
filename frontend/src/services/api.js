import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/defaultProducts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Track backend reachability in memory to avoid generating red 503 errors in console
let backendOnline = null; // null: unknown, true: online, false: offline

const getStoredCustomProducts = () => {
  try {
    const saved = localStorage.getItem('sparklefest_custom_products');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCustomProducts = (list) => {
  try {
    localStorage.setItem('sparklefest_custom_products', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
};

// Permanent deleted products list so deleted items never re-appear
const getDeletedProductIds = () => {
  try {
    const saved = localStorage.getItem('lakaram_deleted_products');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveDeletedProductId = (id) => {
  try {
    const list = getDeletedProductIds();
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem('lakaram_deleted_products', JSON.stringify(list));
    }
  } catch (e) {
    console.error(e);
  }
};

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      backendOnline = false;
      return false;
    }
    const data = await res.json();
    backendOnline = (data.status === 'UP');
    return backendOnline;
  } catch (e) {
    backendOnline = false;
    return false;
  }
};

export const fetchProducts = async (category = null, search = null) => {
  const deletedIds = getDeletedProductIds();

  // Helper for filtering local products
  const getLocalProducts = () => {
    const custom = getStoredCustomProducts().filter(p => !deletedIds.includes(p.id));
    let all = [...custom, ...DEFAULT_PRODUCTS.filter(dp => !custom.some(c => c.id === dp.id) && !deletedIds.includes(dp.id))];

    if (category && category !== 'all') {
      all = all.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      all = all.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return { data: all, source: 'local' };
  };

  // If backend is already detected offline, serve from local cache without spamming 503 requests
  if (backendOnline === false) {
    return getLocalProducts();
  }

  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      backendOnline = false;
      return getLocalProducts();
    }
    const data = await res.json();
    backendOnline = true;
    return { data: data.filter(p => !deletedIds.includes(p.id)), source: 'backend' };
  } catch (err) {
    backendOnline = false;
    return getLocalProducts();
  }
};

export const fetchCategories = async () => {
  if (backendOnline === false) {
    return { data: CATEGORIES, source: 'local' };
  }

  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      backendOnline = false;
      return { data: CATEGORIES, source: 'local' };
    }
    const data = await res.json();
    backendOnline = true;
    return { data, source: 'backend' };
  } catch (err) {
    backendOnline = false;
    return { data: CATEGORIES, source: 'local' };
  }
};

export const createProduct = async (productData) => {
  // Always persist to local custom products list for standalone resilience
  const custom = getStoredCustomProducts();
  const updatedList = [productData, ...custom.filter(p => p.id !== productData.id)];
  saveCustomProducts(updatedList);

  // Unmark if previously deleted
  const deleted = getDeletedProductIds().filter(delId => delId !== productData.id);
  localStorage.setItem('lakaram_deleted_products', JSON.stringify(deleted));

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log(`[Database] Created product ${data.id} in Neon PostgreSQL`);
    return data;
  } catch (err) {
    console.warn('[Database] Saved to local storage, sync deferred:', err.message);
    return productData;
  }
};

export const updateProduct = async (id, productData) => {
  const custom = getStoredCustomProducts();
  const idx = custom.findIndex(p => p.id === id);
  if (idx >= 0) {
    custom[idx] = productData;
  } else {
    custom.push(productData);
  }
  saveCustomProducts(custom);

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log(`[Database] Updated product ${id} in Neon PostgreSQL`);
    return data;
  } catch (err) {
    console.warn('[Database] Updated locally, sync deferred:', err.message);
    return productData;
  }
};

export const deleteProduct = async (id) => {
  // 1. Permanently remember deleted product in local storage
  saveDeletedProductId(id);
  const custom = getStoredCustomProducts().filter(p => p.id !== id);
  saveCustomProducts(custom);

  // 2. Delete directly from Neon PostgreSQL database
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      console.log(`[Database] Deleted product ${id} from Neon PostgreSQL`);
    }
    return res.ok;
  } catch (err) {
    console.warn('[Database] Deleted locally, sync deferred:', err.message);
    return true;
  }
};

export const fetchOrders = async () => {
  if (backendOnline === false) {
    try {
      const saved = localStorage.getItem('sparklefest_orders_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) {
      backendOnline = false;
      const saved = localStorage.getItem('sparklefest_orders_history');
      return saved ? JSON.parse(saved) : [];
    }
    const data = await res.json();
    backendOnline = true;
    return data;
  } catch (err) {
    backendOnline = false;
    try {
      const saved = localStorage.getItem('sparklefest_orders_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
};

export const submitOrder = async (orderPayload) => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const orderRes = await res.json();
    saveOrderLocally(orderRes);
    return orderRes;
  } catch (err) {
    console.info('Backend order endpoint unreachable, creating client-side order confirmation:', err.message);
    const orderId = 'CRK-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = orderPayload.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const actualValue = subtotal * 4;
    const festiveDiscount = actualValue - subtotal;
    const packingAndForwarding = subtotal > 3000 ? 0 : 150;
    const grandTotal = subtotal + packingAndForwarding;
    const totalItemCount = orderPayload.items.reduce((acc, item) => acc + item.quantity, 0);

    const storeNumber = '919442188990';
    let msg = `🎇 *LAKARAM CRACKERS - NEW ORDER* 🎇\n`;
    msg += `🌐 www.lakaramcreckers.com\n`;
    msg += `--------------------------------------\n`;
    msg += `🆔 *Order ID:* ${orderId}\n`;
    msg += `👤 *Customer:* ${orderPayload.customerName}\n`;
    msg += `📞 *Phone:* ${orderPayload.phone}\n`;
    msg += `📍 *Address:* ${orderPayload.address}, ${orderPayload.city}, ${orderPayload.state} - ${orderPayload.pincode}\n`;
    msg += `💳 *Payment:* ${orderPayload.paymentMethod}\n`;
    msg += `--------------------------------------\n`;
    msg += `📦 *ITEMS ORDERED:*\n`;
    orderPayload.items.forEach(item => {
      msg += `• ${item.productName} (${item.packSize}) x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    msg += `--------------------------------------\n`;
    msg += `💰 *Subtotal:* ₹${subtotal.toFixed(2)}\n`;
    msg += `🎉 *Festive Savings (75% Off):* ₹${festiveDiscount.toFixed(2)}\n`;
    msg += `🚚 *Packing & Transport:* ₹${packingAndForwarding.toFixed(2)}\n`;
    msg += `⭐️ *TOTAL PAYABLE:* ₹${grandTotal.toFixed(2)}\n`;
    msg += `--------------------------------------\n`;
    msg += `Please confirm my order and share bank/UPI payment details! 🙏`;

    const whatsappShareUrl = `https://wa.me/${storeNumber}?text=${encodeURIComponent(msg)}`;

    const orderRes = {
      orderId,
      status: 'CONFIRMED',
      orderDate: new Date().toISOString(),
      customerName: orderPayload.customerName,
      phone: orderPayload.phone,
      deliveryAddress: `${orderPayload.address}, ${orderPayload.city}, ${orderPayload.state}`,
      pincode: orderPayload.pincode,
      paymentMethod: orderPayload.paymentMethod,
      items: orderPayload.items,
      totalItemCount,
      actualValue,
      festiveDiscount,
      subtotal,
      packingAndForwarding,
      grandTotal,
      estimatedDelivery: '3 to 5 business days via Sivakasi Transport Hub',
      whatsappShareUrl
    };

    saveOrderLocally(orderRes);
    return orderRes;
  }
};

function saveOrderLocally(order) {
  try {
    const list = JSON.parse(localStorage.getItem('sparklefest_orders_history') || '[]');
    list.unshift(order);
    localStorage.setItem('sparklefest_orders_history', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error(e);
  }
}
