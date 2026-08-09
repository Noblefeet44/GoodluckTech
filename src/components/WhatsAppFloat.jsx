import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const whatsappUrl = "https://wa.me/2349012544042?text=Hello%20Goodluck%20Tech%20Service!%20I%20would%20like%20to%20make%20an%20inquiry%20about%20a%20phone%2Frepair.";

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} fill="currentColor" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
