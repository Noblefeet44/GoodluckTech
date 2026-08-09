import React from 'react';
import { X, Smartphone, Cpu, Camera, BatteryCharging, Shield, Wifi, Lock, Layers, Award, CheckCircle } from 'lucide-react';
import { getFullPhoneSpecs } from '../data/phoneSpecsDB';

export default function FullSpecsModal({ product, onClose }) {
  if (!product) return null;

  const kbSpecs = getFullPhoneSpecs(product.model, product.title);
  const formatNaira = (amt) => '₦' + Number(amt).toLocaleString();

  return (
    <div className="drawer-overlay" onClick={onClose} style={{ alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
      <div 
        className="card" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '1.25rem',
          backgroundColor: 'white'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.75rem'
        }}>
          <div>
            <span className={`badge ${product.condition === 'Brand New' ? 'badge-brand-new' : 'badge-uk-used'}`} style={{ marginBottom: '0.25rem' }}>
              {product.condition}
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-navy)' }}>
              {product.title} — Full Hardware Specifications
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ padding: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Goodluck Tech Verified Sheet Header */}
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem',
          fontSize: '0.82rem'
        }}>
          <div>
            <strong>Tested Condition:</strong> <span style={{ color: '#047857', fontWeight: '700' }}>{product.condition}</span>
          </div>
          <div>
            <strong>Verified Battery:</strong> <span style={{ color: '#047857', fontWeight: '700' }}>{product.battery_health || '100% Tested'}</span>
          </div>
          <div>
            <strong>Store Warranty:</strong> <span style={{ color: '#047857', fontWeight: '700' }}>{product.warranty || '6 Months Warranty'}</span>
          </div>
          <div>
            <strong>Starting Price:</strong> <span style={{ color: '#047857', fontWeight: '800' }}>{formatNaira(product.base_price)}</span>
          </div>
        </div>

        {/* Comprehensive Technical Specs Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Display & Screen */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={16} style={{ color: 'var(--accent-green)' }} /> Display & Touch Screen
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.display}
            </p>
          </div>

          {/* Processor & Chipset */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} style={{ color: 'var(--accent-blue)' }} /> Processor, GPU & Neural Engine
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.processor}
            </p>
          </div>

          {/* Main & Selfie Cameras */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Camera size={16} style={{ color: '#8B5CF6' }} /> Rear Camera Setup & Video Recording
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45, marginBottom: '0.35rem' }}>
              {kbSpecs.mainCamera}
            </p>
            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Front Selfie Camera:</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{kbSpecs.frontCamera}</p>
          </div>

          {/* Battery & Charging */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BatteryCharging size={16} style={{ color: '#10B981' }} /> Battery Capacity & Charging Speed
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.battery}
            </p>
          </div>

          {/* Build & Water Resistance */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={16} style={{ color: '#D97706' }} /> Frame Build, Glass & Protection
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.build}
            </p>
          </div>

          {/* Biometrics & Security */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={16} style={{ color: '#EF4444' }} /> Biometrics & Unlock Security
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.biometrics}
            </p>
          </div>

          {/* Cellular & Network */}
          <div className="card" style={{ padding: '0.85rem', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Wifi size={16} style={{ color: '#0284C7' }} /> Cellular 5G/4G, Wi-Fi & Ports
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
              {kbSpecs.network}
            </p>
          </div>

        </div>

        {/* Footer Close Button */}
        <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <button onClick={onClose} className="btn btn-primary btn-full">
            <span>Close Specifications Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
