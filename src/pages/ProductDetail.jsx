import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, BatteryCharging, Wifi, ArrowLeft, Plus, ChevronLeft, ChevronRight, CheckCircle2, Smartphone, Cpu, Camera, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FullSpecsModal from '../components/FullSpecsModal';
import SEOHead from '../components/SEOHead';
import { safeFetchJson, fallbackProducts } from '../data/fallbackData';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const foundFallback = fallbackProducts.find(p => p.id === parseInt(id)) || fallbackProducts[0];
        const data = await safeFetchJson(`/api/products/${id}`, foundFallback);
        if (data) {
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        const fallback = fallbackProducts.find(p => p.id === parseInt(id)) || fallbackProducts[0];
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading phone specifications & gallery...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/phones" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Phones Store</Link>
      </div>
    );
  }

  const variations = product.variations || [];
  const currentVar = variations[selectedVarIndex] || null;
  const currentPrice = currentVar ? currentVar.price : product.base_price;
  
  // Multi-angle carousel photos (Front, Back, Camera, Side)
  const images = (product.images && product.images.length > 0) ? product.images : [
    (currentVar && currentVar.image_url) || product.image_url || 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
  ];

  const recommendedAcc = product.recommendedAccessories || [];

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  const handleNextImg = () => {
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = () => {
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, currentVar);
  };

  return (
    <>
      <SEOHead
        title={`${product.title} (${product.condition}) — Specifications & Photos`}
        description={`Buy ${product.title} (${product.condition}) at Goodluck Tech Service in Port Harcourt. Price: ${formatNaira(currentPrice)}. Full specs & warranty.`}
      />

      <div className="container" style={{ padding: '1.25rem 0.75rem' }}>
        {/* Back Link */}
        <Link to="/phones" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Phones Catalog
        </Link>

        {/* Top Section: Photo Carousel Gallery + Product Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Photo Carousel Column */}
          <div>
            <div className="carousel-container">
              <img
                src={images[activeImgIndex]}
                alt={`${product.title} - Angle ${activeImgIndex + 1}`}
                className="carousel-slide"
              />
              {images.length > 1 && (
                <>
                  <button onClick={handlePrevImg} className="carousel-btn prev" aria-label="Previous image">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNextImg} className="carousel-btn next" aria-label="Next image">
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Indicators (Front, Back, Camera, Side) */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', justifyContent: 'center' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      padding: 0,
                      border: `2px solid ${activeImgIndex === idx ? 'var(--accent-green)' : 'transparent'}`,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={img} alt={`View ${idx + 1}`} style={{ width: '55px', height: '55px', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Types Selection */}
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className={`badge ${product.condition === 'Brand New' ? 'badge-brand-new' : 'badge-uk-used'}`}>
                {product.condition}
              </span>
              <span className="badge badge-in-stock">{product.stock_status || 'In Stock'}</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
              {product.title}
            </h1>

            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '1rem' }}>
              {formatNaira(currentPrice)}
            </div>

            {/* Select Storage & Color Variations Matrix */}
            {variations.length > 0 && (
              <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', color: 'var(--primary-navy)' }}>
                  Select Storage & Color Type:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {variations.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      onClick={() => setSelectedVarIndex(idx)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${selectedVarIndex === idx ? 'var(--accent-green)' : 'var(--border-light)'}`,
                        backgroundColor: selectedVarIndex === idx ? '#ECFDF5' : 'white',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: 'var(--primary-navy)', fontSize: '0.88rem' }}>{v.storage}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.color}</div>
                      <div style={{ fontWeight: '800', color: 'var(--accent-green)', marginTop: '2px', fontSize: '0.85rem' }}>{formatNaira(v.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Tested Specs Highlights */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                <div>🔋 <strong>Battery Health:</strong> {product.battery_health || '100% Tested'}</div>
                <div>🛡️ <strong>Warranty:</strong> {product.warranty || '6 Months Warranty'}</div>
                <div>📶 <strong>SIM Status:</strong> {product.sim_info || 'Dual SIM / eSIM'}</div>
                <div>✨ <strong>Condition:</strong> {product.condition}</div>
              </div>

              {/* View Full Hardware Specifications Button */}
              <button
                onClick={() => setShowFullSpecs(true)}
                className="btn btn-outline btn-full btn-sm"
                style={{ backgroundColor: '#F8FAFC', fontWeight: '800', color: 'var(--primary-navy)' }}
              >
                <FileText size={15} style={{ color: 'var(--accent-blue)' }} />
                <span>View Full Technical Specifications Sheet</span>
              </button>
            </div>

            {/* Streamlined Add to Cart Action Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <button onClick={handleAddToCart} className="btn btn-accent btn-full" style={{ padding: '0.85rem', fontSize: '0.95rem' }}>
                <ShoppingCart size={18} />
                <span>Add Selected Phone to Cart</span>
              </button>
            </div>

            {/* Description */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.4rem' }}>Overview & Quality Guarantee</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Phone Accessories Section */}
        {recommendedAcc.length > 0 && (
          <section style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-featured" style={{ marginBottom: '0.25rem' }}>Essential Companions</span>
              <h2 className="section-title">Similar Phone Accessories for Your {product.brand}</h2>
              <p className="section-subtitle">Add fast chargers, AirPods, silicone cases & glass guards to your order</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {recommendedAcc.map((acc) => (
                <div key={acc.id} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
                  <img src={acc.image_url} alt={acc.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.4rem' }} />
                  <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.2rem' }}>{acc.title}</h4>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '0.5rem' }}>
                    {formatNaira(acc.price)}
                  </div>
                  <button
                    onClick={() => addToCart({ id: `acc-${acc.id}`, title: acc.title, base_price: acc.price, image_url: acc.image_url }, null)}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 'auto', width: '100%', fontSize: '0.75rem' }}
                  >
                    <Plus size={13} /> Add Accessory
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Full Specifications Sheet Modal */}
      {showFullSpecs && (
        <FullSpecsModal
          product={product}
          onClose={() => setShowFullSpecs(false)}
        />
      )}
    </>
  );
}
