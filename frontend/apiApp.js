import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import { DEFAULT_PRODUCTS, CATEGORIES } from './src/data/defaultProducts.js';

const { Pool } = pkg;

const apiApp = express();

// Enable CORS and reasonable limit for API payloads (accommodates 5MB image uploads)
apiApp.use(cors());
apiApp.use(express.json({ limit: '10mb' }));

// In-Memory Fallback Cache (Ensures store never returns 500 even if Neon DB exceeds quota)
let inMemoryProductsCache = [...DEFAULT_PRODUCTS];
let inMemoryCategoriesCache = [...CATEGORIES];

// CockroachDB Serverless PostgreSQL Database Connection
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.SPRING_DATASOURCE_URL || 
  'postgresql://lakaram:4sOukdWZ2e1jX7aUUeCyNg@lakaram-crackers-34301.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false }
});

// Prevent unhandled error crashes when CockroachDB Serverless drops idle connections
pool.on('error', (err) => {
  console.error('[CockroachDB Pool Warning (Auto-reconnected)]:', err.message);
});

// Helper: map DB snake_case row to frontend camelCase object
const mapProductRow = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  description: row.description || '',
  packSize: row.pack_size || '',
  originalPrice: parseFloat(row.original_price) || 0,
  discountedPrice: parseFloat(row.discounted_price) || 0,
  discountPercent: parseInt(row.discount_percent) || 80,
  soundLevel: row.sound_level || 'Low',
  kidSafe: Boolean(row.kid_safe),
  greenCrackerCertified: Boolean(row.green_cracker_certified),
  image: row.image || '',
  stock: parseInt(row.stock) || 0,
  rating: parseInt(row.rating) || 5,
  videoDemo: row.video_demo || ''
});

// ==========================================
// 1. HEALTH CHECK ENDPOINT
// ==========================================
apiApp.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT count(*) FROM products');
    const count = parseInt(result.rows[0].count) || 0;
    res.json({
      status: 'UP',
      database: 'CockroachDB Serverless PostgreSQL (Connected)',
      service: 'Lakaram Crackers API (lakaram-crackers.onrender.com)',
      version: '1.0.0',
      productsCount: count
    });
  } catch (err) {
    console.warn('[CockroachDB Health Warning - Using In-Memory Fallback]:', err.message);
    res.json({
      status: 'UP',
      database: `Degraded (CockroachDB: ${err.message})`,
      service: 'Lakaram Crackers API (lakaram-crackers.onrender.com)',
      version: '1.0.0',
      productsCount: inMemoryProductsCache.length
    });
  }
});

// ==========================================
// 2. CATEGORIES ENDPOINT (Live database counts with graceful fallback)
// ==========================================
const BASE_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: 'Sparkles' },
  { id: 'sparklers', name: 'Sparklers', icon: 'Sparkles', description: 'Classic festive hand sparklers with vivid colors' },
  { id: 'chakkars', name: 'Ground Chakkars', icon: 'RotateCw', description: 'High-speed spinning ground wheels' },
  { id: 'flower-pots', name: 'Flower Pots', icon: 'Flame', description: 'Vibrant conical fountains throwing glittering sprays' },
  { id: 'rockets', name: 'Rockets & Missiles', icon: 'Rocket', description: 'Sky-bound whistle rockets with colorful burst' },
  { id: 'aerial-shots', name: 'Multi Sky Shots', icon: 'Sun', description: 'Spectacular multi-burst night sky repeaters' },
  { id: 'sound-crackers', name: 'Sound Crackers & Bijili', icon: 'Zap', description: 'Traditional rhythmic sound strips & garlands' },
  { id: 'atom-bombs', name: 'Atom Bombs', icon: 'Bomb', description: 'Heavy concussion bass crackers' },
  { id: 'gift-boxes', name: 'Gift Boxes & Combos', icon: 'Package', description: 'Curated festive family hampers' },
  { id: 'kids-special', name: 'Kids Safe Crackers', icon: 'Smile', description: 'Safe, low-smoke, pop-pops & novelties' },
  { id: 'garlands', name: 'Garlands & Walas', icon: 'Zap', description: 'Traditional multi-shot crackers and garlands' }
];

apiApp.get('/api/categories', async (req, res) => {
  try {
    const countRes = await pool.query('SELECT category, COUNT(*)::int AS count FROM products GROUP BY category');
    const countMap = {};
    countRes.rows.forEach(r => {
      countMap[r.category] = r.count;
    });

    const totalRes = await pool.query('SELECT COUNT(*)::int AS total FROM products');
    const totalCount = totalRes.rows[0]?.total || 0;

    const result = BASE_CATEGORIES.map(cat => ({
      ...cat,
      itemCount: cat.id === 'all' ? totalCount : (countMap[cat.id] || 0)
    }));

    // Include any custom categories in DB not in BASE_CATEGORIES
    countRes.rows.forEach(r => {
      if (!result.some(c => c.id === r.category)) {
        result.push({
          id: r.category,
          name: r.category.charAt(0).toUpperCase() + r.category.slice(1).replace('-', ' '),
          icon: 'Sparkles',
          itemCount: r.count
        });
      }
    });

    inMemoryCategoriesCache = result;
    res.json(result);
  } catch (err) {
    console.warn('[Neon DB Quota/Error in /api/categories - Using In-Memory Fallback]:', err.message);
    res.json(inMemoryCategoriesCache);
  }
});

// ==========================================
// 3. PRODUCTS ENDPOINTS (With Pagination and Fallback Resilience)
// ==========================================

// GET all products (with optional search, category filter, and page/limit pagination)
apiApp.get('/api/products', async (req, res) => {
  const { category, search, page, limit } = req.query;
  let productsList = [];

  try {
    let query = 'SELECT * FROM products';
    const params = [];

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` WHERE (LOWER(name) LIKE $${params.length} OR LOWER(category) LIKE $${params.length} OR LOWER(description) LIKE $${params.length} OR LOWER(id) LIKE $${params.length})`;
    } else if (category && category !== 'all') {
      params.push(category);
      query += ` WHERE category = $${params.length}`;
    }

    query += ' ORDER BY id ASC';
    const result = await pool.query(query, params);
    productsList = result.rows.map(mapProductRow);
    if (productsList.length > 0 && !search && (!category || category === 'all')) {
      inMemoryProductsCache = productsList;
    }
  } catch (err) {
    console.warn('[Neon DB Quota/Error in /api/products - Using In-Memory Fallback]:', err.message);
    let fallback = [...inMemoryProductsCache];
    if (category && category !== 'all') {
      fallback = fallback.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      fallback = fallback.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
      );
    }
    productsList = fallback;
  }

  // Handle optional page/limit pagination (e.g., 30 per page)
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (pageNum > 0 && limitNum > 0) {
    const totalCount = productsList.length;
    const totalPages = Math.ceil(totalCount / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const pageSlice = productsList.slice(startIndex, startIndex + limitNum);

    res.setHeader('X-Total-Count', totalCount.toString());
    res.setHeader('X-Total-Pages', totalPages.toString());
    res.setHeader('X-Current-Page', pageNum.toString());
    return res.json(pageSlice);
  }

  res.json(productsList);
});

// GET single product by ID
apiApp.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      const foundInCache = inMemoryProductsCache.find(p => p.id === req.params.id);
      if (foundInCache) return res.json(foundInCache);
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(mapProductRow(result.rows[0]));
  } catch (err) {
    console.warn('[Neon DB Quota/Error in /api/products/:id - Using In-Memory Fallback]:', err.message);
    const foundInCache = inMemoryProductsCache.find(p => p.id === req.params.id);
    if (foundInCache) {
      return res.json(foundInCache);
    }
    res.status(404).json({ error: 'Product not found' });
  }
});

// POST create new product directly into CockroachDB PostgreSQL
apiApp.post('/api/products', async (req, res) => {
  try {
    const p = req.body;

    // Strict image size restriction on server (Max 200 KB)
    if (p.image && p.image.length > 250 * 1024) {
      return res.status(400).json({ error: 'Image payload is too large. Images must be under 200 KB.' });
    }

    const id = p.id || `LKM-${Math.floor(100 + Math.random() * 900)}`;
    const originalPrice = parseFloat(p.originalPrice) || 0;
    const discountPercent = parseInt(p.discountPercent) || 80;
    const discountedPrice = p.discountedPrice !== undefined 
      ? parseFloat(p.discountedPrice) 
      : Math.round(originalPrice * (100 - discountPercent) / 100);

    const query = `
      INSERT INTO products (
        id, name, category, description, pack_size,
        original_price, discounted_price, discount_percent,
        sound_level, kid_safe, green_cracker_certified,
        image, stock, rating, video_demo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        pack_size = EXCLUDED.pack_size,
        original_price = EXCLUDED.original_price,
        discounted_price = EXCLUDED.discounted_price,
        discount_percent = EXCLUDED.discount_percent,
        sound_level = EXCLUDED.sound_level,
        kid_safe = EXCLUDED.kid_safe,
        green_cracker_certified = EXCLUDED.green_cracker_certified,
        image = EXCLUDED.image,
        stock = EXCLUDED.stock,
        rating = EXCLUDED.rating,
        video_demo = EXCLUDED.video_demo
      RETURNING *
    `;

    const values = [
      id,
      p.name || 'Sivakasi Cracker',
      p.category || 'sparklers',
      p.description || '',
      p.packSize || '1 Box',
      originalPrice,
      discountedPrice,
      discountPercent,
      p.soundLevel || 'Low',
      Boolean(p.kidSafe),
      p.greenCrackerCertified !== false,
      p.image || '',
      parseInt(p.stock) || 0,
      parseInt(p.rating) || 5,
      p.videoDemo || ''
    ];

    const result = await pool.query(query, values);
    console.log(`[CockroachDB] Inserted/Updated product: ${id} (${p.name})`);
    res.status(201).json(mapProductRow(result.rows[0]));
  } catch (err) {
    console.error('Error in POST /api/products:', err);
    res.status(500).json({ error: 'Failed to save product in database', details: err.message });
  }
});

// PUT update product in CockroachDB PostgreSQL
apiApp.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;

    // Strict image size restriction on server (Max 200 KB)
    if (p.image && p.image.length > 250 * 1024) {
      return res.status(400).json({ error: 'Image payload is too large. Images must be under 200 KB.' });
    }

    const originalPrice = parseFloat(p.originalPrice) || 0;
    const discountPercent = parseInt(p.discountPercent) || 80;
    const discountedPrice = p.discountedPrice !== undefined 
      ? parseFloat(p.discountedPrice) 
      : Math.round(originalPrice * (100 - discountPercent) / 100);

    const query = `
      UPDATE products SET
        name = $2,
        category = $3,
        description = $4,
        pack_size = $5,
        original_price = $6,
        discounted_price = $7,
        discount_percent = $8,
        sound_level = $9,
        kid_safe = $10,
        green_cracker_certified = $11,
        image = $12,
        stock = $13,
        rating = $14,
        video_demo = $15
      WHERE id = $1
      RETURNING *
    `;

    const values = [
      id,
      p.name,
      p.category,
      p.description || '',
      p.packSize || '1 Box',
      originalPrice,
      discountedPrice,
      discountPercent,
      p.soundLevel || 'Low',
      Boolean(p.kidSafe),
      p.greenCrackerCertified !== false,
      p.image || '',
      parseInt(p.stock) || 0,
      parseInt(p.rating) || 5,
      p.videoDemo || ''
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`[Neon DB] Updated product: ${id}`);
    res.json(mapProductRow(result.rows[0]));
  } catch (err) {
    console.error('Error in PUT /api/products/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE product directly from Neon PostgreSQL
apiApp.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    console.log(`[Neon DB] Deleted product ${id} - Affected rows: ${result.rowCount}`);
    res.json({ message: 'Product deleted from Neon database', success: true, id });
  } catch (err) {
    console.error('Error in DELETE /api/products/:id:', err);
    res.status(500).json({ error: 'Failed to delete product from database', details: err.message });
  }
});

// ==========================================
// 4. ORDERS ENDPOINTS (GET, POST)
// ==========================================

// GET all customer orders from Neon PostgreSQL
apiApp.get('/api/orders', async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT * FROM customer_orders ORDER BY order_date DESC');
    const orders = ordersResult.rows;

    // Fetch items for all orders
    const itemsResult = await pool.query('SELECT * FROM order_items');
    const itemsMap = {};
    for (const item of itemsResult.rows) {
      if (!itemsMap[item.order_id]) itemsMap[item.order_id] = [];
      itemsMap[item.order_id].push({
        productId: item.product_id,
        productName: item.product_name,
        category: item.category,
        packSize: item.pack_size,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        subtotal: parseFloat(item.subtotal)
      });
    }

    const response = orders.map(ord => ({
      orderId: ord.order_id,
      customerName: ord.customer_name,
      phone: ord.phone,
      deliveryAddress: ord.delivery_address,
      pincode: ord.pincode,
      paymentMethod: ord.payment_method,
      totalItemCount: parseInt(ord.total_item_count) || 0,
      actualValue: parseFloat(ord.actual_value) || 0,
      festiveDiscount: parseFloat(ord.festive_discount) || 0,
      subtotal: parseFloat(ord.subtotal) || 0,
      packingAndForwarding: parseFloat(ord.packing_and_forwarding) || 0,
      grandTotal: parseFloat(ord.grand_total) || 0,
      estimatedDelivery: ord.estimated_delivery,
      status: ord.status,
      orderDate: ord.order_date,
      whatsappShareUrl: ord.whatsapp_share_url,
      items: itemsMap[ord.order_id] || []
    }));

    res.json(response);
  } catch (err) {
    console.warn('[Neon DB Orders Warning - Returning empty list]:', err.message);
    res.json([]);
  }
});

// POST submit order directly into Neon PostgreSQL
apiApp.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = `CRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const items = orderData.items || [];

    let subtotal = 0;
    let totalItems = 0;
    for (const item of items) {
      subtotal += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
      totalItems += (parseInt(item.quantity) || 1);
    }

    const actualValue = subtotal * 5; // 80% savings
    const festiveDiscount = actualValue - subtotal;
    const packingCharges = 0;
    const grandTotal = subtotal;

    // Build WhatsApp message URL
    const STORE_WHATSAPP_NUMBER = '918973015070';
    let msg = `🎇 *LAKARAM CRACKERS - NEW ORDER* 🎇\n`;
    msg += `🌐 lakaram-crackers.onrender.com\n`;
    msg += `--------------------------------------\n`;
    msg += `🆔 *Order ID:* ${orderId}\n`;
    msg += `👤 *Customer:* ${orderData.customerName || 'Customer'}\n`;
    msg += `📞 *Phone:* ${orderData.phone || ''}\n`;
    msg += `📍 *Address:* ${orderData.address || ''}, ${orderData.city || ''} - ${orderData.pincode || ''}\n`;
    msg += `💳 *Payment:* ${orderData.paymentMethod || 'WHATSAPP'}\n`;
    msg += `--------------------------------------\n`;
    msg += `📦 *ITEMS ORDERED:*\n`;
    items.forEach(it => {
      msg += `• ${it.productName} (${it.packSize}) x ${it.quantity} = ₹${(it.price * it.quantity).toFixed(0)}\n`;
    });
    msg += `--------------------------------------\n`;
    msg += `💰 *Subtotal:* ₹${subtotal.toFixed(0)}\n`;
    msg += `🎉 *You Saved:* ₹${festiveDiscount.toFixed(0)} (80% Off)\n`;
    msg += `⭐ *TOTAL PAYABLE:* ₹${grandTotal.toFixed(0)}\n`;
    msg += `--------------------------------------\n`;
    msg += `Please confirm my order and share bank/UPI details! 🙏`;

    const whatsappShareUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    try {
      // Insert order into customer_orders
      const orderQuery = `
        INSERT INTO customer_orders (
          order_id, customer_name, phone, delivery_address, pincode,
          payment_method, total_item_count, actual_value, festive_discount,
          subtotal, packing_and_forwarding, grand_total, estimated_delivery,
          status, order_date, whatsapp_share_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15)
        RETURNING *
      `;

      await pool.query(orderQuery, [
        orderId,
        orderData.customerName || 'Customer',
        orderData.phone || '',
        `${orderData.address || ''}, ${orderData.city || ''}, ${orderData.state || ''}`,
        orderData.pincode || '',
        orderData.paymentMethod || 'WHATSAPP',
        totalItems,
        actualValue,
        festiveDiscount,
        subtotal,
        packingCharges,
        grandTotal,
        '3 to 5 business days via Sivakasi Heavy Transport',
        'PENDING',
        whatsappShareUrl
      ]);

      // Insert order items
      for (const item of items) {
        await pool.query(`
          INSERT INTO order_items (
            order_id, product_id, product_name, category, pack_size,
            price, quantity, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          orderId,
          item.productId || 'UNKNOWN',
          item.productName || 'Cracker Item',
          item.category || 'sparklers',
          item.packSize || '1 Box',
          parseFloat(item.price) || 0,
          parseInt(item.quantity) || 1,
          (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)
        ]);
      }

      console.log(`[Neon DB] Created order ${orderId} for ${orderData.customerName}`);
    } catch (dbErr) {
      console.warn('[Neon DB Order Warning - Failed to persist to DB, continuing order response]:', dbErr.message);
    }

    res.status(201).json({
      orderId,
      status: 'PENDING',
      orderDate: new Date().toISOString(),
      customerName: orderData.customerName,
      phone: orderData.phone,
      deliveryAddress: `${orderData.address || ''}, ${orderData.city || ''}, ${orderData.state || ''}`,
      pincode: orderData.pincode,
      paymentMethod: orderData.paymentMethod,
      totalItemCount: totalItems,
      actualValue,
      festiveDiscount,
      subtotal,
      packingAndForwarding: packingCharges,
      grandTotal,
      estimatedDelivery: '3 to 5 business days via Sivakasi Heavy Transport',
      whatsappShareUrl,
      items
    });
  } catch (err) {
    console.error('Error in POST /api/orders:', err);
    res.status(500).json({ error: 'Failed to process order', details: err.message });
  }
});

// PATCH update order status
apiApp.patch('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status || !status.trim()) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const cleanStatus = status.trim().toUpperCase();
    const updateRes = await pool.query(
      'UPDATE customer_orders SET status = $1 WHERE order_id = $2 RETURNING *',
      [cleanStatus, orderId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const ord = updateRes.rows[0];

    // Fetch items for this order
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    const items = itemsResult.rows.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      category: item.category,
      packSize: item.pack_size,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      subtotal: parseFloat(item.subtotal)
    }));

    console.log(`[Neon DB] Updated status for order ${orderId} to ${cleanStatus}`);

    res.json({
      orderId: ord.order_id,
      customerName: ord.customer_name,
      phone: ord.phone,
      deliveryAddress: ord.delivery_address,
      pincode: ord.pincode,
      paymentMethod: ord.payment_method,
      totalItemCount: parseInt(ord.total_item_count) || 0,
      actualValue: parseFloat(ord.actual_value) || 0,
      festiveDiscount: parseFloat(ord.festive_discount) || 0,
      subtotal: parseFloat(ord.subtotal) || 0,
      packingAndForwarding: parseFloat(ord.packing_and_forwarding) || 0,
      grandTotal: parseFloat(ord.grand_total) || 0,
      estimatedDelivery: ord.estimated_delivery,
      status: ord.status,
      orderDate: ord.order_date,
      whatsappShareUrl: ord.whatsapp_share_url,
      items
    });
  } catch (err) {
    console.error('Error in PATCH /api/orders/:orderId/status:', err);
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// PUT update order status alias
apiApp.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status || !status.trim()) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const cleanStatus = status.trim().toUpperCase();
    const updateRes = await pool.query(
      'UPDATE customer_orders SET status = $1 WHERE order_id = $2 RETURNING *',
      [cleanStatus, orderId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const ord = updateRes.rows[0];

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
    const items = itemsResult.rows.map(item => ({
      productId: item.product_id,
      productName: item.product_name,
      category: item.category,
      packSize: item.pack_size,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      subtotal: parseFloat(item.subtotal)
    }));

    res.json({
      orderId: ord.order_id,
      customerName: ord.customer_name,
      phone: ord.phone,
      deliveryAddress: ord.delivery_address,
      pincode: ord.pincode,
      paymentMethod: ord.payment_method,
      totalItemCount: parseInt(ord.total_item_count) || 0,
      actualValue: parseFloat(ord.actual_value) || 0,
      festiveDiscount: parseFloat(ord.festive_discount) || 0,
      subtotal: parseFloat(ord.subtotal) || 0,
      packingAndForwarding: parseFloat(ord.packing_and_forwarding) || 0,
      grandTotal: parseFloat(ord.grand_total) || 0,
      estimatedDelivery: ord.estimated_delivery,
      status: ord.status,
      orderDate: ord.order_date,
      whatsappShareUrl: ord.whatsapp_share_url,
      items
    });
  } catch (err) {
    console.error('Error in PUT /api/orders/:orderId/status:', err);
    res.status(500).json({ error: 'Failed to update order status', details: err.message });
  }
});

// Auto-seed or update database with 80% discount
async function ensureDatabaseInitialized() {
  try {
    const countRes = await pool.query('SELECT count(*) FROM products');
    const count = parseInt(countRes.rows[0].count) || 0;
    if (count === 0) {
      console.log('[Neon DB] Products table is empty, seeding catalog with 80% discount...');
      const { DEFAULT_PRODUCTS } = await import('./src/data/defaultProducts.js');
      for (const p of DEFAULT_PRODUCTS) {
        const originalPrice = parseFloat(p.originalPrice) || 0;
        const discountPercent = 80;
        const discountedPrice = Math.round(originalPrice * 0.20);
        await pool.query(`
          INSERT INTO products (
            id, name, category, description, pack_size,
            original_price, discounted_price, discount_percent,
            sound_level, kid_safe, green_cracker_certified,
            image, stock, rating, video_demo
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO UPDATE SET
            discount_percent = 80,
            discounted_price = EXCLUDED.discounted_price
        `, [
          p.id, p.name, p.category, p.description, p.packSize,
          originalPrice, discountedPrice, discountPercent,
          p.soundLevel, Boolean(p.kidSafe), p.greenCrackerCertified !== false,
          p.image, p.stock || 100, p.rating || 5, p.videoDemo || ''
        ]);
      }
      console.log(`[Neon DB] Seeding completed: ${DEFAULT_PRODUCTS.length} products inserted with 80% discount.`);
    } else {
      const updated = await pool.query(`
        UPDATE products 
        SET discount_percent = 80,
            discounted_price = ROUND(original_price * 0.20)
        WHERE category != 'gift-boxes' 
          AND (discount_percent != 80 OR discounted_price != ROUND(original_price * 0.20))
      `);
      if (updated.rowCount > 0) {
        console.log(`[Neon DB] Updated ${updated.rowCount} products to 80% discount!`);
      }

      // Ensure Gift Boxes retain 0% discount and their exact net rate
      await pool.query(`
        UPDATE products
        SET discount_percent = 0,
            discounted_price = original_price
        WHERE category = 'gift-boxes' AND discount_percent != 0
      `);
    }
  } catch (err) {
    console.error('[Neon DB] Initialization check error:', err.message);
  }
}
// Database initialization can be triggered manually if needed
// ensureDatabaseInitialized();

export default apiApp;

