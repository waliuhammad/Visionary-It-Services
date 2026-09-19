import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const STORAGE_KEY = 'cart';

// Only what the cart needs; prices are always re-checked by the server at checkout
const toCartItem = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image || null,
  category: product.category || '',
});

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved.filter((i) => i?.id && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage unavailable (private mode): the cart still works for this visit
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...toCartItem(product), quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
