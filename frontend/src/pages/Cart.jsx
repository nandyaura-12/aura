import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import OrderSummary from '../components/checkout/OrderSummary';
import { formatMoney, lookItems } from '../data/checkout';
import { useCart } from '../context/CartContext';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const Cart = () => {
  const { items, updateQty, removeItem, addItem } = useCart();
  const suggestions = lookItems.filter((item) => !items.some((line) => line.id === item.id));

  return (
    <div className="storefront co-page">
      <StoreHeader />
      <main className="co-main">
        <div className="store-container">
          <header className="co-top">
            <h1>Your Cart</h1>
            <CheckoutStepper current="cart" />
          </header>

          <Link to="/collections" className="co-back">
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>

          <div className="co-grid">
            <div className="co-primary">
              {items.length === 0 ? (
                <section className="co-card co-empty">
                  <h2>Your cart is empty</h2>
                  <p>Explore the collection and add a piece you love.</p>
                  <Link to="/collections" className="co-text-btn">
                    Browse collections
                  </Link>
                </section>
              ) : (
                <ul className="co-items">
                  {items.map((item) => {
                    const lineTotal = item.unitPrice * item.qty;
                    const lowStock = item.stock <= 3;
                    return (
                      <li key={item.id} className="co-item">
                        <img src={item.image} alt={item.title} />
                        <div className="co-item-copy">
                          <h2>{item.title}</h2>
                          <p>{item.meta}</p>
                          <p className="co-sku">SKU: {item.sku}</p>
                          <p className={lowStock ? 'co-stock is-low' : 'co-stock'}>
                            <span />
                            {lowStock ? `Only ${item.stock} left` : 'In Stock'}
                          </p>
                        </div>
                        <div className="co-item-price">
                          <strong>{formatMoney(lineTotal, item.currency)}</strong>
                          {item.qty > 1 && (
                            <span>{formatMoney(item.unitPrice, item.currency)} each</span>
                          )}
                        </div>
                        <div className="co-qty" aria-label={`Quantity for ${item.title}`}>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            aria-label={`Decrease ${item.title} quantity`}
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            disabled={item.qty >= item.stock}
                            aria-label={`Increase ${item.title} quantity`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="co-remove"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {suggestions.length > 0 && (
                <section className="co-look">
                  <h2>Complete the look</h2>
                  <div className="co-look-grid">
                    {suggestions.map((item) => (
                      <article key={item.id} className="co-look-card">
                        <img src={item.image} alt={item.title} />
                        <div className="co-look-meta">
                          <div>
                            <h3>{item.title}</h3>
                            <p>{formatMoney(item.unitPrice, item.currency)}</p>
                          </div>
                          <button type="button" onClick={() => addItem({ ...item, qty: 1 })}>
                            + Add
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <OrderSummary
              cta="Proceed to Checkout"
              ctaTo="/checkout/shipping"
              showPromo
              showGift
            />
          </div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default Cart;
