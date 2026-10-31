import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MapPin } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import OrderSummary from '../components/checkout/OrderSummary';
import { addressSummary } from '../data/checkout';
import { useCart } from '../context/CartContext';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const METHODS = [
  { id: 'card', label: 'Card' },
  { id: 'upi', label: 'UPI' },
  { id: 'paypal', label: 'PayPal' },
];

const UPI_APPS = [
  { id: 'gpay', label: 'G Pay', mark: 'co-gpay' },
  { id: 'phonepe', label: 'PhonePe', mark: 'co-phonepe' },
  { id: 'paytm', label: 'paytm', mark: 'co-paytm' },
  { id: 'bhim', label: 'BHIM', mark: 'co-bhim' },
];

const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

const QrMark = () => {
  const cells = [
    '111111100101111111',
    '100000101001000001',
    '101110101111011101',
    '101110100010011101',
    '101110101101011101',
    '100000101000000001',
    '111111101010111111',
    '000000001101000000',
    '110111101011101011',
    '011010010110010110',
    '101101110001111010',
    '010011101110100101',
    '111010010101011011',
    '000000001011101000',
    '111111101000111101',
    '100000101110100011',
    '101110100101011110',
    '101110101011000101',
    '101110100110111001',
    '100000101001010110',
    '111111101110101011',
  ];

  return (
    <svg viewBox="0 0 21 21" className="co-qr-svg" role="img" aria-label="UPI payment code">
      {cells.map((row, y) =>
        row.split('').map((bit, x) =>
          bit === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null
        )
      )}
    </svg>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const {
    items,
    selectedAddress,
    contact,
    paymentMethod,
    upiApp,
    upiId,
    upiVerified,
    card,
    billingSame,
    billing,
    setPayment,
    setCard,
    placeOrder,
  } = useCart();
  const [error, setError] = useState('');
  const [upiNote, setUpiNote] = useState('');
  const [placing, setPlacing] = useState(false);

  const verifyUpi = () => {
    const valid = /^[\w.-]{2,}@[\w.-]{2,}$/.test(upiId.trim());
    setPayment({ upiVerified: valid });
    setUpiNote(valid ? 'UPI ID verified' : 'Enter a UPI ID such as name@okaxis');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      const digits = card.number.replace(/\s/g, '');
      const expiry = card.expiry.replace(/\s/g, '');
      if (digits.length < 16 || !card.name.trim() || !/^\d{2}\/\d{2}$/.test(expiry) || card.cvc.length < 3) {
        setError('Enter the card number, name, expiry, and CVC to place the order.');
        return;
      }
    }
    if (paymentMethod === 'upi') {
      const typedId = upiId.trim();
      if (typedId && !upiVerified) {
        setError('Verify your UPI ID before placing the order.');
        return;
      }
      if (!upiApp && !upiVerified) {
        setError('Choose a UPI app or verify a UPI ID.');
        return;
      }
    }
    if (!billingSame && (!billing.street.trim() || !billing.city.trim() || !billing.zip.trim())) {
      setError('Add a billing street, city, and ZIP, or use the shipping address.');
      return;
    }
    setError('');
    setPlacing(true);
    try {
      await placeOrder();
      navigate('/checkout/confirmation');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'The order could not be saved.';
      setError(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="storefront co-page">
      <StoreHeader />
      <main className="co-main">
        <div className="store-container">
          <header className="co-top">
            <h1>Payment</h1>
            <CheckoutStepper current="payment" />
          </header>

          <Link to="/checkout/shipping" className="co-back">
            <ArrowLeft size={15} />
            Return to Shipping
          </Link>

          {items.length === 0 || !selectedAddress ? (
            <section className="co-card co-empty">
              <h2>Checkout isn’t ready</h2>
              <p>Add something to your cart and choose a shipping address first.</p>
              <Link to="/cart" className="co-text-btn">
                Return to cart
              </Link>
            </section>
          ) : (
            <>
              <div className="co-grid">
                <div className="co-primary">
                  <section className="co-ship-banner">
                    <MapPin size={16} />
                    <span>
                      <strong>Ship to</strong>
                      {addressSummary(selectedAddress)}
                    </span>
                    <Link to="/checkout/shipping">Change</Link>
                  </section>

                  <section className="co-card">
                    <h2 className="co-card-title">Payment Method</h2>
                    <div className="co-methods" role="tablist" aria-label="Payment method">
                      {METHODS.map((method) => {
                        const selected = paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            className={`co-method${selected ? ' is-selected' : ''}`}
                            onClick={() => {
                              setPayment({ paymentMethod: method.id });
                              setError('');
                            }}
                          >
                            {selected && (
                              <span className="co-method-check">
                                <Check size={12} strokeWidth={2.6} />
                              </span>
                            )}
                            {method.id === 'card' && (
                              <span className="co-marks">
                                <span className="co-visa">VISA</span>
                                <span className="co-mc" aria-hidden="true" />
                              </span>
                            )}
                            {method.id === 'upi' && <span className="co-upi-word">UPI</span>}
                            {method.id === 'paypal' && <span className="co-paypal">PayPal</span>}
                            <span className="co-method-label">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="co-card-form">
                        <div className="co-plastic" aria-hidden="true">
                          <span className="co-plastic-dots">•••• ••••</span>
                          <span>MOSS VELVET</span>
                        </div>
                        <div className="co-card-fields">
                          <label className="co-field">
                            <span>Card number</span>
                            <input
                              className="co-input"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="1234 5678 9012 3456"
                              value={card.number}
                              onChange={(event) => setCard({ number: formatCardNumber(event.target.value) })}
                            />
                          </label>
                          <label className="co-field">
                            <span>Name on card</span>
                            <input
                              className="co-input"
                              autoComplete="cc-name"
                              placeholder="Amelia Hart"
                              value={card.name}
                              onChange={(event) => setCard({ name: event.target.value })}
                            />
                          </label>
                          <div className="co-split">
                            <label className="co-field">
                              <span>Expiry</span>
                              <input
                                className="co-input"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                placeholder="MM / YY"
                                value={card.expiry}
                                onChange={(event) => setCard({ expiry: formatExpiry(event.target.value) })}
                              />
                            </label>
                            <label className="co-field">
                              <span>CVC</span>
                              <input
                                className="co-input"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                placeholder="123"
                                value={card.cvc}
                                onChange={(event) =>
                                  setCard({ cvc: event.target.value.replace(/\D/g, '').slice(0, 4) })
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="co-upi">
                        <div>
                          <p className="co-upi-heading">Pay with your UPI app</p>
                          <div className="co-upi-apps">
                            {UPI_APPS.map((app) => (
                              <button
                                key={app.id}
                                type="button"
                                className={`co-upi-app${upiApp === app.id ? ' is-selected' : ''}`}
                                onClick={() => setPayment({ upiApp: app.id })}
                                aria-pressed={upiApp === app.id}
                              >
                                <span className={`co-upi-radio${upiApp === app.id ? ' is-on' : ''}`} />
                                <span className={app.mark}>{app.label}</span>
                              </button>
                            ))}
                          </div>
                          <p className="co-or">or enter UPI ID</p>
                          <div className="co-upi-row">
                            <input
                              className="co-input"
                              value={upiId}
                              onChange={(event) => {
                                setPayment({ upiId: event.target.value, upiVerified: false });
                                setUpiNote('');
                              }}
                              placeholder="yourname@okaxis"
                              aria-label="UPI ID"
                            />
                            <button type="button" className="co-verify" onClick={verifyUpi}>
                              {upiVerified ? 'Verified' : 'Verify'}
                            </button>
                          </div>
                          {upiNote && (
                            <p className={`co-promo-note ${upiVerified ? 'is-ok' : 'is-error'}`}>{upiNote}</p>
                          )}
                        </div>
                        <div className="co-qr">
                          <QrMark />
                          <strong>Scan to pay</strong>
                          <span>Use any UPI app</span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <p className="co-paypal-note">
                        PayPal is selected for {contact.email}. Card details stay off this page.
                      </p>
                    )}

                    {error && <p className="co-error">{error}</p>}
                  </section>

                  <section className="co-card co-billing">
                    <label className="co-check co-check-round">
                      <input
                        type="checkbox"
                        checked={billingSame}
                        onChange={(event) => setPayment({ billingSame: event.target.checked })}
                      />
                      Billing address same as shipping
                    </label>
                    {!billingSame && (
                      <div className="co-billing-fields">
                        <input
                          className="co-input"
                          value={billing.street}
                          onChange={(event) =>
                            setPayment({ billing: { ...billing, street: event.target.value } })
                          }
                          placeholder="Street address"
                          aria-label="Billing street address"
                        />
                        <div className="co-city-row">
                          <input
                            className="co-input"
                            value={billing.city}
                            onChange={(event) =>
                              setPayment({ billing: { ...billing, city: event.target.value } })
                            }
                            placeholder="City"
                            aria-label="Billing city"
                          />
                          <input
                            className="co-input"
                            value={billing.state}
                            onChange={(event) =>
                              setPayment({ billing: { ...billing, state: event.target.value } })
                            }
                            placeholder="State"
                            aria-label="Billing state"
                          />
                          <input
                            className="co-input"
                            value={billing.zip}
                            onChange={(event) =>
                              setPayment({ billing: { ...billing, zip: event.target.value } })
                            }
                            placeholder="ZIP"
                            aria-label="Billing ZIP"
                          />
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <OrderSummary
                  variant="review"
                  cta={placing ? 'Placing Order' : 'Place Order'}
                  onCta={handlePlaceOrder}
                  disabled={placing}
                />
              </div>

              <div className="co-pay-logos" aria-label="Accepted payment methods">
                <span className="co-visa">VISA</span>
                <span className="co-mc" aria-hidden="true" />
                <span className="co-upi-word">UPI</span>
                <span className="co-paypal">PayPal</span>
              </div>
            </>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default Payment;
