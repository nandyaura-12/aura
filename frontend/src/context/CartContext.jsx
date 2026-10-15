import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  TAX_RATE,
  addressSummary,
  initialAddresses,
  initialCartItems,
  initialContact,
  roundMoney,
} from '../data/checkout';
import { createOrderApi, fetchOffers } from '../services/api';

const STORAGE_KEY = 'aura-checkout-v1';
const CartContext = createContext(null);

const defaultCard = {
  number: '1234 5678 9012 3456',
  name: 'Amelia Hart',
  expiry: '',
  cvc: '123',
};

const defaultState = {
  items: initialCartItems,
  addresses: initialAddresses,
  selectedAddressId: 'home',
  contact: initialContact,
  promoCode: '',
  discountRate: 0,
  discountFixed: 0,
  paymentMethod: 'card',
  upiApp: 'gpay',
  upiId: '',
  upiVerified: false,
  card: defaultCard,
  billingSame: true,
  billing: { street: '', city: '', state: '', zip: '' },
  order: null,
};

const loadState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

const buildTotals = (items, discountRate, discountFixed = 0) => {
  const groups = new Map();
  items.forEach((item) => {
    const current = groups.get(item.currency) || {
      currency: item.currency,
      subtotal: 0,
      count: 0,
    };
    current.subtotal = roundMoney(current.subtotal + item.unitPrice * item.qty);
    current.count += 1;
    groups.set(item.currency, current);
  });

  return [...groups.values()].map((group) => {
    const rateDiscount = roundMoney(group.subtotal * discountRate);
    const fixed = group.currency === 'INR' || groups.size === 1 ? discountFixed : 0;
    const discount = roundMoney(Math.min(group.subtotal, rateDiscount + fixed));
    const taxable = roundMoney(group.subtotal - discount);
    const tax = roundMoney(taxable * TAX_RATE);
    const shipping = 0;
    const total = roundMoney(taxable + shipping + tax);
    return { ...group, discount, tax, shipping, total };
  });
};

export const CartProvider = ({ children }) => {
  const [state, setState] = useState(loadState);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    fetchOffers()
      .then((res) => {
        if (!cancelled) setOffers(res.data || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = useMemo(
    () => buildTotals(state.items, state.discountRate, state.discountFixed || 0),
    [state.items, state.discountRate, state.discountFixed]
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  const updateQty = (id, qty) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const next = Math.max(1, Math.min(item.stock, qty));
        return { ...item, qty: next };
      }),
    }));
  };

  const removeItem = (id) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const addItem = (product) => {
    setState((prev) => {
      const qty = product.qty || 1;
      const existing = prev.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === product.id
              ? { ...item, qty: Math.min(item.stock, item.qty + qty) }
              : item
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            stock: product.stock || 8,
            currency: product.currency || 'USD',
            ...product,
            qty: Math.min(product.stock || 8, qty),
          },
        ],
      };
    });
  };

  const applyPromo = (code) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return 'Enter a promo code';

    const subtotal = state.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const offer = offers.find(
      (item) => item.code?.toUpperCase() === normalized && item.status === 'Active'
    );

    if (offer) {
      if (offer.minimumPurchase && subtotal < Number(offer.minimumPurchase)) {
        return `Add ₹${Number(offer.minimumPurchase).toLocaleString('en-IN')} to use this code`;
      }
      if (offer.discountType === 'Fixed Amount') {
        setState((prev) => ({
          ...prev,
          promoCode: normalized,
          discountRate: 0,
          discountFixed: Number(offer.discountValue) || 0,
        }));
        return '';
      }
      setState((prev) => ({
        ...prev,
        promoCode: normalized,
        discountRate: (Number(offer.discountValue) || 0) / 100,
        discountFixed: 0,
      }));
      return '';
    }

    if (normalized === 'AURA10') {
      setState((prev) => ({ ...prev, promoCode: normalized, discountRate: 0.1, discountFixed: 0 }));
      return '';
    }
    return "That code isn't valid";
  };

  const clearPromo = () => {
    setState((prev) => ({ ...prev, promoCode: '', discountRate: 0, discountFixed: 0 }));
  };

  const setContact = (contact) => {
    setState((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  };

  const selectAddress = (id) => {
    setState((prev) => ({ ...prev, selectedAddressId: id }));
  };

  const saveAddress = (draft, editingId) => {
    setState((prev) => {
      const id = editingId || `addr-${Date.now()}`;
      const nextAddress = { ...draft, id, isDefault: Boolean(draft.isDefault) };
      let addresses = prev.addresses.map((address) =>
        address.id === id ? nextAddress : address
      );
      if (!editingId) addresses = [...addresses, nextAddress];
      if (nextAddress.isDefault) {
        addresses = addresses.map((address) => ({
          ...address,
          isDefault: address.id === id,
        }));
      }
      return { ...prev, addresses, selectedAddressId: id };
    });
  };

  const setPayment = (patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const setCard = (patch) => {
    setState((prev) => ({ ...prev, card: { ...prev.card, ...patch } }));
  };

  const placeOrder = async () => {
    const address = state.addresses.find((item) => item.id === state.selectedAddressId);
    if (!address) {
      throw new Error('Choose a shipping address.');
    }

    const totalAmount = roundMoney(totals.reduce((sum, group) => sum + group.total, 0));
    const customerName = `${address.firstName} ${address.lastName}`.trim();
    const response = await createOrderApi({
      customerName,
      customerEmail: state.contact.email,
      customerPhone: state.contact.phone || address.phone,
      shippingAddress: addressSummary(address),
      paymentMethod: state.paymentMethod,
      totalAmount,
      items: state.items.map((item) => ({
        productId: item.id,
        productName: item.title,
        quantity: item.qty,
        price: item.unitPrice,
        image: item.image,
      })),
    });

    const order = {
      id: response.data.orderId,
      items: state.items,
      totals,
      address,
      contact: state.contact,
      paymentMethod: state.paymentMethod,
      placedAt: response.data.createdAt,
    };
    setState((prev) => ({
      ...prev,
      order,
      items: [],
      promoCode: '',
      discountRate: 0,
      discountFixed: 0,
    }));
    return order;
  };

  const value = {
    ...state,
    totals,
    itemCount,
    selectedAddress: state.addresses.find((item) => item.id === state.selectedAddressId) || null,
    updateQty,
    removeItem,
    addItem,
    applyPromo,
    clearPromo,
    setContact,
    selectAddress,
    saveAddress,
    setPayment,
    setCard,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
