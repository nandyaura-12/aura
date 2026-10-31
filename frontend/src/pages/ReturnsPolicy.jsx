import React from 'react';
import { Link } from 'react-router-dom';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import '../styles/pages/storefront.css';
import '../styles/pages/ReturnsPolicy.css';

const ReturnsPolicy = () => {
  return (
    <div className="storefront">
      <StoreHeader />

      <main className="returns-page">
        <div className="store-container">
          <header className="returns-hero">
            <p className="returns-eyebrow">Customer care</p>
            <h1>Returns &amp; Policy</h1>
            <p>
              Clear guidelines for returns, exchanges, shipping, and care — so every Nandys Aura
              piece arrives and stays as beautiful as intended.
            </p>
          </header>

          <div className="returns-grid">
            <section className="returns-block">
              <h2>7-Day Easy Return</h2>
              <ul>
                <li>Return unused items within 7 days of delivery.</li>
                <li>Pieces must be in original condition with tags and packaging.</li>
                <li>Earrings worn for hygiene reasons are exchange-only when sealed packing is intact.</li>
                <li>Start a return from your account orders or contact our care team.</li>
              </ul>
            </section>

            <section className="returns-block">
              <h2>Exchanges</h2>
              <ul>
                <li>Size or style exchanges are available while stock lasts.</li>
                <li>Exchange requests should be raised within 7 days of delivery.</li>
                <li>Price difference (if any) is settled before the replacement ships.</li>
              </ul>
            </section>

            <section className="returns-block">
              <h2>Shipping</h2>
              <ul>
                <li>Free standard shipping across India on eligible orders.</li>
                <li>Typical delivery window: 3–5 business days after dispatch.</li>
                <li>Orders are packed in protective gift-ready packaging.</li>
                <li>You will receive tracking details once the order ships.</li>
              </ul>
            </section>

            <section className="returns-block">
              <h2>Refunds</h2>
              <ul>
                <li>Approved refunds are processed to the original payment method.</li>
                <li>Refund timelines usually take 5–7 business days after pickup and QC.</li>
                <li>COD refunds (where applicable) are issued via bank transfer after verification.</li>
              </ul>
            </section>

            <section className="returns-block">
              <h2>Care &amp; Warranty</h2>
              <ul>
                <li>Keep antique-finish jewellery away from water, perfume, and chemicals.</li>
                <li>Wipe gently with a soft dry cloth after wear.</li>
                <li>Store in the pouch provided to preserve the matte finish.</li>
                <li>Manufacturing defects reported within 7 days are replaced or refunded.</li>
              </ul>
            </section>

            <section className="returns-block">
              <h2>Non-returnable</h2>
              <ul>
                <li>Custom or made-to-order pieces.</li>
                <li>Items damaged due to misuse or improper care.</li>
                <li>Products without original packaging or proof of purchase.</li>
              </ul>
            </section>
          </div>

          <div className="returns-cta">
            <p>Need help with an order?</p>
            <div className="returns-cta__actions">
              <Link to="/contact" className="returns-btn">
                Contact us
              </Link>
              <Link to="/account" className="returns-btn returns-btn--ghost">
                View my orders
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
};

export default ReturnsPolicy;
