const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'goodluck_tech.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      logo_url TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      condition TEXT NOT NULL, -- Brand New, UK Used, Nigerian Used
      base_price REAL NOT NULL,
      stock_status TEXT DEFAULT 'In Stock', -- In Stock, Low Stock, Out of Stock
      description TEXT,
      warranty TEXT DEFAULT '6 Months Warranty',
      battery_health TEXT DEFAULT '100%',
      sim_info TEXT DEFAULT 'Dual SIM / eSIM',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS variations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      storage TEXT NOT NULL, -- 64GB, 128GB, 256GB, 512GB, 1TB
      ram TEXT DEFAULT '6GB',
      color TEXT NOT NULL,
      price REAL NOT NULL,
      stock_qty INTEGER DEFAULT 5,
      sku TEXT,
      image_url TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- Earbuds, Chargers, Cases, Screen Protectors, Power Banks, Smart Watches, Cables
      price REAL NOT NULL,
      stock_qty INTEGER DEFAULT 10,
      image_url TEXT,
      description TEXT,
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_accessories (
      product_id INTEGER NOT NULL,
      accessory_id INTEGER NOT NULL,
      PRIMARY KEY (product_id, accessory_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      delivery_method TEXT NOT NULL, -- Store Pickup, Nationwide Delivery
      state TEXT,
      city TEXT,
      address TEXT,
      notes TEXT,
      total_amount REAL NOT NULL,
      order_details TEXT NOT NULL, -- JSON string of cart items & variations
      status TEXT DEFAULT 'New', -- New, WhatsApp Contacted, Confirmed, Preparing, Ready for Pickup, Out for Delivery, Completed, Cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repair_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      email TEXT,
      location TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      storage TEXT,
      problem_type TEXT NOT NULL, -- Broken Screen, Battery, Charging, Camera, Water Damage, etc.
      problem_description TEXT,
      repair_preference TEXT DEFAULT 'Bring to store', -- Bring to store, Home/Office Pickup
      preferred_date TEXT,
      images TEXT, -- JSON array of image URLs
      status TEXT DEFAULT 'New', -- New, Contacted, Phone Received, Diagnosing, Awaiting Customer Approval, Repairing, Ready, Completed, Cancelled
      diagnosis TEXT,
      estimated_cost REAL DEFAULT 0,
      final_cost REAL DEFAULT 0,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS swap_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_code TEXT UNIQUE,
      request_type TEXT NOT NULL, -- Sell my phone, Swap my phone, Get an upgrade
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      location TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      storage TEXT NOT NULL,
      ram TEXT,
      color TEXT,
      battery_health TEXT,
      condition_notes TEXT,
      faults TEXT,
      asking_price REAL DEFAULT 0,
      target_swap_phone TEXT,
      images TEXT, -- JSON array of image URLs
      status TEXT DEFAULT 'New', -- New, Reviewing, Offer Made, Negotiating, Accepted, Phone Received, Completed, Rejected
      admin_offer REAL DEFAULT 0,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      text TEXT NOT NULL,
      phone_purchased TEXT,
      is_published INTEGER DEFAULT 1,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

initSchema();

module.exports = db;
