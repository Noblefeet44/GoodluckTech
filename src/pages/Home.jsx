import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Wrench, RefreshCw, MessageSquare, ShieldCheck, Truck, MapPin, Star, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SEOHead from '../components/SEOHead';
import { safeFetchJson, fallbackProducts, fallbackBrands, fallbackAccessories, fallbackReviews } from '../data/fallbackData';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, brs, accs, revs] = await Promise.all([
          safeFetchJson('/api/products?featured=true', fallbackProducts),
          safeFetchJson('/api/brands', fallbackBrands),
          safeFetchJson('/api/accessories?featured=true', fallbackAccessories),
          safeFetchJson('/api/reviews', fallbackReviews)
        ]);
        setFeaturedProducts(prods);
        setBrands(brs);
        setAccessories(accs);
        setReviews(revs);
      } catch (err) {
        console.error(err);
        setFeaturedProducts(fallbackProducts);
        setBrands(fallbackBrands);
        setAccessories(fallbackAccessories);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const repairServices = [
    { title: 'Screen Replacement', icon: '📱', desc: 'Cracked screen, display flicker, line on screen, touch unresponsiveness.' },
    { title: 'Battery Replacement', icon: '🔋', desc: 'Fast battery drain, swollen battery, phone overheating or failing to boot.' },
    { title: 'Charging Port Repair', icon: '🔌', desc: 'Slow charging, loose charging port, liquid in charging connector.' },
    { title: 'Water Damage Restoration', icon: '💧', desc: 'Emergency chemical bath, short circuit fix, water corrosion cleanup.' },
    { title: 'Camera & Lens Fix', icon: '📷', desc: 'Blurry photos, broken camera glass lens, focus motor repair.' },
    { title: 'Speaker & Mic Repair', icon: '🔊', desc: 'No sound during calls, crackling speakers, low microphone volume.' }
  ];

  return (
    <>
      <SEOHead
        title="Home — Goodluck Tech Service"
        description="Buy UK used & brand new iPhones, Samsung, Tecno, Infinix. Swap phones, buy accessories or book repairs at UPTH 18 Everyday Plaza, Choba, Port Harcourt."
      />

      {/* Compact Mobile-First Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            {/* Store Location Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--accent-green)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: '700',
              marginBottom: '0.65rem',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <MapPin size={12} /> UPTH 18, Everyday Plaza, Choba, Port Harcourt
            </div>

            <h1 className="hero-title">
              Buy. Sell. Swap. Repair. <br />
              <span style={{ color: 'var(--accent-green)' }}>Your Trusted Phone Store.</span>
            </h1>

            <p className="hero-subtitle">
              Shop brand new & UK used iPhones, Samsung & Android phones with warranty. Instant phone trade-ins & repairs in Choba.
            </p>

            {/* Compact Action Buttons Grid */}
            <div className="hero-actions">
              <Link to="/phones" className="btn btn-accent btn-sm">
                <Smartphone size={15} />
                <span>Shop Phones</span>
              </Link>
              <Link to="/repair" className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <Wrench size={15} />
                <span>Repair Phone</span>
              </Link>
              <Link to="/sell-swap" className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <RefreshCw size={15} />
                <span>Sell / Swap</span>
              </Link>
              <a
                href="https://wa.me/2349012544042?text=Hello%20Goodluck%20Tech%20Service!%20I%20would%20like%20to%20inquire%20about%20a%20phone%2Frepair."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick Feature Badges Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              marginTop: '1rem',
              fontSize: '0.72rem',
              color: '#94A3B8',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '0.65rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} /> 100% Tested Phones
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} /> 6 Months Warranty
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} /> Store Pickup & Delivery
              </span>
            </div>
          </div>

          {/* Desktop Only Image Showcase (Hidden on Mobile view to avoid vertical space waste) */}
          <div className="hero-image-col" style={{ textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80"
              alt="Phones Showcase"
              style={{
                width: '100%',
                maxWidth: '340px',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                border: '2px solid rgba(255,255,255,0.15)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Phones Section */}
      <section style={{ padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
              <h2 className="section-title">Featured Phones</h2>
              <p className="section-subtitle">Top UK used and brand new devices in stock now</p>
            </div>
            <Link to="/phones" style={{ color: '#059669', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
              All Phones <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading phones...</div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Brand Section */}
      <section style={{ padding: '1.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Shop by Brand</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Select your favorite smartphone manufacturer</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.65rem',
            marginTop: '0.75rem'
          }}>
            {brands.map((b) => (
              <Link
                key={b.id}
                to={`/phones?brand=${b.name}`}
                className="card"
                style={{
                  padding: '0.75rem 0.35rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  textDecoration: 'none'
                }}
              >
                <img src={b.logo_url} alt={b.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '50%' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-navy)' }}>{b.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sell / Swap CTA Banner */}
      <section className="container" style={{ margin: '2rem auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 1.25rem',
          color: 'white',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge badge-featured" style={{ marginBottom: '0.5rem' }}>Phone Trade-In & Upgrade</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Want to Sell or Swap Your Current Phone?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Get an instant valuation quote. Upgrade to an iPhone 13, 14, 15, or Samsung Galaxy with zero hassle.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Link to="/sell-swap" className="btn btn-accent btn-sm">
                <RefreshCw size={15} />
                <span>Start Valuation & Swap</span>
              </Link>
              <a
                href="https://wa.me/2349012544042?text=Hello%20Goodluck%20Tech%20Service!%20I%20want%20to%20sell%2Fswap%20my%20phone."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageSquare size={15} />
                <span>Swap on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Services Section */}
      <section style={{ padding: '2rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title">Professional Phone Repairs</h2>
            <p className="section-subtitle">Experienced technicians in Choba, Port Harcourt using original replacement parts</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem'
          }}>
            {repairServices.map((service, idx) => (
              <div key={idx} className="card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.25rem' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {service.desc}
                </p>
                <Link to={`/repair?problem=${encodeURIComponent(service.title)}`} style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  Book Repair Now <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Section */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div>
              <h2 className="section-title">Must-Have Phone Accessories</h2>
              <p className="section-subtitle">AirPods, fast chargers, power banks, silicone cases & glass protectors</p>
            </div>
            <Link to="/accessories" style={{ color: '#059669', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
              Shop All <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            gap: '0.75rem'
          }}>
            {accessories.slice(0, 4).map((acc) => (
              <div key={acc.id} className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                <img src={acc.image_url} alt={acc.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.35rem' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700' }}>{acc.category}</span>
                <h4 style={{ fontSize: '0.82rem', fontWeight: '800', margin: '0.15rem 0', color: 'var(--primary-navy)' }}>{acc.title}</h4>
                <div style={{ marginTop: 'auto', paddingTop: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: 'var(--primary-navy)', fontSize: '0.88rem' }}>₦{Number(acc.price).toLocaleString()}</span>
                  <Link to="/accessories" className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Location Section */}
      <section style={{ padding: '2rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="badge badge-uk-used" style={{ marginBottom: '0.4rem' }}>Physical Store Location</span>
              <h2 className="section-title">Goodluck Tech Service Store</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Inspect phones in person, bring your device for repair, or complete your phone swap at our physical store in Choba, Port Harcourt.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)' }}>Store Address:</strong><br />
                    UPTH 18, Everyday Plaza, Choba, Port Harcourt, Rivers State, Nigeria.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <MessageSquare size={20} style={{ color: 'var(--whatsapp-green)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)' }}>WhatsApp / Phone:</strong> 09012544042
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map Placeholder / Card */}
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#F8FAFC', textAlign: 'center' }}>
              <MapPin size={38} style={{ color: '#059669', marginBottom: '0.65rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
                Everyday Plaza, Choba
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Located opposite UPTH (University of Port Harcourt Teaching Hospital), Gate 1, Choba.
              </p>
              <a
                href="https://maps.google.com/?q=Everyday+Plaza+Choba+Port+Harcourt"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-full btn-sm"
              >
                Open Location on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
