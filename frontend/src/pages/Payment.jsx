import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, MapPin, ShieldCheck } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import OrderSummary from '../components/checkout/OrderSummary';
import { addressSummary } from '../data/checkout';
import { useCart } from '../context/CartContext';
import { openCashfreeCheckout } from '../lib/cashfree';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const Payment = () => {
  const {
    items,
    selectedAddress,
    billingSame,
    billing,
    setPayment,
    startCashfreePayment,
  } = useCart();
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const handlePayWithCashfree = async () => {
    if (!billingSame && (!billing.street.trim() || !billing.city.trim() || !billing.zip.trim())) {
      setError('Add a billing street, city, and ZIP, or use the shipping address.');
      return;
    }

    setError('');
    setPaying(true);
    try {
      const session = await startCashfreePayment();
      await openCashfreeCheckout({
        paymentSessionId: session.paymentSessionId,
        mode: session.mode || 'sandbox',
      });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Cashfree checkout could not be started.';
      setError(message);
      setPaying(false);
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
                      <button type="button" role="tab" aria-selected className="co-method is-selected">
                        <span className="co-method-check">
                          <Check size={12} strokeWidth={2.6} />
                        </span>
                        <span className="co-paypal">Cashfree</span>
                        <span className="co-method-label">UPI · Cards · Netbanking</span>
                      </button>
                    </div>

                    <div className="co-paypal-note" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <strong>Pay securely with Cashfree</strong>
                        <p style={{ margin: '0.35rem 0 0', opacity: 0.85 }}>
                          You’ll be redirected to Cashfree’s checkout to pay with UPI, credit/debit card,
                          or netbanking. Your order is confirmed only after payment succeeds.
                        </p>
                      </div>
                    </div>

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
                  cta={paying ? 'Opening Cashfree…' : 'Pay with Cashfree'}
                  onCta={handlePayWithCashfree}
                  disabled={paying}
                />
              </div>

              <div className="co-pay-logos" aria-label="Accepted payment methods">
                <span className="co-upi-word">UPI</span>
                <span className="co-visa">VISA</span>
                <span className="co-mc" aria-hidden="true" />
                <span className="co-paypal">Cashfree</span>
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
