import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('goodluck_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recommendedAcc, setRecommendedAcc] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('goodluck_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const addToCart = (product, variation = null, quantity = 1) => {
    setCartItems(prev => {
      const selectedVar = variation || (product.variations && product.variations[0]) || null;
      const varId = selectedVar ? selectedVar.id : 'base';
      const storage = selectedVar ? selectedVar.storage : (product.storage || '');
      const color = selectedVar ? selectedVar.color : (product.color || '');
      const unitPrice = selectedVar ? selectedVar.price : product.base_price;
      const imageUrl = (selectedVar && selectedVar.image_url) || product.image_url || (product.images && product.images[0]) || '';

      const cartKey = `${product.id}-${varId}`;

      const existingIndex = prev.findIndex(item => item.cartKey === cartKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartKey,
            productId: product.id,
            title: product.title,
            brand: product.brand,
            condition: product.condition,
            variationId: varId,
            storage,
            color,
            unitPrice,
            quantity,
            imageUrl
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prev => prev.filter(item => item.cartKey !== cartKey));
  };

  const updateQuantity = (cartKey, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.cartKey === cartKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
