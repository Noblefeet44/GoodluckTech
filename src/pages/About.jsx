import React from 'react';
import { MapPin, Phone, ShieldCheck, Truck, Wrench, RefreshCw, Smartphone } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us — Goodluck Tech Service"
        description="Learn about Goodluck Tech Service - your trusted physical phone store and expert repair lab at UPTH 18 Everyday Plaza, Choba, Port Harcourt."
      />

      <div className="container" style={{ padding: '3rem 1rem', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-brand-new" style={{ marginBottom: '0.5rem' }}>About Our Company</span>
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>Goodluck Tech Service</h1>
          <p className="section-subtitle">Port Harcourt's trusted phone store, trade-in market, and repair center</p>
        </div>

        <div className="card" style={{ padding: '2rem', backgroundColor: 'white', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
            Who We Are
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            <strong>Goodluck Tech Service</strong> is a premier mobile technology business located at Everyday Plaza, Choba, Port Harcourt. We specialize in selling high-grade UK used & brand new smartphones (iPhones, Samsung, Tecno, Infinix, Google Pixel), providing top-dollar phone trade-in & swap services, and delivering fast, professional phone repairs.
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            We understand that buying a phone or getting a repair requires trust. That's why every phone sold at Goodluck Tech Service undergoes rigorous 30-point quality testing for battery health, original display, Face ID functionality, and cellular signal before hitting our store shelves.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
            <Smartphone size={28} style={{ color: 'var(--accent-green)', marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>Tested Inventory</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All UK used devices come with clean battery health, factory unlocked status, and full warranty.</p>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
            <RefreshCw size={28} style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>Fair Trade-Ins</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Transparent valuations for phone sales and instant phone-to-phone upgrades.</p>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'white' }}>
            <Wrench size={28} style={{ color: 'var(--whatsapp-dark)', marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>Expert Repairs</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Same-day screen replacements, battery fixes, and liquid damage recovery.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--primary-navy)', color: 'white' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
            Visit Our Store Location
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin style={{ color: 'var(--whatsapp-green)' }} />
              <span><strong>Address:</strong> UPTH 18, Everyday Plaza, Choba, Port Harcourt, Rivers State, Nigeria</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone style={{ color: 'var(--whatsapp-green)' }} />
              <span><strong>Call / WhatsApp:</strong> 09012544042</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Truck style={{ color: 'var(--accent-blue)' }} />
              <span><strong>Delivery Scope:</strong> Store Pickup & Fast Nationwide Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
