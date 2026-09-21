import pkg from 'pg';
import { DEFAULT_PRODUCTS } from '../src/data/defaultProducts.js';

const { Pool } = pkg;

const connectionString = process.env.COCKROACH_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: Please set COCKROACH_DATABASE_URL or DATABASE_URL environment variable.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('----------------------------------------------------');
  console.log('🚀 Connecting to CockroachDB...');
  console.log('----------------------------------------------------');

  try {
    const versionRes = await pool.query('SELECT version()');
    console.log('✓ Connected successfully!');
    console.log('CockroachDB Version:', versionRes.rows[0].version);

    console.log('\n📦 Creating schema tables in CockroachDB...');

    // 1. Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        pack_size VARCHAR(100),
        original_price NUMERIC(10,2) DEFAULT 0,
        discounted_price NUMERIC(10,2) DEFAULT 0,
        discount_percent INT DEFAULT 80,
        sound_level VARCHAR(50) DEFAULT 'Low',
        kid_safe BOOLEAN DEFAULT FALSE,
        green_cracker_certified BOOLEAN DEFAULT TRUE,
        image TEXT,
        stock INT DEFAULT 100,
        rating INT DEFAULT 5,
        video_demo TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Table "products" ready.');

    // 2. Customer orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customer_orders (
        order_id VARCHAR(64) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        delivery_address TEXT,
        pincode VARCHAR(20),
        payment_method VARCHAR(50) DEFAULT 'WHATSAPP',
        total_item_count INT DEFAULT 0,
        actual_value NUMERIC(10,2) DEFAULT 0,
        festive_discount NUMERIC(10,2) DEFAULT 0,
        subtotal NUMERIC(10,2) DEFAULT 0,
        packing_and_forwarding NUMERIC(10,2) DEFAULT 150,
        grand_total NUMERIC(10,2) DEFAULT 0,
        estimated_delivery VARCHAR(255),
        status VARCHAR(50) DEFAULT 'PENDING',
        order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        whatsapp_share_url TEXT
      );
    `);
    console.log('✓ Table "customer_orders" ready.');

    // 3. Order items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT DEFAULT unique_rowid() PRIMARY KEY,
        order_id VARCHAR(64) REFERENCES customer_orders(order_id) ON DELETE CASCADE,
        product_id VARCHAR(64),
        product_name VARCHAR(255),
        category VARCHAR(100),
        pack_size VARCHAR(100),
        price NUMERIC(10,2) DEFAULT 0,
        quantity INT DEFAULT 1,
        subtotal NUMERIC(10,2) DEFAULT 0
      );
    `);
    console.log('✓ Table "order_items" ready.');

    // 4. Seed all 138 products
    console.log(`\n🌱 Seeding ${DEFAULT_PRODUCTS.length} products into CockroachDB...`);
    let inserted = 0;

    for (const p of DEFAULT_PRODUCTS) {
      const originalPrice = parseFloat(p.originalPrice) || 0;
      const discountPercent = parseInt(p.discountPercent) || 80;
      const discountedPrice = parseFloat(p.discountedPrice) || Math.round(originalPrice * (100 - discountPercent) / 100);

      await pool.query(`
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
          video_demo = EXCLUDED.video_demo;
      `, [
        p.id,
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
        parseInt(p.stock) || 100,
        parseInt(p.rating) || 5,
        p.videoDemo || ''
      ]);
      inserted++;
    }

    const countRes = await pool.query('SELECT count(*) FROM products');
    console.log(`✓ Migration Complete! Total products in CockroachDB: ${countRes.rows[0].count}`);

    await pool.end();
    console.log('----------------------------------------------------');
    console.log('🎉 CockroachDB Migration Succeeded!');
    console.log('----------------------------------------------------');
  } catch (err) {
    console.error('Migration failed:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
