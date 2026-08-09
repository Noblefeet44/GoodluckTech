import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Smartphone, Wrench, RefreshCw, Home, Phone, Info, Menu, X, MapPin, Headphones } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const location = useLocation();
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const mainNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Phones', path: '/phones', icon: Smartphone },
    { label: 'Accessories', path: '/accessories', icon: Headphones },
    { label: 'Sell / Swap', path: '/sell-swap', icon: RefreshCw },
    { label: 'Repairs', path: '/repair', icon: Wrench },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Phone }
  ];

  return (
    <>
      {/* Top Notification Bar */}
      <div className="top-header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} style={{ color: 'var(--whatsapp-green)' }} />
            <span>UPTH 18, Everyday Plaza, Choba, Port Harcourt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="https://wa.me/2349012544042" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--whatsapp-green)', fontWeight: 'bold' }}>
              WhatsApp: 09012544042
            </a>
            <span>| Nationwide Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Header Navigation */}
      <header className="header-nav">
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="brand-logo">
            <Smartphone size={26} style={{ color: 'var(--accent-green)' }} />
            <div>
              Goodluck<span className="accent">Tech</span>
              <div style={{ fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Phone Store & Repair
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-menu">
            {mainNavItems.map((item) => (
              <Link key={item.path} to={item.path} className={isActive(item.path) ? 'active' : ''}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={openCart}
              className="btn btn-outline" 
              style={{ position: 'relative', padding: '0.4rem 0.75rem', height: '38px' }}
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={18} />
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--accent-green)',
                  color: '#0B132B',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              className="btn btn-outline"
              style={{ display: 'flex', padding: '0.4rem', height: '38px' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Bar (Visible on Mobile Screens) */}
        <div 
          style={{
            display: 'flex',
            gap: '0.35rem',
            overflowX: 'auto',
            padding: '0.4rem 0.75rem',
            backgroundColor: 'var(--bg-main)',
            borderTop: '1px solid var(--border-light)',
            WebkitOverflowScrolling: 'touch'
          }}
          className="mobile-subnav-bar"
        >
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  backgroundColor: active ? 'var(--primary-navy)' : 'white',
                  color: active ? 'white' : 'var(--text-main)',
                  border: `1px solid ${active ? 'var(--primary-navy)' : 'var(--border-light)'}`,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Icon size={13} style={{ color: active ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu (Expanded view) */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontWeight: '700', padding: '0.4rem 0', color: isActive(item.path) ? 'var(--accent-green)' : 'var(--text-main)' }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '700', color: 'var(--accent-blue)', padding: '0.4rem 0' }}>
              🔒 Admin Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`nav-item-mobile ${isActive('/') ? 'active' : ''}`}>
          <Home size={19} />
          <span>Home</span>
        </Link>
        <Link to="/phones" className={`nav-item-mobile ${isActive('/phones') ? 'active' : ''}`}>
          <Smartphone size={19} />
          <span>Phones</span>
        </Link>
        <Link to="/sell-swap" className={`nav-item-mobile ${isActive('/sell-swap') ? 'active' : ''}`}>
          <RefreshCw size={19} />
          <span>Sell/Swap</span>
        </Link>
        <Link to="/repair" className={`nav-item-mobile ${isActive('/repair') ? 'active' : ''}`}>
          <Wrench size={19} />
          <span>Repairs</span>
        </Link>
        <button onClick={openCart} className={`nav-item-mobile ${cartCount > 0 ? 'active' : ''}`}>
          <ShoppingCart size={19} />
          <span>Cart</span>
          {cartCount > 0 && <div className="cart-badge-count">{cartCount}</div>}
        </button>
      </nav>
    </>
  );
}
