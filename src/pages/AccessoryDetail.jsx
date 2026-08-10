import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Zap, BatteryCharging, Headphones, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/SEOHead';
import { safeFetchJson, fallbackAccessories } from '../data/fallbackData';

export default function AccessoryDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [accessory, setAccessory] = useState(null);
  const [similarAccessories, setSimilarAccessories] = useState([]);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAccessoryData() {
      setLoading(true);
      try {
        const allAcc = await safeFetchJson('/api/accessories', fallbackAccessories);
        const found = allAcc.find(a => String(a.id) === String(id)) || allAcc[0];
        setAccessory(found);
        setSimilarAccessories(allAcc.filter(a => String(a.id) !== String(found.id)).slice(0, 4));
      } catch (err) {
        console.error(err);
        const found = fallbackAccessories.find(a => String(a.id) === String(id)) || fallbackAccessories[0];
        setAccessory(found);
        setSimilarAccessories(fallbackAccessories.filter(a => String(a.id) !== String(found.id)).slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadAccessoryData();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading accessory specifications & gallery...</p>
      </div>
    );
  }

  if (error || !accessory) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Accessory Not Found</h2>
        <Link to="/accessories" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Accessories Store</Link>
      </div>
    );
  }

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  // Multi-angle carousel photos
  const images = [
    accessory.image_url || 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609592424074-1296c05b8ef2?w=800&auto=format&fit=crop&q=80'
  ];

  const handleNextImg = () => {
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = () => {
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addToCart({ id: `acc-${accessory.id}`, title: accessory.title, base_price: accessory.price, image_url: accessory.image_url }, null);
  };

  return (
    <>
      <SEOHead
        title={`${accessory.title} (${accessory.category}) — Specifications & Photos`}
        description={`Buy ${accessory.title} in Port Harcourt at Goodluck Tech Service. Price: ${formatNaira(accessory.price)}. Original store accessory.`}
      />

      <div className="container" style={{ padding: '1.25rem 0.75rem' }}>
        {/* Back Link */}
        <Link to="/accessories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to Accessories Store
        </Link>

        {/* Top Section: Multi-Photo Carousel Gallery + Accessory Specs Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          
          {/* Photo Carousel Column */}
          <div>
            <div className="carousel-container">
              <img
                src={images[activeImgIndex]}
                alt={`${accessory.title} - View ${activeImgIndex + 1}`}
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

            {/* Thumbnail Indicators (Front, Angle, Box) */}
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

          {/* Accessory Information & Specs Breakdown */}
          <div>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-brand-new">{accessory.category}</span>
              <span className="badge badge-in-stock">In Stock ({accessory.stock_qty || 10} units)</span>
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
              {accessory.title}
            </h1>

            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '1.25rem' }}>
              {formatNaira(accessory.price)}
            </div>

            {/* Structured Specifications Breakdown Card */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.6rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} style={{ color: 'var(--accent-green)' }} /> Technical Specifications & Features
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.82rem' }}>
                <div>🏷️ <strong>Category:</strong> {accessory.category}</div>
                <div>⚡ <strong>Quality Standard:</strong> 100% Original Tested</div>
                <div>📱 <strong>Compatibility:</strong> Universal Smartphone Support</div>
                <div>🛡️ <strong>Store Warranty:</strong> Tested & Replacement Guarantee</div>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <button onClick={handleAddToCart} className="btn btn-accent btn-full" style={{ padding: '0.85rem', fontSize: '0.95rem' }}>
                <ShoppingCart size={18} />
                <span>Add Accessory to Cart</span>
              </button>
            </div>

            {/* Overview Description */}
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.4rem' }}>Description & Highlights</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {accessory.description || 'Original phone accessory imported directly and verified for optimal charging speed, audio clarity, and protective durability.'}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Accessories Section */}
        {similarAccessories.length > 0 && (
          <section style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-featured" style={{ marginBottom: '0.25rem' }}>More Gear</span>
              <h2 className="section-title">Similar Accessories You Might Need</h2>
              <p className="section-subtitle">Pair your order with fast chargers, power banks, and protective cases</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {similarAccessories.map((acc) => (
                <Link key={acc.id} to={`/accessory/${acc.id}`} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', backgroundColor: 'white', textDecoration: 'none' }}>
                  <img src={acc.image_url} alt={acc.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.4rem' }} />
                  <span className="badge badge-uk-used" style={{ alignSelf: 'flex-start', fontSize: '0.62rem', padding: '1px 4px', marginBottom: '0.2rem' }}>
                    {acc.category}
                  </span>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.2rem' }}>{acc.title}</h4>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-green)', marginTop: 'auto' }}>
                    {formatNaira(acc.price)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
