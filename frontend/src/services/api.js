import { DEFAULT_PRODUCTS, CATEGORIES } from '../data/defaultProducts';

const API_BASE = '/api';

export const fetchProducts = async (category = null, search = null) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, source: 'backend' };
  } catch (err) {
    console.info('Backend unreachable, using local product catalog:', err.message);
    let filtered = [...DEFAULT_PRODUCTS];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return { data: filtered, source: 'local' };
  }
};

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, source: 'backend' };
  } catch (err) {
    return { data: CATEGORIES, source: 'local' };
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

export const submitOrder = async (orderPayload) => {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.info('Backend order endpoint unreachable, creating client-side order confirmation:', err.message);
    // Create client-side response with formatted WhatsApp URL
    const orderId = 'CRK-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = orderPayload.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const actualValue = subtotal * 4; // approx 75% festive discount
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

    return {
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
  }
};
