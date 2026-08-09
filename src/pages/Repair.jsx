import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Wrench, MessageSquare, CheckCircle, Calendar, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Repair() {
  const [searchParams] = useSearchParams();
  const initialProblem = searchParams.get('problem') || 'Broken screen';

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('Choba, Port Harcourt');
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [problemType, setProblemType] = useState(initialProblem);
  const [problemDesc, setProblemDesc] = useState('');
  const [repairPreference, setRepairPreference] = useState('Bring to store');
  const [preferredDate, setPreferredDate] = useState('');
  const [bookingCode, setBookingCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const problemOptions = [
    'Broken screen',
    'Battery problem',
    'Charging problem',
    'Water damage',
    'Camera problem',
    'Speaker/microphone problem',
    'Software problem',
    'Network problem',
    'Other repair'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !model) {
      alert('Please complete your name, phone number, and phone model.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        email,
        location,
        brand,
        model,
        storage,
        problem_type: problemType,
        problem_description: problemDesc,
        repair_preference: repairPreference,
        preferred_date: preferredDate,
        images: []
      };

      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setBookingCode(data.booking_code);
    } catch (err) {
      console.error(err);
      alert('Error booking repair, opening WhatsApp directly...');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWhatsApp = () => {
    let msg = `*NEW PHONE REPAIR BOOKING*\n`;
    msg += `-------------------------------\n`;
    msg += `*Booking Ref:* ${bookingCode || 'GL-REP'}\n`;
    msg += `*Customer:* ${customerName}\n`;
    msg += `*WhatsApp:* ${customerPhone}\n`;
    msg += `*Location:* ${location}\n`;
    msg += `-------------------------------\n`;
    msg += `*DEVICE:* ${brand} ${model} (${storage})\n`;
    msg += `*PROBLEM:* ${problemType}\n`;
    if (problemDesc) msg += `*Description:* ${problemDesc}\n`;
    msg += `*Preference:* ${repairPreference}\n`;
    if (preferredDate) msg += `*Preferred Date:* ${preferredDate}\n`;
    msg += `-------------------------------\n`;
    msg += `Hello Goodluck Tech Service, I would like to confirm my repair appointment!`;

    window.open(`https://wa.me/2349012544042?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Book Phone Repair — Screen, Battery & Water Damage Fix"
        description="Book expert phone repair services in Choba, Port Harcourt. Screen replacement, battery fixes, charging port repairs at UPTH 18 Everyday Plaza."
      />

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-brand-new" style={{ marginBottom: '0.5rem' }}>Fast Repair Shop</span>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Book Online Phone Repair</h1>
          <p className="section-subtitle">Get your screen, battery, or liquid damaged phone fixed by experts at Everyday Plaza, Choba</p>
        </div>

        {bookingCode ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#F0FDF4', border: '2px solid #BBF7D0' }}>
            <CheckCircle size={54} style={{ color: 'var(--accent-green)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Repair Request Received!
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Your repair booking reference is <strong style={{ color: 'var(--accent-green)' }}>{bookingCode}</strong>.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Send your booking details to WhatsApp for quick diagnostic feedback and repair pricing.
            </p>
            <button onClick={handleContinueWhatsApp} className="btn btn-whatsapp btn-full" style={{ padding: '0.9rem', fontSize: '1rem' }}>
              <MessageSquare size={20} />
              <span>Continue on WhatsApp</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
            {/* Step 1: Customer Info */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              1. Your Contact Information
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
                  placeholder="070..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location in PH *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Choba, GRA, Rumuokoro"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Step 2: Phone Specs */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              2. Phone Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                  placeholder="e.g. iPhone 12, S22 Ultra"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Storage</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="128GB"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                />
              </div>
            </div>

            {/* Step 3: Problem Selection */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', margin: '1.5rem 0 1rem 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              3. Describe the Problem
            </h3>

            <div className="form-group">
              <label className="form-label">Problem Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {problemOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setProblemType(opt)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      border: `2px solid ${problemType === opt ? 'var(--accent-green)' : 'var(--border-light)'}`,
                      backgroundColor: problemType === opt ? '#DCFCE7' : 'white',
                      color: problemType === opt ? '#15803D' : 'var(--text-main)',
                      textAlign: 'left'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Details & Observations</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe how the issue occurred or what fails to function..."
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
              />
            </div>

            {/* Step 4: Repair Preference & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Repair Preference</label>
                <select className="form-select" value={repairPreference} onChange={(e) => setRepairPreference(e.target.value)}>
                  <option value="Bring to store">Bring to store (Everyday Plaza, Choba)</option>
                  <option value="Ask about pickup">Ask about home/office pickup</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-accent btn-full" style={{ padding: '0.9rem', marginTop: '1rem' }}>
              <Wrench size={18} />
              <span>Submit Repair Request</span>
            </button>
          </form>
        )}
      </div>
    </>
  );
}
