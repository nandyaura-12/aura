import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Lock } from 'lucide-react';
import { formatMoney } from '../../data/checkout';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({
  variant = 'cart',
  cta,
  ctaTo,
  onCta,
  showPromo = false,
  showGift = false,
  disabled = false,
}) => {
  const { items, totals, promoCode, applyPromo, clearPromo } = useCart();
  const [code, setCode] = useState(promoCode);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('');

  const handlePromo = (event) => {
    event.preventDefault();
    if (promoCode) {
      clearPromo();
      setCode('');
      setMessage('');
      setMessageTone('');
      return;
    }
    const error = applyPromo(code);
    if (error) {
      setMessage(error);
      setMessageTone('error');
      return;
    }
    setMessage('Offer applied');
    setMessageTone('ok');
  };

  const ctaDisabled = disabled || items.length === 0;
  const ctaClass = `co-cta${ctaDisabled ? ' is-disabled' : ''}`;

  return (
    <aside className="co-summary">
      <h2>Order Summary</h2>

      {variant === 'review' && items.length > 0 && (
        <ul className="co-summary-items">
          {items.map((item) => (
            <li key={item.id}>
              <div className="co-summary-thumb">
                <img src={item.image} alt="" />
                <span className="co-qty-badge">{item.qty}</span>
              </div>
              <div>
                <p className="co-summary-title">{item.title}</p>
                <p className="co-summary-meta">{item.meta}</p>
              </div>
              <span className="co-summary-price">
                {formatMoney(item.unitPrice * item.qty, item.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {totals.length === 0 && (
        <p className="co-summary-empty">Your cart is empty.</p>
      )}

      {totals.map((group) => (
        <div key={group.currency} className="co-figures">
          <div className="co-figure">
            <span>Subtotal ({group.count} {group.count === 1 ? 'item' : 'items'})</span>
            <strong>{formatMoney(group.subtotal, group.currency)}</strong>
          </div>
          <div className="co-figure">
            <span>Shipping</span>
            <strong className="co-free">Free</strong>
          </div>
          {group.discount > 0 && (
            <div className="co-figure">
              <span>Discount ({promoCode})</span>
              <strong className="co-tax">-{formatMoney(group.discount, group.currency)}</strong>
            </div>
          )}
          <div className="co-figure">
            <span>Estimated Tax</span>
            <strong className="co-tax">{formatMoney(group.tax, group.currency)}</strong>
          </div>

          {showPromo && (
            <form className="co-promo" onSubmit={handlePromo}>
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Promo code"
                aria-label="Promo code"
              />
              <button type="submit">{promoCode ? 'Remove' : 'Apply'}</button>
              {message && <p className={`co-promo-note is-${messageTone}`}>{message}</p>}
            </form>
          )}

          <div className="co-figure co-total">
            <span>Total</span>
            <strong>{formatMoney(group.total, group.currency)}</strong>
          </div>
        </div>
      ))}

      {ctaTo && !ctaDisabled ? (
        <Link to={ctaTo} className={ctaClass}>
          {cta}
        </Link>
      ) : (
        <button type="button" className={ctaClass} onClick={onCta} disabled={ctaDisabled}>
          {cta}
        </button>
      )}

      <p className="co-assurance">
        <Lock size={14} strokeWidth={1.75} />
        Secure checkout, encrypted payment
      </p>
      {showGift && (
        <p className="co-assurance">
          <Gift size={14} strokeWidth={1.75} />
          Free insured delivery in a signature gift box
        </p>
      )}
    </aside>
  );
};

export default OrderSummary;
