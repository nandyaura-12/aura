import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import OrderSummary from '../components/checkout/OrderSummary';
import { addressLines, emptyAddress } from '../data/checkout';
import { useCart } from '../context/CartContext';
import '../styles/pages/storefront.css';
import '../styles/pages/Checkout.css';

const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const Shipping = () => {
  const navigate = useNavigate();
  const {
    items,
    contact,
    setContact,
    addresses,
    selectedAddressId,
    selectAddress,
    saveAddress,
  } = useCart();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyAddress);
  const [formError, setFormError] = useState('');
  const [contactError, setContactError] = useState('');

  const openNew = () => {
    setEditingId(null);
    setDraft(emptyAddress);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (address) => {
    setEditingId(address.id);
    setDraft({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setFormError('');
    setFormOpen(true);
  };

  const updateDraft = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const required = ['label', 'firstName', 'lastName', 'street', 'city', 'state', 'zip', 'phone'];
    const missing = required.some((key) => !String(draft[key]).trim());
    if (missing) {
      setFormError('Fill in every field except apartment.');
      return;
    }
    saveAddress(
      {
        ...draft,
        label: draft.label.trim(),
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        street: draft.street.trim(),
        apartment: draft.apartment.trim(),
        city: draft.city.trim(),
        state: draft.state.trim().toUpperCase(),
        zip: draft.zip.trim(),
        phone: draft.phone.trim(),
      },
      editingId
    );
    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyAddress);
    setFormError('');
  };

  const handleContinue = () => {
    if (!emailOk(contact.email)) {
      setContactError('Enter a valid email for this order.');
      return;
    }
    if (!selectedAddressId) {
      setContactError('Choose a shipping address to continue.');
      return;
    }
    setContactError('');
    navigate('/checkout/payment');
  };

  return (
    <div className="storefront co-page">
      <StoreHeader />
      <main className="co-main">
        <div className="store-container">
          <header className="co-top">
            <h1>Shipping</h1>
            <CheckoutStepper current="shipping" />
          </header>

          <Link to="/cart" className="co-back">
            <ArrowLeft size={15} />
            Return to Cart
          </Link>

          {items.length === 0 ? (
            <section className="co-card co-empty">
              <h2>Your cart is empty</h2>
              <p>Add a piece before choosing a shipping address.</p>
              <Link to="/cart" className="co-text-btn">
                Return to cart
              </Link>
            </section>
          ) : (
            <div className="co-grid">
              <div className="co-primary">
                <section className="co-card">
                  <h2 className="co-card-title">Contact</h2>
                  <div className="co-split">
                    <label className="co-field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(event) => setContact({ email: event.target.value })}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </label>
                    <label className="co-field">
                      <span>Phone</span>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(event) => setContact({ phone: event.target.value })}
                        placeholder="+1 (555) 000-0000"
                        autoComplete="tel"
                      />
                    </label>
                  </div>
                  {contactError && <p className="co-error">{contactError}</p>}
                </section>

                <section className="co-card">
                  <div className="co-card-head">
                    <h2 className="co-card-title">Shipping Address</h2>
                    <button type="button" className="co-add-link" onClick={openNew}>
                      <Plus size={14} />
                      Add new
                    </button>
                  </div>
                  <div className="co-address-grid">
                    {addresses.map((address) => {
                      const lines = addressLines(address);
                      const selected = address.id === selectedAddressId;
                      return (
                        <article
                          key={address.id}
                          className={`co-address${selected ? ' is-selected' : ''}`}
                        >
                          <button
                            type="button"
                            className="co-address-select"
                            onClick={() => selectAddress(address.id)}
                            aria-pressed={selected}
                          >
                            <span className="co-radio" aria-hidden="true" />
                            <span>
                              <span className="co-address-label">
                                {address.label}
                                {address.isDefault && <em>Default</em>}
                              </span>
                              <span className="co-address-lines">
                                {lines.name} {lines.street}
                                <br />
                                {lines.city}
                                <br />
                                {lines.phone}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="co-edit"
                            onClick={() => openEdit(address)}
                          >
                            Edit
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>

                {formOpen && (
                  <form className="co-card co-address-form" onSubmit={handleSave}>
                    <h2 className="co-card-title">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                    <p className="co-card-sub">Save a new destination for your deliveries.</p>

                    <label className="co-field">
                      <span>Address label</span>
                      <input
                        value={draft.label}
                        onChange={(event) => updateDraft('label', event.target.value)}
                        placeholder="Home, Studio, Office"
                      />
                    </label>

                    <div className="co-split">
                      <label className="co-field">
                        <span>First name</span>
                        <input
                          className="co-input"
                          value={draft.firstName}
                          onChange={(event) => updateDraft('firstName', event.target.value)}
                          autoComplete="given-name"
                        />
                      </label>
                      <label className="co-field">
                        <span>Last name</span>
                        <input
                          className="co-input"
                          value={draft.lastName}
                          onChange={(event) => updateDraft('lastName', event.target.value)}
                          autoComplete="family-name"
                        />
                      </label>
                    </div>
                    <label className="co-field">
                      <span>Street address</span>
                      <input
                        className="co-input"
                        value={draft.street}
                        onChange={(event) => updateDraft('street', event.target.value)}
                        autoComplete="address-line1"
                      />
                    </label>
                    <label className="co-field">
                      <span>Apartment, suite (optional)</span>
                      <input
                        className="co-input"
                        value={draft.apartment}
                        onChange={(event) => updateDraft('apartment', event.target.value)}
                        autoComplete="address-line2"
                      />
                    </label>
                    <div className="co-city-row">
                      <label className="co-field">
                        <span>City</span>
                        <input
                          className="co-input"
                          value={draft.city}
                          onChange={(event) => updateDraft('city', event.target.value)}
                          autoComplete="address-level2"
                        />
                      </label>
                      <label className="co-field">
                        <span>State</span>
                        <input
                          className="co-input"
                          value={draft.state}
                          onChange={(event) => updateDraft('state', event.target.value)}
                          autoComplete="address-level1"
                        />
                      </label>
                      <label className="co-field">
                        <span>ZIP</span>
                        <input
                          className="co-input"
                          value={draft.zip}
                          onChange={(event) => updateDraft('zip', event.target.value)}
                          autoComplete="postal-code"
                        />
                      </label>
                    </div>
                    <label className="co-field">
                      <span>Phone</span>
                      <input
                        className="co-input"
                        type="tel"
                        value={draft.phone}
                        onChange={(event) => updateDraft('phone', event.target.value)}
                        autoComplete="tel"
                      />
                    </label>

                    <label className="co-check">
                      <input
                        type="checkbox"
                        checked={draft.isDefault}
                        onChange={(event) => updateDraft('isDefault', event.target.checked)}
                      />
                      Set as default address
                    </label>

                    {formError && <p className="co-error">{formError}</p>}

                    <div className="co-form-actions">
                      <button
                        type="button"
                        className="co-cancel"
                        onClick={() => {
                          setFormOpen(false);
                          setFormError('');
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="co-save">
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <OrderSummary variant="review" cta="Continue to Payment" onCta={handleContinue} />
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default Shipping;
