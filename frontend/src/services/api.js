import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/defaultProducts';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'UP';
  } catch (e) {
    return false;
  }
};

export const fetchProducts = async (category = null, search = null) => {
  // Helper for filtering local fallback products if offline
  const getLocalProducts = () => {
    const custom = getStoredCustomProducts();
    let all = [...custom, ...DEFAULT_PRODUCTS.filter(dp => !custom.some(c => c.id === dp.id))];

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

  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());

    const url = `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      console.warn(`[API] Products endpoint returned ${res.status}, using local fallback`);
      return getLocalProducts();
    }
    const data = await res.json();
    return { data, source: 'backend' };
  } catch (err) {
    console.warn('[API] Could not fetch live products from DB, using local fallback:', err.message);
    return getLocalProducts();
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { data, source: 'backend' };
  } catch (err) {
    console.warn('[API] Could not fetch categories from DB:', err.message);
    return { data: CATEGORIES, source: 'local' };
  }
};

export const createProduct = async (productData) => {
  // Save locally for offline resiliency
  const custom = getStoredCustomProducts();
  const updatedList = [productData, ...custom.filter(p => p.id !== productData.id)];
  saveCustomProducts(updatedList);

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
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
  // Remove from local custom products cache
  const custom = getStoredCustomProducts().filter(p => p.id !== id);
  saveCustomProducts(custom);

  // Delete directly from Neon PostgreSQL database
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      console.log(`[Database] Deleted product ${id} from Neon PostgreSQL`);
      return true;
    } else {
      console.warn(`[Database] Delete returned HTTP ${res.status}`);
      return false;
    }
  } catch (err) {
    console.warn('[Database] Deleted locally, sync deferred:', err.message);
    return false;
  }
};

export const fetchOrders = async () => {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
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
    const actualValue = subtotal * 5;
    const festiveDiscount = actualValue - subtotal;
    const packingAndForwarding = 0;
    const grandTotal = subtotal;
    const totalItemCount = orderPayload.items.reduce((acc, item) => acc + item.quantity, 0);

    const storeNumber = '918973015070';
    let msg = `🎇 *LAKARAM CRACKERS - NEW ORDER* 🎇\n`;
    msg += `🌐 lakaram-crackers.onrender.com\n`;
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
    msg += `🎉 *Festive Savings (80% Off):* ₹${festiveDiscount.toFixed(2)}\n`;
    msg += `⭐️ *TOTAL PAYABLE:* ₹${grandTotal.toFixed(2)}\n`;
    msg += `--------------------------------------\n`;
    msg += `Please confirm my order and share bank/UPI payment details! 🙏`;

    const whatsappShareUrl = `https://wa.me/${storeNumber}?text=${encodeURIComponent(msg)}`;

    const orderRes = {
      orderId,
      status: 'PENDING',
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

export const updateOrderStatus = async (orderId, status) => {
  const cleanStatus = status.trim().toUpperCase();

  // 1. Update local storage for instant UI responsiveness & offline resiliency
  try {
    const list = JSON.parse(localStorage.getItem('sparklefest_orders_history') || '[]');
    const idx = list.findIndex(o => o.orderId === orderId);
    if (idx >= 0) {
      list[idx].status = cleanStatus;
      localStorage.setItem('sparklefest_orders_history', JSON.stringify(list));
    }
  } catch (e) {
    console.error(e);
  }

  // 2. Call live API endpoint (Neon PostgreSQL or Spring Boot)
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: cleanStatus })
    });
    if (!res.ok) {
      // Try PUT fallback if PATCH not accepted
      const putRes = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: cleanStatus })
      });
      if (!putRes.ok) throw new Error(`HTTP ${putRes.status}`);
      return await putRes.json();
    }
    return await res.json();
  } catch (err) {
    console.warn('[API] Saved status update locally, backend sync deferred:', err.message);
    return { orderId, status: cleanStatus };
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
