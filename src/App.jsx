import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import WhatsAppFloat from './components/WhatsAppFloat';

import Home from './pages/Home';
import Phones from './pages/Phones';
import ProductDetail from './pages/ProductDetail';
import Accessories from './pages/Accessories';
import AccessoryDetail from './pages/AccessoryDetail';
import SellSwap from './pages/SellSwap';
import Repair from './pages/Repair';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <CartDrawer />
        <WhatsAppFloat />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phones" element={<Phones />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/accessory/:id" element={<AccessoryDetail />} />
            <Route path="/sell-swap" element={<SellSwap />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}
