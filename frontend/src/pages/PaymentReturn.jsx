import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useCart } from '../context/CartContext';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { completeCashfreePayment } = useCart();
  const [error, setError] = useState('');
  const startedRef = useRef(false);
  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';

  useEffect(() => {
    if (startedRef.current) return undefined;
    if (!orderId) {
      setError('Missing Cashfree order id. Return to cart and try again.');
      return undefined;
    }

    startedRef.current = true;
    let cancelled = false;

    completeCashfreePayment(orderId)
      .then(() => {
        if (!cancelled) navigate('/checkout/confirmation', { replace: true });
      })
      .catch((err) => {
        if (cancelled) return;
        startedRef.current = false;
        const message =
          err.response?.data?.message || err.message || 'Payment could not be verified.';
        setError(message);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, completeCashfreePayment, navigate]);

  return (
    <div className="storefront co-page">
      <StoreHeader />
      <main className="co-main">
        <div className="store-container">
          <section className="co-card co-empty">
            {error ? (
              <>
                <h2>Payment not confirmed</h2>
                <p>{error}</p>
                <Link to="/checkout/payment" className="co-text-btn">
                  Try payment again
                </Link>
              </>
            ) : (
              <>
                <h2>Confirming Cashfree payment…</h2>
                <p>Please wait while we verify your payment with Cashfree.</p>
              </>
            )}
          </section>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default PaymentReturn;
