const db = require('./db');

function seedDatabase() {
  console.log('Seeding Goodluck Tech Service database...');

  // 1. Settings
  const settingsStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const defaultSettings = [
    ['store_name', 'Goodluck Tech Service'],
    ['store_address', 'UPTH 18, Everyday Plaza, Choba, Port Harcourt, Rivers State, Nigeria'],
    ['whatsapp_number', '09012544042'],
    ['phone_number', '09012544042'],
    ['email', 'support@goodlucktech.ng'],
    ['opening_hours', 'Mon - Sat: 8:00 AM - 7:00 PM'],
    ['delivery_scope', 'Store Pickup & Nationwide Delivery'],
    ['hero_headline', 'Buy. Sell. Swap. Repair. Your Trusted Phone Tech Store.'],
    ['hero_subtext', 'Goodluck Tech Service sells brand new & UK used phones, offers top-dollar trade-ins, provides fast expert repairs, and delivers nationwide from our store at Everyday Plaza, Choba.']
  ];
  for (const [key, value] of defaultSettings) {
    settingsStmt.run(key, value);
  }

  // 2. Brands
  const countBrands = db.prepare('SELECT COUNT(*) as count FROM brands').get().count;
  if (countBrands === 0) {
    const insertBrand = db.prepare('INSERT INTO brands (name, logo_url) VALUES (?, ?)');
    const brands = [
      ['iPhone', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300&auto=format&fit=crop&q=80'],
      ['Samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80'],
      ['Tecno', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80'],
      ['Infinix', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'],
      ['Xiaomi', 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=300&auto=format&fit=crop&q=80'],
      ['Google Pixel', 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=300&auto=format&fit=crop&q=80'],
      ['Oppo', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&auto=format&fit=crop&q=80']
    ];
    for (const [bName, bLogo] of brands) {
      insertBrand.run(bName, bLogo);
    }
  }

  // 3. Accessories
  const countAcc = db.prepare('SELECT COUNT(*) as count FROM accessories').get().count;
  if (countAcc === 0) {
    const insertAcc = db.prepare(`
      INSERT INTO accessories (title, category, price, stock_qty, image_url, description, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const accessories = [
      [
        'Apple AirPods Pro 2nd Gen (ANC)',
        'Earbuds',
        45000,
        15,
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
        'Active Noise Cancellation, MagSafe charging case, immersive sound quality and crystal clear microphone.',
        1
      ],
      [
        'Apple 20W USB-C Fast Charger + Type-C Cable',
        'Chargers',
        15000,
        30,
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        'Original fast charging adapter for iPhone 11, 12, 13, 14, 15 series. Fast 0 to 50% in 30 minutes.',
        1
      ],
      [
        'Oraimo FreePods 4 Active Noise Cancelling',
        'Earbuds',
        28000,
        20,
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        'Deep bass, 35.5 hour heavy battery life, low latency game mode, IPX5 waterproof.',
        1
      ],
      [
        'Anker 20,000mAh PowerCore Fast Charging Power Bank',
        'Power Banks',
        35000,
        12,
        'https://images.unsplash.com/photo-1609592424074-2795cf60c1d1?w=600&auto=format&fit=crop&q=80',
        'High capacity 20,000mAh battery pack. Charges iPhones up to 4.5 times. PowerIQ fast charging technology.',
        1
      ],
      [
        'MagSafe Magnetic Clear Protective Case',
        'Cases',
        8500,
        50,
        'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&auto=format&fit=crop&q=80',
        'Shockproof anti-yellowing clear protective case with strong magnetic ring for fast wireless charging.',
        1
      ],
      [
        '9D Full Glue Curved Tempered Glass Screen Protector',
        'Screen Protectors',
        5000,
        100,
        'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
        'Edge-to-edge explosion-proof 9D tempered glass with oleophobic coating against scratches and fingerprint smudges.',
        1
      ],
      [
        'Samsung 25W Super Fast Wall Charger (Type-C)',
        'Chargers',
        14000,
        25,
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
        'Official Samsung PPS Super Fast Charging adapter compatible with Galaxy S21, S22, S23, S24 and Note series.',
        0
      ],
      [
        'Oraimo 10,000mAh Ultra Slim Power Bank',
        'Power Banks',
        18500,
        20,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'Compact pocket-friendly slim power bank with dual output ports and LED battery display.',
        0
      ]
    ];
    for (const acc of accessories) {
      insertAcc.run(...acc);
    }
  }

  // 4. Products & Variations
  const countProds = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (countProds === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (title, brand, model, condition, base_price, stock_status, description, warranty, battery_health, sim_info, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertVar = db.prepare(`
      INSERT INTO variations (product_id, storage, ram, color, price, stock_qty, sku, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertImg = db.prepare(`
      INSERT INTO product_images (product_id, image_url, sort_order)
      VALUES (?, ?, ?)
    `);

    const insertProdAcc = db.prepare(`
      INSERT INTO product_accessories (product_id, accessory_id)
      VALUES (?, ?)
    `);

    // --- Product 1: iPhone 13 ---
    const p1 = insertProd.run(
      'Apple iPhone 13',
      'iPhone',
      'iPhone 13',
      'UK Used',
      420000,
      'In Stock',
      'Clean UK Used iPhone 13 with pristine display, Super Retina XDR screen, A15 Bionic chip, and cinematic camera mode. Factory unlocked, non-refurbished.',
      '6 Months Warranty',
      '88% - 100% Clean Battery',
      'Physical SIM + eSIM',
      1
    );
    const p1Id = p1.lastInsertRowid;

    insertVar.run(p1Id, '128GB', '4GB', 'Midnight Black', 420000, 6, 'IP13-128-BLK', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p1Id, '128GB', '4GB', 'Pacific Blue', 425000, 4, 'IP13-128-BLU', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p1Id, '256GB', '4GB', 'Midnight Black', 475000, 5, 'IP13-256-BLK', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p1Id, '256GB', '4GB', 'Starlight White', 480000, 3, 'IP13-256-WHT', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p1Id, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=700&auto=format&fit=crop&q=80', 1);
    insertImg.run(p1Id, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80', 2);
    insertImg.run(p1Id, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80', 3);

    // Link accessories for iPhone 13 (20W charger, AirPods, case, screen protector)
    insertProdAcc.run(p1Id, 1); // AirPods Pro
    insertProdAcc.run(p1Id, 2); // 20W charger
    insertProdAcc.run(p1Id, 5); // Case
    insertProdAcc.run(p1Id, 6); // Screen protector

    // --- Product 2: iPhone 15 Pro Max ---
    const p2 = insertProd.run(
      'Apple iPhone 15 Pro Max',
      'iPhone',
      'iPhone 15 Pro Max',
      'Brand New',
      1280000,
      'In Stock',
      'Brand New Sealed iPhone 15 Pro Max with Aerospace-grade titanium design, A17 Pro chip, Action button, 5x Telephoto zoom camera system, and USB-C speed.',
      '1 Year Apple Warranty',
      '100% Original Battery',
      'Nano SIM + eSIM',
      1
    );
    const p2Id = p2.lastInsertRowid;

    insertVar.run(p2Id, '256GB', '8GB', 'Natural Titanium', 1280000, 4, 'IP15PM-256-NAT', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p2Id, '256GB', '8GB', 'Blue Titanium', 1280000, 3, 'IP15PM-256-BLU', 'https://images.unsplash.com/photo-1695048133021-32b0051e70ff?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p2Id, '512GB', '8GB', 'Natural Titanium', 1450000, 2, 'IP15PM-512-NAT', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p2Id, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80', 1);
    insertImg.run(p2Id, 'https://images.unsplash.com/photo-1695048133021-32b0051e70ff?w=700&auto=format&fit=crop&q=80', 2);

    insertProdAcc.run(p2Id, 1);
    insertProdAcc.run(p2Id, 2);
    insertProdAcc.run(p2Id, 5);

    // --- Product 3: Samsung Galaxy S24 Ultra ---
    const p3 = insertProd.run(
      'Samsung Galaxy S24 Ultra 5G',
      'Samsung',
      'Galaxy S24 Ultra',
      'Brand New',
      1350000,
      'In Stock',
      'Galaxy AI is here. Brand new Samsung Galaxy S24 Ultra with Titanium Frame, Snapdragon 8 Gen 3 processor, built-in S Pen, 200MP camera setup, and 100x Space Zoom.',
      '1 Year Official Samsung Warranty',
      '100% Battery',
      'Dual Nano SIM',
      1
    );
    const p3Id = p3.lastInsertRowid;

    insertVar.run(p3Id, '256GB', '12GB', 'Titanium Black', 1350000, 5, 'S24U-256-BLK', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p3Id, '512GB', '12GB', 'Titanium Gray', 1520000, 3, 'S24U-512-GRY', 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b2?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p3Id, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80', 1);

    insertProdAcc.run(p3Id, 7); // Samsung 25W charger
    insertProdAcc.run(p3Id, 4); // Anker power bank

    // --- Product 4: iPhone 11 ---
    const p4 = insertProd.run(
      'Apple iPhone 11',
      'iPhone',
      'iPhone 11',
      'UK Used',
      245000,
      'In Stock',
      'Very clean UK Used iPhone 11 with Dual 12MP ultra-wide cameras, Liquid Retina HD display, Face ID, and A13 Bionic performance. Great value flagship.',
      '6 Months Warranty',
      '85% - 96% Clean Battery',
      'Physical SIM + eSIM',
      1
    );
    const p4Id = p4.lastInsertRowid;

    insertVar.run(p4Id, '64GB', '4GB', 'Black', 245000, 8, 'IP11-64-BLK', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p4Id, '128GB', '4GB', 'Purple', 285000, 6, 'IP11-128-PRP', 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p4Id, '128GB', '4GB', 'White', 285000, 4, 'IP11-128-WHT', 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p4Id, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80', 1);

    insertProdAcc.run(p4Id, 2);
    insertProdAcc.run(p4Id, 5);

    // --- Product 5: Tecno Camon 30 Pro 5G ---
    const p5 = insertProd.run(
      'Tecno Camon 30 Pro 5G',
      'Tecno',
      'Camon 30 Pro',
      'Brand New',
      395000,
      'In Stock',
      'Brand new sealed Tecno Camon 30 Pro 5G with Sony IMX890 OIS camera, MediaTek Dimensity 8200 Ultimate 4nm processor, 144Hz AMOLED screen and 70W Ultra Charge.',
      '13 Months Carlcare Warranty',
      '100% Battery (5000mAh)',
      'Dual Nano SIM',
      0
    );
    const p5Id = p5.lastInsertRowid;

    insertVar.run(p5Id, '256GB', '12GB', 'Iceland Basalt Black', 395000, 10, 'TCN-C30-BLK', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p5Id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80', 1);

    insertProdAcc.run(p5Id, 3); // Oraimo earbuds
    insertProdAcc.run(p5Id, 8); // Oraimo power bank

    // --- Product 6: Infinix Note 40 Pro ---
    const p6 = insertProd.run(
      'Infinix Note 40 Pro 4G/5G',
      'Infinix',
      'Note 40 Pro',
      'Brand New',
      360000,
      'In Stock',
      'Brand new Infinix Note 40 Pro featuring 70W All-Round FastCharge 2.0, 20W Wireless MagCharge, 3D Curved 120Hz AMOLED display and 108MP OIS camera.',
      '13 Months Carlcare Warranty',
      '100% Battery (5000mAh)',
      'Dual Nano SIM',
      0
    );
    const p6Id = p6.lastInsertRowid;

    insertVar.run(p6Id, '256GB', '8GB', 'Vintage Green', 360000, 7, 'INF-N40-GRN', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p6Id, '256GB', '8GB', 'Titan Gold', 360000, 5, 'INF-N40-GLD', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p6Id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80', 1);

    // --- Product 7: Google Pixel 8 Pro ---
    const p7 = insertProd.run(
      'Google Pixel 8 Pro',
      'Google Pixel',
      'Pixel 8 Pro',
      'UK Used',
      620000,
      'In Stock',
      'Pure Android excellence! Clean UK Used Google Pixel 8 Pro with Tensor G3 chip, Super Actua display, pro-level camera controls, and 7 years of Android OS updates.',
      '6 Months Warranty',
      '95% Clean Battery',
      'Nano SIM + eSIM',
      0
    );
    const p7Id = p7.lastInsertRowid;

    insertVar.run(p7Id, '128GB', '12GB', 'Obsidian Black', 620000, 3, 'P8P-128-BLK', 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=700&auto=format&fit=crop&q=80');
    insertVar.run(p7Id, '256GB', '12GB', 'Bay Blue', 680000, 2, 'P8P-256-BLU', 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=700&auto=format&fit=crop&q=80');

    insertImg.run(p7Id, 'https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=700&auto=format&fit=crop&q=80', 1);
  }

  // 5. Customer Reviews
  const countRev = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
  if (countRev === 0) {
    const insertRev = db.prepare('INSERT INTO reviews (customer_name, rating, text, phone_purchased, date) VALUES (?, ?, ?, ?, ?)');
    const reviews = [
      ['Chidi Ebere', 5, 'Bought UK Used iPhone 13 at UPTH 18 Plaza. Battery health was 92%, phone looks brand new! Delivery to GRA was fast same day.', 'iPhone 13 128GB', 'Yesterday'],
      ['Blessing Nwankwo', 5, 'They swapped my iPhone 11 to iPhone 13 Pro Max smoothly. Honest valuation and very customer friendly on WhatsApp!', 'Swapped iPhone 11 to 13 Pro Max', '3 days ago'],
      ['Dr. Emmanuel K.', 5, 'Fixed my cracked Samsung S22 Ultra screen in less than 2 hours. Professional repair shop in Choba. Highly recommended!', 'Screen Replacement Repair', '1 week ago'],
      ['Gift Amadi', 5, 'Fast nationwide delivery to Abuja! Product arrived well packed with 6 months warranty document.', 'iPhone 15 Pro Max', '2 weeks ago']
    ];
    for (const r of reviews) {
      insertRev.run(...r);
    }
  }

  // 6. Sample Admin Orders, Repairs & Swaps
  const countOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  if (countOrders === 0) {
    db.prepare(`
      INSERT INTO orders (order_code, customer_name, customer_phone, delivery_method, state, city, address, notes, total_amount, order_details, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'GL-ORD-8821',
      'Tunde Adebayo',
      '08034567890',
      'Nationwide Delivery',
      'Rivers State',
      'Port Harcourt',
      'Plot 14 Stadium Road, GRA Phase 4',
      'Please call before delivering',
      435000,
      JSON.stringify([{ title: 'Apple iPhone 13', storage: '128GB', color: 'Midnight Black', qty: 1, price: 420000 }, { title: 'Apple 20W USB-C Charger', qty: 1, price: 15000 }]),
      'Confirmed'
    );
  }

  const countRepairs = db.prepare('SELECT COUNT(*) as count FROM repair_requests').get().count;
  if (countRepairs === 0) {
    db.prepare(`
      INSERT INTO repair_requests (booking_code, customer_name, customer_phone, email, location, brand, model, storage, problem_type, problem_description, repair_preference, preferred_date, status, diagnosis, estimated_cost, final_cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'GL-REP-4019',
      'Mercy Johnson',
      '07089123456',
      'mercy@gmail.com',
      'Choba, Port Harcourt',
      'Samsung',
      'Galaxy S21 Ultra',
      '256GB',
      'Broken screen',
      'Display screen flickers and glass is shattered after drop',
      'Bring to store',
      '2026-08-12',
      'Diagnosing',
      'AMOLED display panel replacement required',
      85000,
      85000
    );
  }

  const countSwaps = db.prepare('SELECT COUNT(*) as count FROM swap_requests').get().count;
  if (countSwaps === 0) {
    db.prepare(`
      INSERT INTO swap_requests (request_code, request_type, customer_name, customer_phone, location, brand, model, storage, ram, color, battery_health, condition_notes, faults, asking_price, target_swap_phone, status, admin_offer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'GL-SWP-1042',
      'Swap my phone',
      'David Omeh',
      '08123456789',
      'Rumuokoro, Port Harcourt',
      'iPhone',
      'iPhone 11',
      '128GB',
      '4GB',
      'Black',
      '86%',
      'Screen clean with protector, slight scratches on back glass',
      'Face ID works perfectly, battery healthy',
      220000,
      'iPhone 13 128GB',
      'Reviewing',
      210000
    );
  }

  console.log('Database seeding complete!');
}

seedDatabase();

module.exports = seedDatabase;
