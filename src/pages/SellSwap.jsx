import React, { useState } from 'react';
import { RefreshCw, MessageSquare, CheckCircle, Upload, ShieldCheck, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function SellSwap() {
  const [requestType, setRequestType] = useState('Swap my phone');
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [ram, setRam] = useState('4GB');
  const [color, setColor] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('85% - 90%');
  const [screenCondition, setScreenCondition] = useState('Clean with screen protector');
  const [bodyCondition, setBodyCondition] = useState('Minor usage marks');
  const [faceIdStatus, setFaceIdStatus] = useState('Working Perfectly');
  const [faults, setFaults] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [targetSwapPhone, setTargetSwapPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [location, setLocation] = useState('Port Harcourt');
  const [submittedCode, setSubmittedCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !model) {
      alert('Please fill out your name, phone number, and phone model.');
      return;
    }

    setIsSubmitting(true);

    let refCode = 'GL-SWP-' + Math.floor(1000 + Math.random() * 9000);

    try {
      const payload = {
        request_type: requestType,
        customer_name: customerName,
        customer_phone: customerPhone,
        location,
        brand,
        model,
        storage,
        ram: '',
        color,
        battery_health: batteryHealth,
        condition_notes: `Screen: ${screenCondition}, Body: ${bodyCondition}, Biometrics: ${faceIdStatus}`,
        faults,
        asking_price: askingPrice ? parseFloat(askingPrice) : 0,
        target_swap_phone: targetSwapPhone,
        images: []
      };

      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.request_code) refCode = data.request_code;
      }
    } catch (err) {
      console.warn('Backend swap sync skipped, opening WhatsApp directly:', err);
    } finally {
      setSubmittedCode(refCode);
      setIsSubmitting(false);

      // Open WhatsApp directly for the user
      let msg = `*NEW PHONE SELL/SWAP REQUEST*\n`;
      msg += `-------------------------------\n`;
      msg += `*Ref Code:* ${refCode}\n`;
      msg += `*Goal:* ${requestType}\n`;
      msg += `*Customer:* ${customerName}\n`;
      msg += `*WhatsApp:* ${customerPhone}\n`;
      msg += `*Location:* ${location}\n`;
      msg += `-------------------------------\n`;
      msg += `*PHONE DETAILS:*\n`;
      msg += `• Brand & Model: ${brand} ${model}\n`;
      msg += `• Storage & Color: ${storage} | ${color || 'N/A'}\n`;
      msg += `• Battery Health: ${batteryHealth}\n`;
      msg += `• Screen Condition: ${screenCondition}\n`;
      msg += `• Body Condition: ${bodyCondition}\n`;
      msg += `• Biometrics (Face ID/Fingerprint): ${faceIdStatus}\n`;
      if (faults) msg += `• Faults/Notes: ${faults}\n`;
      if (askingPrice) msg += `• Asking Price: ₦${Number(askingPrice).toLocaleString()}\n`;
      if (targetSwapPhone) msg += `-------------------------------\n*DESIRED SWAP UPGRADE:* ${targetSwapPhone}\n`;
      msg += `-------------------------------\n`;
      msg += `Hello Goodluck Tech Service, please provide a valuation quote for my phone!`;

      window.open(`https://wa.me/2349012544042?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleContinueWhatsApp = () => {
    let msg = `*NEW PHONE SELL/SWAP REQUEST*\n`;
    msg += `-------------------------------\n`;
    msg += `*Ref Code:* ${submittedCode || 'GL-SWP'}\n`;
    msg += `*Goal:* ${requestType}\n`;
    msg += `*Customer:* ${customerName}\n`;
    msg += `*WhatsApp:* ${customerPhone}\n`;
    msg += `*Location:* ${location}\n`;
    msg += `-------------------------------\n`;
    msg += `*PHONE DETAILS:*\n`;
    msg += `• Brand & Model: ${brand} ${model}\n`;
    msg += `• Storage & Color: ${storage} | ${color || 'N/A'}\n`;
    msg += `• Battery Health: ${batteryHealth}\n`;
    msg += `• Screen Condition: ${screenCondition}\n`;
    msg += `• Body Condition: ${bodyCondition}\n`;
    msg += `• Biometrics (Face ID/Fingerprint): ${faceIdStatus}\n`;
    if (faults) msg += `• Faults/Notes: ${faults}\n`;
    if (askingPrice) msg += `• Asking Price: ₦${Number(askingPrice).toLocaleString()}\n`;
    if (targetSwapPhone) msg += `-------------------------------\n*DESIRED SWAP UPGRADE:* ${targetSwapPhone}\n`;
    msg += `-------------------------------\n`;
    msg += `Hello Goodluck Tech Service, please provide a valuation quote for my phone!`;

    window.open(`https://wa.me/2349012544042?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Sell or Swap Your Phone — Trade-In & Upgrade"
        description="Get top dollar value for your used iPhone or Samsung. Trade in your current phone for an upgrade at UPTH 18 Everyday Plaza, Choba, Port Harcourt."
      />

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-featured" style={{ marginBottom: '0.5rem' }}>Instant Trade-In Valuation</span>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Sell or Swap Your Phone</h1>
          <p className="section-subtitle">Fill out your phone details below to receive a high valuation quote from Goodluck Tech Service</p>
        </div>

        {submittedCode ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#F0FDF4', border: '2px solid #BBF7D0' }}>
            <CheckCircle size={54} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Valuation Request Submitted!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Your reference code is <strong style={{ color: 'var(--accent-green)' }}>{submittedCode}</strong>.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Click below to send your phone specs directly to our WhatsApp team for an instant price offer.
            </p>
            <button onClick={handleContinueWhatsApp} className="btn btn-whatsapp btn-full" style={{ padding: '0.9rem', fontSize: '1rem' }}>
              <MessageSquare size={20} />
              <span>Submit & Continue on WhatsApp</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
            {/* Step 1: What do you want to do? */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ fontSize: '1rem' }}>What do you want to do? *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['Sell my phone', 'Swap my phone', 'Get an upgrade'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRequestType(type)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      border: `2px solid ${requestType === type ? 'var(--accent-green)' : 'var(--border-light)'}`,
                      backgroundColor: requestType === type ? '#DCFCE7' : 'white',
                      color: requestType === type ? '#15803D' : 'var(--text-main)'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Phone Specifications */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              1. Your Phone Specifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Brand *</label>
                <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                  <option value="iPhone">iPhone</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Tecno">Tecno</option>
                  <option value="Infinix">Infinix</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Google Pixel">Google Pixel</option>
                  <option value="Oppo">Oppo</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Model *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. iPhone 11, S21 Ultra"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Storage *</label>
                <select className="form-select" value={storage} onChange={(e) => setStorage(e.target.value)}>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Black, Blue"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Battery Health</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 88%, 95%"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Condition Quiz */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              2. Phone Condition Quiz
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Screen Condition</label>
                <select className="form-select" value={screenCondition} onChange={(e) => setScreenCondition(e.target.value)}>
                  <option value="Clean with screen protector">Clean / No Scratches</option>
                  <option value="Minor light scratches">Minor light scratches</option>
                  <option value="Cracked glass (display works)">Cracked glass (display works)</option>
                  <option value="Defective display screen">Defective screen / lines</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Biometrics Status</label>
                <select className="form-select" value={faceIdStatus} onChange={(e) => setFaceIdStatus(e.target.value)}>
                  <option value="Working Perfectly">Face ID / Touch ID Works</option>
                  <option value="Not Working">Face ID / Touch ID Broken</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Any Faults or Damage Notes</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Mention any faults, past repairs, or included accessories (charger, box)..."
                value={faults}
                onChange={(e) => setFaults(e.target.value)}
              />
            </div>

            {requestType.includes('Swap') && (
              <div className="form-group">
                <label className="form-label">What phone would you like to swap for?</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. iPhone 13 128GB Blue or S24 Ultra"
                  value={targetSwapPhone}
                  onChange={(e) => setTargetSwapPhone(e.target.value)}
                />
              </div>
            )}

            {/* Step 4: Contact Info */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              3. Your Contact Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="080..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-full" style={{ padding: '0.9rem' }}>
                <RefreshCw size={18} />
                <span>Submit Valuation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
