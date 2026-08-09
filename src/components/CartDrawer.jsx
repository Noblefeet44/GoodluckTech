import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageSquare, MapPin, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, cartSubtotal, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('Store Pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Rivers State');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const formatNaira = (amount) => {
    return '₦' + Number(amount).toLocaleString();
  };

  const handleCheckoutWhatsApp = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and WhatsApp phone number before proceeding to checkout.');
      return;
    }

    setIsSubmitting(true);

    // Save order to server database
    try {
      const orderPayload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_method: deliveryMethod,
        state: deliveryMethod === 'Nationwide Delivery' ? state : '',
        city: deliveryMethod === 'Nationwide Delivery' ? 'Port Harcourt' : '',
        address: deliveryMethod === 'Nationwide Delivery' ? address : '',
        notes,
        total_amount: cartSubtotal,
        items: cartItems
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      // Build formatted WhatsApp message
      let message = `*NEW ORDER — GOODLUCK TECH SERVICE*\n`;
      message += `-------------------------------\n`;
      message += `*Order Ref:* ${data.order_code || 'GL-ORD'}\n`;
      message += `*Customer:* ${customerName}\n`;
      message += `*Phone/WhatsApp:* ${customerPhone}\n`;
      message += `*Delivery Choice:* ${deliveryMethod}\n`;
      if (deliveryMethod === 'Nationwide Delivery') {
        message += `*Address:* ${address}, ${state}\n`;
      } else {
        message += `*Pickup Store:* UPTH 18, Everyday Plaza, Choba, Port Harcourt\n`;
      }
      message += `-------------------------------\n`;
      message += `*ORDER ITEMS:*\n`;

      cartItems.forEach((item, index) => {
        message += `${index + 1}. *${item.title}*\n`;
        if (item.storage || item.color) {
          message += `   Specs: ${item.storage} | ${item.color}\n`;
        }
        message += `   Qty: ${item.quantity} x ${formatNaira(item.unitPrice)} = ${formatNaira(item.quantity * item.unitPrice)}\n\n`;
      });

      if (notes.trim()) {
        message += `*Notes:* ${notes}\n`;
      }

      message += `-------------------------------\n`;
      message += `*TOTAL AMOUNT: ${formatNaira(cartSubtotal)}*\n`;
      message += `-------------------------------\n`;
      message += `Hello Goodluck Tech Service, I would like to confirm my order!`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/2349012544042?text=${encodedMsg}`;

      // Open WhatsApp & clear cart
      window.open(whatsappUrl, '_blank');
      clearCart();
      closeCart();
    } catch (err) {
      console.error(err);
      alert('Network error submitting order, opening WhatsApp directly...');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--primary-navy)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.1rem' }}>
            <ShoppingBag size={22} style={{ color: 'var(--whatsapp-green)' }} />
            <span>Your Shopping Cart ({cartItems.length})</span>
          </div>
          <button onClick={closeCart} style={{ color: 'white', opacity: 0.8 }}>
            <X size={24} />
          </button>
        </div>

        {/* Body Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Browse our phone store or accessories to add items.</p>
              <button onClick={closeCart} className="btn btn-accent btn-sm">Start Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item.cartKey} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary-navy)' }}>{item.title}</h4>
                      <button onClick={() => removeFromCart(item.cartKey)} style={{ color: '#EF4444', padding: '2px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {(item.storage || item.color) && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0' }}>
                        {item.storage} {item.color && `• ${item.color}`}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span style={{ fontWeight: '800', color: 'var(--accent-green)', fontSize: '0.95rem' }}>
                        {formatNaira(item.unitPrice)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', padding: '2px 6px' }}>
                        <button onClick={() => updateQuantity(item.cartKey, -1)} style={{ padding: '2px' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartKey, 1)} style={{ padding: '2px' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Options Selection */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.75rem' }}>Delivery Choice</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Store Pickup')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${deliveryMethod === 'Store Pickup' ? 'var(--accent-green)' : 'var(--border-light)'}`,
                      backgroundColor: deliveryMethod === 'Store Pickup' ? '#DCFCE7' : 'white',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={16} />
                    Store Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Nationwide Delivery')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${deliveryMethod === 'Nationwide Delivery' ? 'var(--accent-green)' : 'var(--border-light)'}`,
                      backgroundColor: deliveryMethod === 'Nationwide Delivery' ? '#DCFCE7' : 'white',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      justifyContent: 'center'
                    }}
                  >
                    <Truck size={16} />
                    Nationwide Delivery
                  </button>
                </div>

                {deliveryMethod === 'Store Pickup' ? (
                  <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    📍 <strong>Pickup Location:</strong> UPTH 18, Everyday Plaza, Choba, Port Harcourt.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="State (e.g. Rivers, Lagos, Abuja)"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <textarea
                      className="form-textarea"
                      placeholder="Full Delivery Address"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                )}

                {/* Customer Contact Details */}
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your Information</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                    required
                  />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="WhatsApp Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Subtotal & WhatsApp Checkout Button */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-main)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Cart Subtotal:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-navy)' }}>{formatNaira(cartSubtotal)}</span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              disabled={isSubmitting}
              className="btn btn-whatsapp btn-full"
              style={{ padding: '0.9rem', fontSize: '1rem' }}
            >
              <MessageSquare size={20} />
              <span>Checkout via WhatsApp</span>
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              No online payment required. Your order opens on WhatsApp (07063334523).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
