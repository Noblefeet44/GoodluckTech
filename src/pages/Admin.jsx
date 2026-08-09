import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Smartphone, ShoppingBag, Wrench, RefreshCw, Settings as SettingsIcon, Plus, Edit, Trash2, CheckCircle, Clock, Eye, X, Save, Upload, Headphones, Image as ImageIcon } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [settings, setSettings] = useState({});
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Phone Product Modal Form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProdId, setEditingProdId] = useState(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodBrand, setProdBrand] = useState('iPhone');
  const [prodModel, setProdModel] = useState('');
  const [prodCondition, setProdCondition] = useState('UK Used');
  const [prodBasePrice, setProdBasePrice] = useState('');
  const [prodStockStatus, setProdStockStatus] = useState('In Stock');
  const [prodDescription, setProdDescription] = useState('');
  const [prodWarranty, setProdWarranty] = useState('6 Months Warranty');
  const [prodBatteryHealth, setProdBatteryHealth] = useState('90%+');
  const [prodSimInfo, setProdSimInfo] = useState('Physical SIM + eSIM');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // New Accessory Modal Form state
  const [showAccModal, setShowAccModal] = useState(false);
  const [editingAccId, setEditingAccId] = useState(null);
  const [accTitle, setAccTitle] = useState('');
  const [accCategory, setAccCategory] = useState('Earbuds');
  const [accPrice, setAccPrice] = useState('');
  const [accStockQty, setAccStockQty] = useState('10');
  const [accImageUrl, setAccImageUrl] = useState('');
  const [accDescription, setAccDescription] = useState('');
  const [accIsFeatured, setAccIsFeatured] = useState(false);
  const [isAccUploading, setIsAccUploading] = useState(false);

  // Variations list for phone product
  const [prodVariations, setProdVariations] = useState([
    { storage: '', color: '', price: '', stock_qty: '', sku: '' }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, accRes, ordRes, repRes, swapRes, setRes, brandRes] = await Promise.all([
        fetch('/api/dashboard-stats'),
        fetch('/api/products'),
        fetch('/api/accessories'),
        fetch('/api/orders'),
        fetch('/api/repairs'),
        fetch('/api/swaps'),
        fetch('/api/settings'),
        fetch('/api/brands')
      ]);

      setStats(await statsRes.json());
      setProducts(await prodRes.json());
      setAccessories(await accRes.json());
      setOrders(await ordRes.json());
      setRepairs(await repRes.json());
      setSwaps(await swapRes.json());
      setSettings(await setRes.json());
      setBrands(await brandRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  // Image Upload Handler
  const handleFileUpload = async (e, setUrl, setUploadingState) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingState(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.imageUrl) {
        setUrl(data.imageUrl);
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploadingState(false);
    }
  };

  // Status Handlers
  const handleOrderStatusChange = async (orderId, newStatus) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    loadData();
  };

  const handleRepairUpdate = async (repairId, status, diagnosis, estimated_cost) => {
    await fetch(`/api/repairs/${repairId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, diagnosis, estimated_cost })
    });
    loadData();
  };

  const handleSwapUpdate = async (swapId, status, admin_offer) => {
    await fetch(`/api/swaps/${swapId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_offer })
    });
    loadData();
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Are you sure you want to delete this phone product?')) return;
    await fetch(`/api/products/${prodId}`, { method: 'DELETE' });
    loadData();
  };

  const handleDeleteAccessory = async (accId) => {
    if (!confirm('Are you sure you want to delete this accessory?')) return;
    await fetch(`/api/accessories/${accId}`, { method: 'DELETE' });
    loadData();
  };

  // Save Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      title: prodTitle,
      brand: prodBrand,
      model: prodModel,
      condition: prodCondition,
      base_price: parseFloat(prodBasePrice) || 0,
      stock_status: prodStockStatus,
      description: prodDescription,
      warranty: prodWarranty,
      battery_health: prodBatteryHealth,
      sim_info: prodSimInfo,
      is_featured: prodIsFeatured,
      variations: prodVariations
        .filter(v => v.storage || v.color)
        .map(v => ({ ...v, price: parseFloat(v.price) || parseFloat(prodBasePrice) || 0, stock_qty: parseInt(v.stock_qty) || 5 })),
      images: prodImageUrl ? [prodImageUrl] : []
    };

    const url = editingProdId ? `/api/products/${editingProdId}` : '/api/products';
    const method = editingProdId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setShowProductModal(false);
    resetProductForm();
    loadData();
  };

  // Save Accessory
  const handleSaveAccessory = async (e) => {
    e.preventDefault();
    const payload = {
      title: accTitle,
      category: accCategory,
      price: parseFloat(accPrice) || 0,
      stock_qty: parseInt(accStockQty) || 10,
      image_url: accImageUrl,
      description: accDescription,
      is_featured: accIsFeatured
    };

    const url = editingAccId ? `/api/accessories/${editingAccId}` : '/api/accessories';
    const method = editingAccId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setShowAccModal(false);
    resetAccForm();
    loadData();
  };

  const resetProductForm = () => {
    setEditingProdId(null);
    setProdTitle('');
    setProdBrand('iPhone');
    setProdModel('');
    setProdCondition('UK Used');
    setProdBasePrice('');
    setProdDescription('');
    setProdImageUrl('');
    setProdVariations([{ storage: '', color: '', price: '', stock_qty: '', sku: '' }]);
  };

  const resetAccForm = () => {
    setEditingAccId(null);
    setAccTitle('');
    setAccCategory('Earbuds');
    setAccPrice('');
    setAccStockQty('10');
    setAccImageUrl('');
    setAccDescription('');
    setAccIsFeatured(false);
  };

  const openEditProduct = (p) => {
    setEditingProdId(p.id);
    setProdTitle(p.title);
    setProdBrand(p.brand);
    setProdModel(p.model);
    setProdCondition(p.condition);
    setProdBasePrice(p.base_price);
    setProdStockStatus(p.stock_status);
    setProdDescription(p.description || '');
    setProdWarranty(p.warranty || '');
    setProdBatteryHealth(p.battery_health || '');
    setProdSimInfo(p.sim_info || '');
    setProdIsFeatured(p.is_featured === 1);
    setProdImageUrl(p.image_url || '');
    setProdVariations(p.variations.length > 0 ? p.variations : [{ storage: '', color: '', price: p.base_price, stock_qty: 5, sku: '' }]);
    setShowProductModal(true);
  };

  const openEditAccessory = (a) => {
    setEditingAccId(a.id);
    setAccTitle(a.title);
    setAccCategory(a.category);
    setAccPrice(a.price);
    setAccStockQty(a.stock_qty);
    setAccImageUrl(a.image_url || '');
    setAccDescription(a.description || '');
    setAccIsFeatured(a.is_featured === 1);
    setShowAccModal(true);
  };

  const addVariationRow = () => {
    setProdVariations([...prodVariations, { storage: '', color: '', price: '', stock_qty: '', sku: '' }]);
  };

  const removeVariationRow = (idx) => {
    setProdVariations(prodVariations.filter((_, i) => i !== idx));
  };

  const updateVariationField = (idx, field, value) => {
    const updated = [...prodVariations];
    updated[idx][field] = value;
    setProdVariations(updated);
  };

  return (
    <>
      <SEOHead title="Admin Dashboard — Goodluck Tech Service" />

      <div className="container" style={{ padding: '1.5rem 0.75rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span className="badge badge-brand-new" style={{ marginBottom: '0.25rem' }}>Full Store Management</span>
            <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Admin Control Center</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Goodluck Tech Service — UPTH 18 Everyday Plaza, Choba, Port Harcourt
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { resetProductForm(); setShowProductModal(true); }}
              className="btn btn-accent btn-sm"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              <Plus size={16} /> Add Phone
            </button>
            <button
              onClick={() => { resetAccForm(); setShowAccModal(true); }}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              <Plus size={16} /> Add Accessory
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.85rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Phones (${products.length})`, icon: Smartphone },
            { id: 'accessories', label: `Accessories (${accessories.length})`, icon: Headphones },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'repairs', label: `Repairs (${repairs.length})`, icon: Wrench },
            { id: 'swaps', label: `Trade-Ins (${swaps.length})`, icon: RefreshCw },
            { id: 'settings', label: 'Store Settings', icon: SettingsIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap',
                  border: `1.5px solid ${active ? 'var(--accent-green)' : 'transparent'}`,
                  backgroundColor: active ? 'var(--primary-navy)' : 'white',
                  color: active ? 'white' : 'var(--text-main)',
                  boxShadow: active ? '0 2px 8px rgba(11, 19, 43, 0.15)' : 'none'
                }}
              >
                <Icon size={15} style={{ color: active ? 'var(--accent-green)' : 'var(--text-muted)' }} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ------------------- OVERVIEW TAB ------------------- */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>TOTAL PHONE PRODUCTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-navy)' }}>{stats.totalProducts || 0}</div>
              </div>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>ACCESSORIES IN STORE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{stats.totalAccessories || 0}</div>
              </div>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>PHONES IN STOCK</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-green)' }}>{stats.phonesInStock || 0}</div>
              </div>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>PENDING ORDERS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-gold)' }}>{stats.pendingOrders || 0}</div>
              </div>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>REPAIR BOOKINGS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{stats.pendingRepairs || 0}</div>
              </div>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '800' }}>TRADE-IN / SWAP REQS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8B5CF6' }}>{stats.pendingSwaps || 0}</div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--primary-navy)' }}>Quick Store Actions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button onClick={() => { resetProductForm(); setShowProductModal(true); }} className="btn btn-accent btn-sm">
                  + Add New Phone Product
                </button>
                <button onClick={() => { resetAccForm(); setShowAccModal(true); }} className="btn btn-outline btn-sm">
                  + Add New Accessory Item
                </button>
                <button onClick={() => setActiveTab('orders')} className="btn btn-outline btn-sm">
                  View Customer WhatsApp Orders
                </button>
                <button onClick={() => setActiveTab('repairs')} className="btn btn-outline btn-sm">
                  Process Repair Requests
                </button>
                <button onClick={() => setActiveTab('swaps')} className="btn btn-outline btn-sm">
                  Review Phone Swap Valuations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------- PHONES PRODUCTS TAB ------------------- */}
        {activeTab === 'products' && (
          <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-navy)' }}>Phones Inventory</h3>
              <button onClick={() => { resetProductForm(); setShowProductModal(true); }} className="btn btn-accent btn-sm">
                <Plus size={14} /> Add Phone
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.65rem' }}>Phone Item</th>
                    <th style={{ padding: '0.65rem' }}>Brand & Model</th>
                    <th style={{ padding: '0.65rem' }}>Condition</th>
                    <th style={{ padding: '0.65rem' }}>Base Price</th>
                    <th style={{ padding: '0.65rem' }}>Types</th>
                    <th style={{ padding: '0.65rem' }}>Status</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={p.image_url} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                        <strong style={{ color: 'var(--primary-navy)' }}>{p.title}</strong>
                      </td>
                      <td style={{ padding: '0.65rem' }}>{p.brand} {p.model}</td>
                      <td style={{ padding: '0.65rem' }}>
                        <span className={`badge ${p.condition === 'Brand New' ? 'badge-brand-new' : 'badge-uk-used'}`}>{p.condition}</span>
                      </td>
                      <td style={{ padding: '0.65rem', fontWeight: '800', color: 'var(--accent-green)' }}>{formatNaira(p.base_price)}</td>
                      <td style={{ padding: '0.65rem' }}>{p.variations ? p.variations.length : 0} types</td>
                      <td style={{ padding: '0.65rem' }}>{p.stock_status}</td>
                      <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                        <button onClick={() => openEditProduct(p)} style={{ color: 'var(--accent-blue)', marginRight: '0.5rem', padding: '4px' }} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ color: '#EF4444', padding: '4px' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- ACCESSORIES DASHBOARD TAB ------------------- */}
        {activeTab === 'accessories' && (
          <div className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-navy)' }}>Accessories Inventory Management</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Earbuds, Chargers, Power Banks, Cases, Screen Protectors, Smart Watches</p>
              </div>
              <button onClick={() => { resetAccForm(); setShowAccModal(true); }} className="btn btn-accent btn-sm">
                <Plus size={14} /> Add Accessory
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.65rem' }}>Accessory</th>
                    <th style={{ padding: '0.65rem' }}>Category</th>
                    <th style={{ padding: '0.65rem' }}>Price (₦)</th>
                    <th style={{ padding: '0.65rem' }}>Stock Qty</th>
                    <th style={{ padding: '0.65rem' }}>Featured</th>
                    <th style={{ padding: '0.65rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accessories.map((a) => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={a.image_url || 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80'} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <strong style={{ color: 'var(--primary-navy)' }}>{a.title}</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.description ? a.description.substring(0, 45) + '...' : ''}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.65rem' }}>
                        <span className="badge badge-uk-used">{a.category}</span>
                      </td>
                      <td style={{ padding: '0.65rem', fontWeight: '800', color: 'var(--accent-green)' }}>{formatNaira(a.price)}</td>
                      <td style={{ padding: '0.65rem', fontWeight: '700' }}>{a.stock_qty} in stock</td>
                      <td style={{ padding: '0.65rem' }}>
                        {a.is_featured === 1 ? <span className="badge badge-featured">Featured</span> : 'Standard'}
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                        <button onClick={() => openEditAccessory(a)} style={{ color: 'var(--accent-blue)', marginRight: '0.5rem', padding: '4px' }} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteAccessory(a.id)} style={{ color: '#EF4444', padding: '4px' }} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------- ORDERS TAB ------------------- */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {orders.map((ord) => (
              <div key={ord.id} className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-navy)' }}>{ord.order_code}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{ord.created_at}</span>
                  </div>
                  <span className="badge badge-featured">{ord.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <div>
                    <p><strong>Customer Name:</strong> {ord.customer_name}</p>
                    <p><strong>WhatsApp / Phone:</strong> <a href={`https://wa.me/234${ord.customer_phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: 'bold' }}>{ord.customer_phone}</a></p>
                    <p><strong>Delivery Choice:</strong> {ord.delivery_method} {ord.address && `• ${ord.address}`}</p>
                    <p><strong>Total Amount:</strong> <span style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{formatNaira(ord.total_amount)}</span></p>
                  </div>
                  <div>
                    <strong>Items Ordered:</strong>
                    <ul style={{ paddingLeft: '1.1rem', margin: '0.2rem 0' }}>
                      {ord.order_details && ord.order_details.map((item, idx) => (
                        <li key={idx}>
                          {item.title} ({item.storage || ''} {item.color || ''}) — Qty: {item.quantity} x {formatNaira(item.unitPrice || item.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', alignSelf: 'center', color: 'var(--primary-navy)' }}>Order Status:</span>
                  {['WhatsApp Contacted', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleOrderStatusChange(ord.id, st)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: ord.status === st ? 'var(--primary-navy)' : 'var(--bg-secondary)',
                        color: ord.status === st ? 'white' : 'var(--text-main)',
                        fontWeight: '700'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------- REPAIRS TAB ------------------- */}
        {activeTab === 'repairs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {repairs.map((rep) => (
              <div key={rep.id} className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-navy)' }}>{rep.booking_code}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{rep.created_at}</span>
                  </div>
                  <span className="badge badge-brand-new">{rep.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <div>
                    <p><strong>Customer:</strong> {rep.customer_name} (<a href={`https://wa.me/234${rep.customer_phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: 'bold' }}>{rep.customer_phone}</a>)</p>
                    <p><strong>Phone Model:</strong> {rep.brand} {rep.model} ({rep.storage})</p>
                    <p><strong>Problem Category:</strong> <span style={{ color: '#EF4444', fontWeight: '800' }}>{rep.problem_type}</span></p>
                    <p><strong>Customer Description:</strong> {rep.problem_description}</p>
                  </div>
                  <div>
                    <p><strong>Technician Diagnosis:</strong> {rep.diagnosis || 'Pending inspection'}</p>
                    <p><strong>Estimated Cost:</strong> {formatNaira(rep.estimated_cost)}</p>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', alignSelf: 'center', color: 'var(--primary-navy)' }}>Repair Status:</span>
                  {['Contacted', 'Diagnosing', 'Awaiting Customer Approval', 'Repairing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleRepairUpdate(rep.id, st, rep.diagnosis, rep.estimated_cost)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: rep.status === st ? 'var(--primary-navy)' : 'var(--bg-secondary)',
                        color: rep.status === st ? 'white' : 'var(--text-main)',
                        fontWeight: '700'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------- SWAPS TAB ------------------- */}
        {activeTab === 'swaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {swaps.map((swp) => (
              <div key={swp.id} className="card" style={{ padding: '1rem', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-navy)' }}>{swp.request_code} — {swp.request_type}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{swp.created_at}</span>
                  </div>
                  <span className="badge badge-uk-used">{swp.status}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <div>
                    <p><strong>Customer:</strong> {swp.customer_name} (<a href={`https://wa.me/234${swp.customer_phone.replace(/^0/, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--whatsapp-dark)', fontWeight: 'bold' }}>{swp.customer_phone}</a>)</p>
                    <p><strong>Customer Phone:</strong> {swp.brand} {swp.model} ({swp.storage} • {swp.color})</p>
                    <p><strong>Condition Quiz:</strong> {swp.battery_health} • {swp.condition_notes}</p>
                  </div>
                  <div>
                    <p><strong>Customer Asking Price:</strong> {formatNaira(swp.asking_price)}</p>
                    <p><strong>Target Upgrade Phone:</strong> {swp.target_swap_phone || 'None specified'}</p>
                    <p><strong>Store Valuation Offer:</strong> <span style={{ fontWeight: '800', color: 'var(--accent-green)' }}>{formatNaira(swp.admin_offer)}</span></p>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', alignSelf: 'center', color: 'var(--primary-navy)' }}>Trade-In Status:</span>
                  {['Reviewing', 'Offer Made', 'Negotiating', 'Accepted', 'Phone Received', 'Completed', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleSwapUpdate(swp.id, st, swp.admin_offer)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        backgroundColor: swp.status === st ? 'var(--primary-navy)' : 'var(--bg-secondary)',
                        color: swp.status === st ? 'white' : 'var(--text-main)',
                        fontWeight: '700'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ------------------- SETTINGS TAB ------------------- */}
        {activeTab === 'settings' && (
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary-navy)' }}>Store Information Configuration</h3>
            <div className="form-group">
              <label className="form-label">Store Address</label>
              <input type="text" className="form-input" value={settings.store_address || ''} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input type="text" className="form-input" value={settings.whatsapp_number || ''} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Store Phone Number</label>
              <input type="text" className="form-input" value={settings.phone_number || ''} readOnly />
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Phone Product Modal */}
      {showProductModal && (
        <div className="drawer-overlay" onClick={() => setShowProductModal(false)} style={{ alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '750px', maxHeight: '92vh', overflowY: 'auto', padding: '1.25rem', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{editingProdId ? 'Edit Phone Product' : 'Add New Phone Product'}</h2>
              <button onClick={() => setShowProductModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Product Title *</label>
                  <input type="text" className="form-input" placeholder="e.g. Apple iPhone 14" value={prodTitle} onChange={(e) => setProdTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <select className="form-select" value={prodBrand} onChange={(e) => setProdBrand(e.target.value)}>
                    <option value="iPhone">iPhone</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Google Pixel">Google Pixel</option>
                    <option value="Oppo">Oppo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Model *</label>
                  <input type="text" className="form-input" placeholder="iPhone 14" value={prodModel} onChange={(e) => setProdModel(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Condition *</label>
                  <select className="form-select" value={prodCondition} onChange={(e) => setProdCondition(e.target.value)}>
                    <option value="UK Used">UK Used</option>
                    <option value="Brand New">Brand New</option>
                    <option value="Nigerian Used">Nigerian Used</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Starting Price (₦) *</label>
                  <input type="number" className="form-input" placeholder="450000" value={prodBasePrice} onChange={(e) => setProdBasePrice(e.target.value)} required />
                </div>
              </div>

              {/* Direct Phone Picture Upload */}
              <div className="form-group">
                <label className="form-label">Phone Picture *</label>
                <label className="btn btn-accent btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', width: 'auto' }}>
                  <Upload size={14} />
                  <span>{isUploading ? 'Uploading Image...' : 'Upload Image from Phone or Laptop'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProdImageUrl, setIsUploading)} style={{ display: 'none' }} />
                </label>

                {prodImageUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={prodImageUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '800' }}>✓ Image uploaded successfully</span>
                  </div>
                )}
              </div>

              {/* Variations Builder */}
              <div style={{ margin: '1rem 0', padding: '0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--primary-navy)' }}>Storage & Color Types (Live Pricing per Variation)</strong>
                  <button type="button" onClick={addVariationRow} className="btn btn-outline btn-sm">
                    <Plus size={14} /> Add Type
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr auto', gap: '0.4rem', marginBottom: '0.35rem', fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                  <div>Storage</div>
                  <div>Color</div>
                  <div>Price (₦)</div>
                  <div>Stock Qty</div>
                  <div>Action</div>
                </div>

                {prodVariations.map((v, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr auto', gap: '0.4rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                    <input type="text" className="form-input" placeholder="e.g. 128GB" value={v.storage} onChange={(e) => updateVariationField(idx, 'storage', e.target.value)} />
                    <input type="text" className="form-input" placeholder="e.g. Black" value={v.color} onChange={(e) => updateVariationField(idx, 'color', e.target.value)} />
                    <input type="number" className="form-input" placeholder="Price ₦" value={v.price} onChange={(e) => updateVariationField(idx, 'price', e.target.value)} />
                    <input type="number" className="form-input" placeholder="Qty" value={v.stock_qty} onChange={(e) => updateVariationField(idx, 'stock_qty', e.target.value)} />
                    <button type="button" onClick={() => removeVariationRow(idx)} style={{ color: '#EF4444', padding: '4px' }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Quality Description</label>
                <textarea className="form-textarea" rows={2} value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-accent btn-full">
                <span>Save Phone Product & Variations</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Accessory Modal */}
      {showAccModal && (
        <div className="drawer-overlay" onClick={() => setShowAccModal(false)} style={{ alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto', padding: '1.25rem', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{editingAccId ? 'Edit Accessory' : 'Add New Accessory Item'}</h2>
              <button onClick={() => setShowAccModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveAccessory}>
              <div className="form-group">
                <label className="form-label">Accessory Title *</label>
                <input type="text" className="form-input" placeholder="e.g. Apple AirPods Pro 2nd Gen" value={accTitle} onChange={(e) => setAccTitle(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={accCategory} onChange={(e) => setAccCategory(e.target.value)}>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Chargers">Chargers</option>
                    <option value="Power Banks">Power Banks</option>
                    <option value="Cases">Cases</option>
                    <option value="Screen Protectors">Screen Protectors</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Cables">Cables</option>
                    <option value="Smart Watches">Smart Watches</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₦) *</label>
                  <input type="number" className="form-input" placeholder="15000" value={accPrice} onChange={(e) => setAccPrice(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" className="form-input" placeholder="10" value={accStockQty} onChange={(e) => setAccStockQty(e.target.value)} required />
              </div>

              {/* Direct Accessory Picture Upload */}
              <div className="form-group">
                <label className="form-label">Accessory Image *</label>
                <label className="btn btn-accent btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', width: 'auto' }}>
                  <Upload size={14} />
                  <span>{isAccUploading ? 'Uploading Image...' : 'Upload Image from Phone or Laptop'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAccImageUrl, setIsAccUploading)} style={{ display: 'none' }} />
                </label>

                {accImageUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={accImageUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-light)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: '800' }}>✓ Image uploaded successfully</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={2} placeholder="Item features & specs..." value={accDescription} onChange={(e) => setAccDescription(e.target.value)} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="accFeatured"
                  checked={accIsFeatured}
                  onChange={(e) => setAccIsFeatured(e.target.checked)}
                />
                <label htmlFor="accFeatured" style={{ fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
                  Feature this accessory on Homepage
                </label>
              </div>

              <button type="submit" className="btn btn-accent btn-full">
                <span>Save Accessory Item</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
