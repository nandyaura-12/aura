import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const STORAGE_KEY = 'aura-wishlist-v1';
const WishlistContext = createContext(null);

const loadWishlist = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Accepts product shapes from Home cards, Collections catalogue and the API.
export const normalizeWishlistItem = (product) => {
  const priceText =
    typeof product.price === 'string'
      ? product.price
      : product.unitPrice != null
        ? `₹${Number(product.unitPrice).toLocaleString('en-IN')}`
        : '';
  return {
    id: product.id || product.slug || product._id || product.name || product.title,
    title: product.title || product.name || 'Antique Piece',
    price: priceText,
    unitPrice:
      product.unitPrice != null
        ? Number(product.unitPrice)
        : Number(String(priceText).replace(/[^\d.]/g, '')) || 0,
    image: product.image || product.images?.[0] || '',
    slug: product.slug || product.id || '',
    stock: product.stock,
  };
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    const entry = normalizeWishlistItem(product);
    if (!entry.id) return false;
    if (items.some((item) => item.id === entry.id)) {
      setItems((prev) => prev.filter((item) => item.id !== entry.id));
      toast.success('Removed from your wishlist');
      return false;
    }
    setItems((prev) => [...prev, entry]);
    toast.success('Added to your wishlist ❤');
    return true;
  };

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      wishlistItems: items,
      wishlistCount: items.length,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
