import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import cors from 'cors';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// Enable CORS and larger JSON payload for Base64 cracker product images
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Neon Serverless PostgreSQL Database Connection
const DATABASE_URL = process.env.DATABASE_URL || 
  process.env.SPRING_DATASOURCE_URL || 
  'postgresql://neondb_owner:npg_SzMhVg42oPKi@ep-sweet-bonus-azmv80s3-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
  discountPercent: parseInt(row.discount_percent) || 75,
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
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT count(*) FROM products');
    const count = parseInt(result.rows[0].count) || 0;
    res.json({
      status: 'UP',
      database: 'Neon Serverless PostgreSQL (Connected)',
      service: 'Lakaram Crackers API (www.lakaramcreckers.com)',
      version: '1.0.0',
      productsCount: count
    });
  } catch (err) {
    console.error('Database connection error in /api/health:', err);
    res.status(500).json({ status: 'DOWN', error: err.message });
  }
});

// ==========================================
// 2. PRODUCTS ENDPOINTS (GET, POST, PUT, DELETE)
// ==========================================

// GET all products (with optional search and category filter)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
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
    res.json(result.rows.map(mapProductRow));
  } catch (err) {
    console.error('Error in GET /api/products:', err);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(mapProductRow(result.rows[0]));
  } catch (err) {
    console.error('Error in GET /api/products/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create new product directly into Neon PostgreSQL
app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `LKM-${Math.floor(100 + Math.random() * 900)}`;
    const originalPrice = parseFloat(p.originalPrice) || 0;
    const discountPercent = parseInt(p.discountPercent) || 75;
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
    console.log(`[Neon DB] Inserted/Updated product: ${id} (${p.name})`);
    res.status(201).json(mapProductRow(result.rows[0]));
  } catch (err) {
    console.error('Error in POST /api/products:', err);
    res.status(500).json({ error: 'Failed to save product in Neon database', details: err.message });
  }
});

// PUT update product in Neon PostgreSQL
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;
    const originalPrice = parseFloat(p.originalPrice) || 0;
    const discountPercent = parseInt(p.discountPercent) || 75;
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
app.delete('/api/products/:id', async (req, res) => {
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
// 3. ORDERS ENDPOINTS (GET, POST)
// ==========================================

// GET all customer orders from Neon PostgreSQL
app.get('/api/orders', async (req, res) => {
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
    console.error('Error in GET /api/orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders from database' });
  }
});

// POST submit order directly into Neon PostgreSQL
app.post('/api/orders', async (req, res) => {
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

    const actualValue = subtotal * 4; // approximate 75% savings
    const festiveDiscount = actualValue - subtotal;
    const packingCharges = subtotal > 3000 ? 0 : 150;
    const grandTotal = subtotal + packingCharges;

    // Build WhatsApp message URL
    const STORE_WHATSAPP_NUMBER = '919442188990';
    let msg = `🎇 *LAKARAM CRACKERS - NEW ORDER* 🎇\n`;
    msg += `🌐 www.lakaramcreckers.com\n`;
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
    msg += `🎉 *You Saved:* ₹${festiveDiscount.toFixed(0)} (75% Off)\n`;
    msg += `🚚 *Packing & Transport:* ₹${packingCharges}\n`;
    msg += `⭐ *TOTAL PAYABLE:* ₹${grandTotal.toFixed(0)}\n`;
    msg += `--------------------------------------\n`;
    msg += `Please confirm my order and share bank/UPI details! 🙏`;

    const whatsappShareUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

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
      'CONFIRMED',
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

    res.status(201).json({
      orderId,
      status: 'CONFIRMED',
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
    res.status(500).json({ error: 'Failed to save order in database', details: err.message });
  }
});

// ==========================================
// 4. SERVE STATIC ASSETS & SINGLE PAGE APP
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback for React Router / Single Page App (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🎆 Lakaram Crackers Full-Stack Production Server`);
  console.log(`🚀 Serving frontend and Neon PostgreSQL API on 0.0.0.0:${PORT}`);
  console.log(`🌐 Neon Database Connected`);
  console.log(`====================================================`);
});
