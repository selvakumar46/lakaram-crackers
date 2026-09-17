import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sparklefest_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sparklefest_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' | 'quick-order'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('sparklefest_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sparklefest_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev[product.id];
      const currentQty = existing ? existing.quantity : 0;
      const newQty = Math.max(0, currentQty + qty);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: newQty,
        }
      };
    });
  };

  const setItemQuantity = (product, qty) => {
    setCart(prev => {
      const newQty = Math.max(0, parseInt(qty) || 0);
      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return {
        ...prev,
        [product.id]: {
          product,
          quantity: newQty,
        }
      };
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Calculations
  const cartItemsList = Object.values(cart);
  const totalItemCount = cartItemsList.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cartItemsList.reduce(
    (acc, item) => acc + (item.product.discountedPrice * item.quantity), 
    0
  );

  const actualTotal = cartItemsList.reduce(
    (acc, item) => acc + (item.product.originalPrice * item.quantity), 
    0
  );

  const festiveSavings = Math.max(0, actualTotal - subtotal);
  const minOrderThreshold = 1; // Acceptable order amount is ₹1 and above
  const freeGiftThreshold = 3000;
  const isMinOrderMet = subtotal >= 1 || subtotal === 0;
  const isFreePackingMet = subtotal >= 3000;
  const packingCharges = subtotal > 0 && !isFreePackingMet ? 150 : 0;
  const grandTotal = subtotal + packingCharges;

  return (
    <CartContext.Provider value={{
      cart,
      cartItemsList,
      totalItemCount,
      subtotal,
      actualTotal,
      festiveSavings,
      minOrderThreshold,
      freeGiftThreshold,
      isMinOrderMet,
      isFreePackingMet,
      packingCharges,
      grandTotal,
      addToCart,
      setItemQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      viewMode,
      setViewMode,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      isCartOpen,
      setIsCartOpen,
      isSafetyModalOpen,
      setIsSafetyModalOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAdminOpen,
      setIsAdminOpen,
      completedOrder,
      setCompletedOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
