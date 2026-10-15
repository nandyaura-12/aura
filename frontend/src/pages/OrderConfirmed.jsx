import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { addressSummary, formatMoney } from '../data/checkout';
import { useCart } from '../context/CartContext';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const methodLabel = {
  card: 'Card',
  upi: 'UPI',
  paypal: 'PayPal',
};

const OrderConfirmed = () => {
  const { order } = useCart();

  return (
    <div className="storefront co-page">
      <StoreHeader />
      <main className="co-main">
        <div className="store-container co-confirm">
          {!order ? (
            <section className="co-card co-empty">
              <h2>No order to show</h2>
              <p>Place an order from your cart and the confirmation will appear here.</p>
              <Link to="/cart" className="co-text-btn">
                Return to cart
              </Link>
            </section>
          ) : (
            <section className="co-card co-confirm-card">
              <span className="co-confirm-mark">
                <Check size={22} strokeWidth={2.4} />
              </span>
              <h1>Thank you</h1>
              <p className="co-confirm-lead">
                Order <strong>{order.id}</strong> is confirmed for {order.contact.email}.
              </p>
              <ul className="co-confirm-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    <img src={item.image} alt="" />
                    <span>
                      {item.title}
                      <small>
                        Qty {item.qty}
                      </small>
                    </span>
                    <strong>{formatMoney(item.unitPrice * item.qty, item.currency)}</strong>
                  </li>
                ))}
              </ul>
              <dl className="co-confirm-meta">
                <div>
                  <dt>Ship to</dt>
                  <dd>{addressSummary(order.address)}</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{methodLabel[order.paymentMethod] || 'Card'}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>
                    {order.totals.map((group) => formatMoney(group.total, group.currency)).join(' · ')}
                  </dd>
                </div>
              </dl>
              <Link to="/collections" className="co-cta">
                Continue Shopping
              </Link>
            </section>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default OrderConfirmed;
