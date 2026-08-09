const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

// Ensure database is seeded
require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage config for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// -------------------------------------------------------------
// ADMIN AUTHENTICATION API
// -------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const validEmail = 'goodlucktech16@gmail.com';
  const validPassword = 'GGodluck1990';

  if (email.trim().toLowerCase() === validEmail.toLowerCase() && password === validPassword) {
    const token = 'gl-admin-token-' + Date.now();
    return res.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: { email: validEmail, role: 'admin' }
    });
  } else {
    return res.status(401).json({ error: 'Invalid admin email or password' });
  }
});

// -------------------------------------------------------------
// SETTINGS & STATS
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const updates = req.body;
  Object.keys(updates).forEach(k => {
    stmt.run(k, updates[k]);
  });
  res.json({ success: true, message: 'Settings updated successfully' });
});

app.get('/api/dashboard-stats', (req, res) => {
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const phonesInStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_status = 'In Stock'").get().count;
  const totalAccessories = db.prepare('SELECT COUNT(*) as count FROM accessories').get().count;
  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('New', 'WhatsApp Contacted', 'Confirmed')").get().count;
  const pendingRepairs = db.prepare("SELECT COUNT(*) as count FROM repair_requests WHERE status NOT IN ('Completed', 'Cancelled')").get().count;
  const pendingSwaps = db.prepare("SELECT COUNT(*) as count FROM swap_requests WHERE status NOT IN ('Completed', 'Rejected')").get().count;

  res.json({
    totalProducts,
    phonesInStock,
    totalAccessories,
    pendingOrders,
    pendingRepairs,
    pendingSwaps
  });
});

// -------------------------------------------------------------
// BRANDS & REVIEWS
// -------------------------------------------------------------
app.get('/api/brands', (req, res) => {
  const brands = db.prepare('SELECT * FROM brands WHERE is_active = 1 ORDER BY name ASC').all();
  res.json(brands);
});

app.post('/api/brands', (req, res) => {
  const { name, logo_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Brand name is required' });
  const stmt = db.prepare('INSERT INTO brands (name, logo_url) VALUES (?, ?)');
  const result = stmt.run(name, logo_url || '');
  res.json({ id: result.lastInsertRowid, name, logo_url });
});

app.delete('/api/brands/:id', (req, res) => {
  db.prepare('DELETE FROM brands WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/reviews', (req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews WHERE is_published = 1 ORDER BY id DESC').all();
  res.json(reviews);
});

// -------------------------------------------------------------
// PRODUCTS & VARIATIONS
// -------------------------------------------------------------
app.get('/api/products', (req, res) => {
  const { brand, condition, minPrice, maxPrice, storage, search, sort, featured } = req.query;
  let sql = 'SELECT p.* FROM products p WHERE 1=1';
  const params = [];

  if (brand && brand !== 'All') {
    sql += ' AND LOWER(p.brand) = LOWER(?)';
    params.push(brand);
  }
  if (condition && condition !== 'All') {
    sql += ' AND LOWER(p.condition) = LOWER(?)';
    params.push(condition);
  }
  if (featured === 'true') {
    sql += ' AND p.is_featured = 1';
  }
  if (search) {
    sql += ' AND (LOWER(p.title) LIKE LOWER(?) OR LOWER(p.brand) LIKE LOWER(?) OR LOWER(p.model) LIKE LOWER(?))';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (sort === 'price_asc') {
    sql += ' ORDER BY p.base_price ASC';
  } else if (sort === 'price_desc') {
    sql += ' ORDER BY p.base_price DESC';
  } else if (sort === 'popular') {
    sql += ' ORDER BY p.is_featured DESC, p.id DESC';
  } else {
    sql += ' ORDER BY p.id DESC';
  }

  const products = db.prepare(sql).all(...params);

  const getVars = db.prepare('SELECT * FROM variations WHERE product_id = ?');
  const getImgs = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC');

  const fullProducts = products.map(p => {
    const vars = getVars.all(p.id);
    const imgs = getImgs.all(p.id);
    const primaryImg = imgs.length > 0 ? imgs[0].image_url : (vars.length > 0 ? vars[0].image_url : '');
    
    return {
      ...p,
      image_url: primaryImg,
      images: imgs.map(i => i.image_url),
      variations: vars
    };
  });

  let result = fullProducts;
  if (minPrice) {
    result = result.filter(p => p.base_price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.base_price <= parseFloat(maxPrice));
  }

  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });

  const variations = db.prepare('SELECT * FROM variations WHERE product_id = ?').all(prod.id);
  const images = db.prepare('SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC').all(prod.id).map(i => i.image_url);
  
  const accessories = db.prepare(`
    SELECT a.* FROM accessories a
    JOIN product_accessories pa ON pa.accessory_id = a.id
    WHERE pa.product_id = ?
  `).all(prod.id);

  const recommendedAccessories = accessories.length > 0 ? accessories : db.prepare('SELECT * FROM accessories WHERE is_featured = 1 LIMIT 4').all();

  res.json({
    ...prod,
    variations,
    images: images.length > 0 ? images : (variations.length > 0 ? [variations[0].image_url] : []),
    recommendedAccessories
  });
});

app.post('/api/products', (req, res) => {
  const { title, brand, model, condition, base_price, stock_status, description, warranty, battery_health, sim_info, is_featured, variations, images, accessory_ids } = req.body;

  const insertProd = db.prepare(`
    INSERT INTO products (title, brand, model, condition, base_price, stock_status, description, warranty, battery_health, sim_info, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insertProd.run(
    title, brand, model, condition, parseFloat(base_price),
    stock_status || 'In Stock', description || '',
    warranty || '6 Months Warranty', battery_health || '100%',
    sim_info || 'Dual SIM', is_featured ? 1 : 0
  );
  const prodId = result.lastInsertRowid;

  if (Array.isArray(variations)) {
    const insertVar = db.prepare(`
      INSERT INTO variations (product_id, storage, ram, color, price, stock_qty, sku, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    variations.forEach(v => {
      insertVar.run(prodId, v.storage, v.ram || '4GB', v.color, parseFloat(v.price), parseInt(v.stock_qty) || 5, v.sku || '', v.image_url || '');
    });
  }

  if (Array.isArray(images)) {
    const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)');
    images.forEach((img, idx) => {
      insertImg.run(prodId, img, idx);
    });
  }

  if (Array.isArray(accessory_ids)) {
    const insertLink = db.prepare('INSERT INTO product_accessories (product_id, accessory_id) VALUES (?, ?)');
    accessory_ids.forEach(accId => {
      insertLink.run(prodId, accId);
    });
  }

  res.json({ id: prodId, success: true, message: 'Product created successfully' });
});

app.put('/api/products/:id', (req, res) => {
  const prodId = req.params.id;
  const { title, brand, model, condition, base_price, stock_status, description, warranty, battery_health, sim_info, is_featured, variations, images } = req.body;

  db.prepare(`
    UPDATE products
    SET title=?, brand=?, model=?, condition=?, base_price=?, stock_status=?, description=?, warranty=?, battery_health=?, sim_info=?, is_featured=?
    WHERE id=?
  `).run(
    title, brand, model, condition, parseFloat(base_price), stock_status, description, warranty, battery_health, sim_info, is_featured ? 1 : 0, prodId
  );

  if (Array.isArray(variations)) {
    db.prepare('DELETE FROM variations WHERE product_id = ?').run(prodId);
    const insertVar = db.prepare(`
      INSERT INTO variations (product_id, storage, ram, color, price, stock_qty, sku, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    variations.forEach(v => {
      insertVar.run(prodId, v.storage, v.ram || '4GB', v.color, parseFloat(v.price), parseInt(v.stock_qty) || 5, v.sku || '', v.image_url || '');
    });
  }

  if (Array.isArray(images)) {
    db.prepare('DELETE FROM product_images WHERE product_id = ?').run(prodId);
    const insertImg = db.prepare('INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)');
    images.forEach((img, idx) => {
      insertImg.run(prodId, img, idx);
    });
  }

  res.json({ success: true, message: 'Product updated successfully' });
});

app.delete('/api/products/:id', (req, res) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// ACCESSORIES API (WITH FULL CRUD)
// -------------------------------------------------------------
app.get('/api/accessories', (req, res) => {
  const { category, featured } = req.query;
  let sql = 'SELECT * FROM accessories WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true') {
    sql += ' AND is_featured = 1';
  }
  sql += ' ORDER BY id DESC';

  const accessories = db.prepare(sql).all(...params);
  res.json(accessories);
});

app.post('/api/accessories', (req, res) => {
  const { title, category, price, stock_qty, image_url, description, is_featured } = req.body;
  const stmt = db.prepare(`
    INSERT INTO accessories (title, category, price, stock_qty, image_url, description, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(title, category, parseFloat(price), parseInt(stock_qty) || 10, image_url || '', description || '', is_featured ? 1 : 0);
  res.json({ id: result.lastInsertRowid, success: true });
});

app.put('/api/accessories/:id', (req, res) => {
  const { title, category, price, stock_qty, image_url, description, is_featured } = req.body;
  db.prepare(`
    UPDATE accessories
    SET title=?, category=?, price=?, stock_qty=?, image_url=?, description=?, is_featured=?
    WHERE id=?
  `).run(title, category, parseFloat(price), parseInt(stock_qty) || 10, image_url || '', description || '', is_featured ? 1 : 0, req.params.id);
  res.json({ success: true });
});

app.delete('/api/accessories/:id', (req, res) => {
  db.prepare('DELETE FROM accessories WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// ORDERS API
// -------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  const parsedOrders = orders.map(o => ({
    ...o,
    order_details: JSON.parse(o.order_details)
  }));
  res.json(parsedOrders);
});

app.post('/api/orders', (req, res) => {
  const { customer_name, customer_phone, delivery_method, state, city, address, notes, total_amount, items } = req.body;
  
  const order_code = 'GL-ORD-' + Math.floor(1000 + Math.random() * 9000);
  const stmt = db.prepare(`
    INSERT INTO orders (order_code, customer_name, customer_phone, delivery_method, state, city, address, notes, total_amount, order_details, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
  `);
  
  stmt.run(
    order_code,
    customer_name,
    customer_phone,
    delivery_method,
    state || '',
    city || '',
    address || '',
    notes || '',
    parseFloat(total_amount),
    JSON.stringify(items)
  );

  res.json({ success: true, order_code });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// REPAIR BOOKING API
// -------------------------------------------------------------
app.get('/api/repairs', (req, res) => {
  const repairs = db.prepare('SELECT * FROM repair_requests ORDER BY id DESC').all();
  const parsed = repairs.map(r => ({
    ...r,
    images: r.images ? JSON.parse(r.images) : []
  }));
  res.json(parsed);
});

app.post('/api/repairs', (req, res) => {
  const { customer_name, customer_phone, email, location, brand, model, storage, problem_type, problem_description, repair_preference, preferred_date, images } = req.body;
  
  const booking_code = 'GL-REP-' + Math.floor(1000 + Math.random() * 9000);
  const stmt = db.prepare(`
    INSERT INTO repair_requests (booking_code, customer_name, customer_phone, email, location, brand, model, storage, problem_type, problem_description, repair_preference, preferred_date, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
  `);

  stmt.run(
    booking_code,
    customer_name,
    customer_phone,
    email || '',
    location,
    brand,
    model,
    storage || '',
    problem_type,
    problem_description || '',
    repair_preference || 'Bring to store',
    preferred_date || '',
    JSON.stringify(images || [])
  );

  res.json({ success: true, booking_code });
});

app.patch('/api/repairs/:id', (req, res) => {
  const { status, diagnosis, estimated_cost, final_cost, internal_notes } = req.body;
  db.prepare(`
    UPDATE repair_requests
    SET status = ?, diagnosis = ?, estimated_cost = ?, final_cost = ?, internal_notes = ?
    WHERE id = ?
  `).run(status, diagnosis || '', parseFloat(estimated_cost) || 0, parseFloat(final_cost) || 0, internal_notes || '', req.params.id);
  
  res.json({ success: true });
});

// -------------------------------------------------------------
// SELL & SWAP API
// -------------------------------------------------------------
app.get('/api/swaps', (req, res) => {
  const swaps = db.prepare('SELECT * FROM swap_requests ORDER BY id DESC').all();
  const parsed = swaps.map(s => ({
    ...s,
    images: s.images ? JSON.parse(s.images) : []
  }));
  res.json(parsed);
});

app.post('/api/swaps', (req, res) => {
  const { request_type, customer_name, customer_phone, location, brand, model, storage, ram, color, battery_health, condition_notes, faults, asking_price, target_swap_phone, images } = req.body;

  const request_code = 'GL-SWP-' + Math.floor(1000 + Math.random() * 9000);
  const stmt = db.prepare(`
    INSERT INTO swap_requests (request_code, request_type, customer_name, customer_phone, location, brand, model, storage, ram, color, battery_health, condition_notes, faults, asking_price, target_swap_phone, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
  `);

  stmt.run(
    request_code,
    request_type,
    customer_name,
    customer_phone,
    location,
    brand,
    model,
    storage,
    ram || '',
    color || '',
    battery_health || '',
    condition_notes || '',
    faults || '',
    parseFloat(asking_price) || 0,
    target_swap_phone || '',
    JSON.stringify(images || [])
  );

  res.json({ success: true, request_code });
});

app.patch('/api/swaps/:id', (req, res) => {
  const { status, admin_offer, internal_notes } = req.body;
  db.prepare(`
    UPDATE swap_requests
    SET status = ?, admin_offer = ?, internal_notes = ?
    WHERE id = ?
  `).run(status, parseFloat(admin_offer) || 0, internal_notes || '', req.params.id);

  res.json({ success: true });
});

// Serve frontend in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Goodluck Tech Service backend server listening on port ${PORT}`);
});
