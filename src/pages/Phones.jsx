import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SEOHead from '../components/SEOHead';
import { safeFetchJson, fallbackProducts, fallbackBrands } from '../data/fallbackData';

export default function Phones() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters state
  const selectedBrand = searchParams.get('brand') || 'All';
  const selectedCondition = searchParams.get('condition') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'newest';

  useEffect(() => {
    async function loadBrands() {
      const data = await safeFetchJson('/api/brands', fallbackBrands);
      setBrands(data);
    }
    loadBrands();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedBrand !== 'All') query.append('brand', selectedBrand);
        if (selectedCondition !== 'All') query.append('condition', selectedCondition);
        if (searchQuery) query.append('search', searchQuery);
        if (sortOption) query.append('sort', sortOption);

        let data = await safeFetchJson(`/api/products?${query.toString()}`, fallbackProducts);
        
        // Filter locally if fallback data was used
        if (selectedBrand !== 'All') {
          data = data.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
        }
        if (selectedCondition !== 'All') {
          data = data.filter(p => p.condition.toLowerCase() === selectedCondition.toLowerCase());
        }
        if (searchQuery) {
          const term = searchQuery.toLowerCase();
          data = data.filter(p => p.title.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term));
        }

        setProducts(data);
      } catch (err) {
        console.error(err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedBrand, selectedCondition, searchQuery, sortOption]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
      <SEOHead
        title="Phones Store — UK Used & Brand New Phones"
        description="Browse clean UK Used iPhones, Samsung, Tecno, Infinix, Google Pixel phones in Port Harcourt. Filter by brand, storage, and condition."
      />

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Phones Catalog</h1>
          <p className="section-subtitle">Buy clean UK Used and Brand New smartphones with warranty in Nigeria</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1.5fr 1fr 1fr 1fr auto', gap: '0.85rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search phone model (e.g. iPhone 13, S24 Ultra)..."
                value={searchQuery}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.88rem' }}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="All">All Brands</option>
                <option value="iPhone">iPhone</option>
                <option value="Samsung">Samsung</option>
                <option value="Tecno">Tecno</option>
                <option value="Infinix">Infinix</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Google Pixel">Google Pixel</option>
                <option value="Oppo">Oppo</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <select
                className="form-select"
                value={selectedCondition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="All">All Conditions</option>
                <option value="UK Used">UK Used</option>
                <option value="Brand New">Brand New</option>
              </select>
            </div>

            {/* Sorting Filter */}
            <div>
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="popular">Popular</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {(selectedBrand !== 'All' || selectedCondition !== 'All' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="btn btn-outline btn-sm"
                style={{ color: '#EF4444', borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' }}
              >
                <RefreshCw size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing <strong>{products.length}</strong> phones
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <RefreshCw size={32} className="spin" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading inventory...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white' }}>
            <Filter size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>No phones found matching your filters</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try clearing your search term or selecting a different brand or condition.</p>
            <button onClick={clearAllFilters} className="btn btn-accent">Clear All Filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

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
