import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Send } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('Please fill out your name, phone number, and message.');
      return;
    }

    let text = `*INQUIRY — GOODLUCK TECH SERVICE*\n`;
    text += `Name: ${name}\n`;
    text += `Phone: ${phone}\n`;
    text += `Subject: ${subject}\n`;
    text += `Message: ${message}\n\n`;
    text += `Hello Goodluck Tech Service, I would like to get more information!`;

    window.open(`https://wa.me/2349012544042?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Contact Us & Store Location"
        description="Contact Goodluck Tech Service at UPTH 18 Everyday Plaza, Choba, Port Harcourt. Phone / WhatsApp: 09012544042."
      />

      <div className="container" style={{ padding: '2.5rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Contact & Store Location</h1>
          <p className="section-subtitle">Visit us in Choba, Port Harcourt or reach out to our WhatsApp customer support team</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: '1fr 1fr', gap: '2rem' }}>
          {/* Left: Contact Info */}
          <div>
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'white', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
                Store Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <MapPin size={24} style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)' }}>Physical Address:</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      UPTH 18, Everyday Plaza, Choba, Port Harcourt, Rivers State, Nigeria
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <Phone size={24} style={{ color: 'var(--whatsapp-green)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)' }}>WhatsApp & Phone:</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>09012544042</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <Clock size={24} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--primary-navy)' }}>Opening Hours:</strong>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Monday – Saturday: 8:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Card */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                Instant WhatsApp Support
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Need an immediate response regarding phone availability or repair pricing? Click below to chat directly with our team.
              </p>
              <a
                href="https://wa.me/2349012544042?text=Hello%20Goodluck%20Tech%20Service!%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-full"
              >
                <MessageSquare size={18} />
                <span>Chat with Goodluck Tech Service</span>
              </a>
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
              Send an Inquiry
            </h3>

            <form onSubmit={handleSubmitInquiry}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="070..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="Phone Availability Inquiry">Phone Availability Inquiry</option>
                  <option value="Repair Cost Quote">Repair Cost Quote</option>
                  <option value="Sell / Swap Phone Valuation">Sell / Swap Phone Valuation</option>
                  <option value="Order Status Check">Order Status Check</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Type your message or question here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-whatsapp btn-full" style={{ padding: '0.85rem' }}>
                <Send size={18} />
                <span>Send Inquiry to WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
