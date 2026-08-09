import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Smartphone, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FullSpecsModal from './FullSpecsModal';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showFullSpecs, setShowFullSpecs] = useState(false);

  if (!product) return null;

  const variations = product.variations || [];
  const currentVar = variations[selectedVarIndex] || null;
  const currentPrice = currentVar ? currentVar.price : product.base_price;
  
  const images = (product.images && product.images.length > 0) ? product.images : [
    (currentVar && currentVar.image_url) || product.image_url || 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80'
  ];

  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  const handleAddToCart = () => {
    addToCart(product, currentVar);
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} style={{ alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
        <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '650px', maxHeight: '92vh', overflowY: 'auto', padding: '1.25rem', backgroundColor: 'white', position: 'relative' }}>
          
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%', zIndex: 10 }}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            
            {/* Gallery */}
            <div>
              <div className="carousel-container" style={{ height: '220px' }}>
                <img src={images[activeImgIndex]} alt="" className="carousel-slide" />
              </div>
            </div>

            {/* Info */}
            <div>
              <span className={`badge ${product.condition === 'Brand New' ? 'badge-brand-new' : 'badge-uk-used'}`} style={{ marginBottom: '0.3rem' }}>
                {product.condition}
              </span>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.3rem' }}>
                {product.title}
              </h2>

              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-green)', marginBottom: '0.85rem' }}>
                {formatNaira(currentPrice)}
              </div>

              {/* Variation selector */}
              {variations.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-navy)', display: 'block', marginBottom: '0.35rem' }}>
                    Storage / Color Type:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {variations.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVarIndex(idx)}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          border: `1.5px solid ${selectedVarIndex === idx ? 'var(--accent-green)' : 'var(--border-light)'}`,
                          backgroundColor: selectedVarIndex === idx ? 'var(--primary-navy)' : 'white',
                          color: selectedVarIndex === idx ? 'white' : 'var(--text-main)'
                        }}
                      >
                        {v.storage} {v.color} ({formatNaira(v.price)})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart button */}
              <button onClick={handleAddToCart} className="btn btn-accent btn-full" style={{ padding: '0.75rem' }}>
                <ShoppingCart size={16} />
                <span>Add Selected Phone to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
