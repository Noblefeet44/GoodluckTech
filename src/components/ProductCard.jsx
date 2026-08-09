import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const variations = product.variations || [];
  const primaryVar = variations[0] || null;
  const currentPrice = primaryVar ? primaryVar.price : product.base_price;
  const displayImage = (primaryVar && primaryVar.image_url) || product.image_url || (product.images && product.images[0]) || '';

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, primaryVar);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'white'
      }}
    >
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span className={`badge ${product.condition === 'Brand New' ? 'badge-brand-new' : 'badge-uk-used'}`} style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
          {product.condition}
        </span>
      </div>

      {/* Product Image */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'block', paddingTop: '75%', backgroundColor: '#F8FAFC' }}>
        <img
          src={displayImage}
          alt={product.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
          {product.brand}
        </div>
        
        <h3 style={{ fontSize: '0.88rem', fontWeight: '800', margin: '0.15rem 0 0.3rem 0', lineHeight: 1.25, color: 'var(--primary-navy)' }}>
          {product.title}
        </h3>

        {/* Battery & Warranty tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {product.battery_health && <span>🔋 {product.battery_health}</span>}
          {product.warranty && <span>🛡️ Warranty</span>}
        </div>

        {/* Available Storage Types Pill Badges */}
        {variations.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
            {variations.map((v, idx) => (
              <span
                key={v.id || idx}
                style={{
                  padding: '1px 5px',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  borderRadius: '3px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#F8FAFC',
                  color: 'var(--text-main)'
                }}
              >
                {v.storage}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Button */}
        <div style={{ marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--primary-navy)' }}>
              {formatNaira(currentPrice)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.35rem' }}>
            <button
              onClick={handleCardClick}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
            >
              <span>View Specs</span>
              <ArrowRight size={12} />
            </button>
            <button
              onClick={handleQuickAdd}
              className="btn btn-accent btn-sm"
              style={{ padding: '0.35rem 0.5rem', fontSize: '0.72rem' }}
              title="Add default variation to cart"
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
