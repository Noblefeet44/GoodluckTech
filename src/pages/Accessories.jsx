import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Headphones, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEOHead from '../components/SEOHead';
import { safeFetchJson, fallbackAccessories } from '../data/fallbackData';

export default function Accessories() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [accessories, setAccessories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categoryList = [
    { name: 'All', icon: '🛒' },
    { name: 'Earbuds', icon: '🎧' },
    { name: 'Chargers', icon: '🔌' },
    { name: 'Power Banks', icon: '🔋' },
    { name: 'Cases', icon: '📱' },
    { name: 'Screen Protectors', icon: '🛡️' },
    { name: 'Headphones', icon: '🎧' },
    { name: 'Cables', icon: '⚡' },
    { name: 'Smart Watches', icon: '⌚' }
  ];

  useEffect(() => {
    async function loadAccessories() {
      setLoading(true);
      try {
        const query = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
        let data = await safeFetchJson(`/api/accessories${query}`, fallbackAccessories);
        if (selectedCategory !== 'All') {
          data = data.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        setAccessories(data);
      } catch (err) {
        console.error(err);
        setAccessories(fallbackAccessories);
      } finally {
        setLoading(false);
      }
    }
    loadAccessories();
  }, [selectedCategory]);

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  const handleCardClick = (accId) => {
    navigate(`/accessory/${accId}`);
  };

  const handleQuickAdd = (e, acc) => {
    e.stopPropagation();
    addToCart({ id: `acc-${acc.id}`, title: acc.title, base_price: acc.price, image_url: acc.image_url }, null);
  };

  return (
    <>
      <SEOHead
        title="Phone Accessories Store — Earbuds, Chargers & Cases"
        description="Shop original phone accessories in Port Harcourt: Apple 20W fast chargers, AirPods, Anker power banks, MagSafe cases, and screen protectors."
      />

      <div className="container" style={{ padding: '1rem 0.75rem' }}>
        {/* Compact Title */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h1 className="section-title" style={{ fontSize: '1.4rem' }}>Phone Accessories Store</h1>
          <p className="section-subtitle" style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>
            Tap a category below to filter earbuds, chargers, cases, and power banks:
          </p>
        </div>

        {/* All Categories Listed Clearly in a Responsive Wrapped Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          md: 'repeat(9, 1fr)',
          gap: '0.4rem',
          marginBottom: '1.25rem'
        }}>
          {categoryList.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: '0.45rem 0.3rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '800',
                  fontSize: '0.72rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  border: `1.5px solid ${active ? 'var(--accent-green)' : 'var(--border-light)'}`,
                  backgroundColor: active ? 'var(--primary-navy)' : 'white',
                  color: active ? 'white' : 'var(--text-main)',
                  boxShadow: active ? '0 2px 8px rgba(0, 214, 108, 0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '1rem' }}>{cat.icon}</span>
                <span style={{ lineHeight: 1.1 }}>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Indicator & Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            Category: <strong style={{ color: 'var(--primary-navy)' }}>{selectedCategory}</strong> ({accessories.length} items)
          </span>
          {selectedCategory !== 'All' && (
            <button onClick={() => setSelectedCategory('All')} style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '800' }}>
              Show All
            </button>
          )}
        </div>

        {/* Accessories Items Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading accessories...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', gap: '0.65rem' }}>
            {accessories.map((acc) => (
              <div
                key={acc.id}
                onClick={() => handleCardClick(acc.id)}
                className="card"
                style={{
                  padding: '0.65rem',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <img
                  src={acc.image_url || 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&auto=format&fit=crop&q=80'}
                  alt={acc.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.4rem' }}
                />
                <span className="badge badge-uk-used" style={{ alignSelf: 'flex-start', fontSize: '0.62rem', padding: '1px 4px', marginBottom: '0.2rem' }}>
                  {acc.category}
                </span>
                <h3 style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary-navy)', margin: '0.15rem 0', lineHeight: 1.25 }}>
                  {acc.title}
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                  {acc.description}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '0.35rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
                    {formatNaira(acc.price)}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleCardClick(acc.id)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.4rem' }}
                    >
                      <span>View Specs</span>
                      <ArrowRight size={11} />
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, acc)}
                      className="btn btn-accent btn-sm"
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.45rem' }}
                      title="Add to cart"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
