import React, { useState } from 'react';
import { Instagram, Facebook, Linkedin, ChevronDown } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import '../styles/pages/storefront.css';
import '../styles/pages/Contact.css';

const SUBJECTS = [
  'Product enquiry',
  'Custom design',
  'Order support',
  'Repairs & resizing',
  'Feedback',
];

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-pin-icon">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21c-1.2-1.1-2-2.6-2.2-4.2-.1-.6 0-1.3.2-1.9.4-1.1 1.5-4.6.2-6.1-1.6-1.8-4.6-.3-4.2 2.5.2 1.2.9 2 1 3.2.1 1.6-1 3.1-2.5 3.4C2.6 18.2 2 16.2 2 14.2 2 9.2 6.2 5 11.6 5c4.6 0 8.4 3.3 8.4 8.1 0 4.6-2.8 7.9-6.5 7.9-1.2 0-2.4-.6-2.8-1.6"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      d="M10.2 21.2c.6-2.1 1.6-5.4 2.1-7.2"
    />
  </svg>
);

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.subject) next.subject = 'Please choose a subject.';
    if (!form.message.trim()) next.message = 'Please write a message.';
    return next;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSent(true);
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSent(false);
  };

  return (
    <div className="storefront contact-page">
      <StoreHeader />

      <main className="contact-main">
        <div className="store-container">
          <header className="contact-hero">
            <h1 className="contact-title">
              Contact <em>Us</em>
            </h1>
            <p className="contact-lead">
              We&apos;re here to help! Whether you have questions, feedback, or need support, our
              team is ready to assist you.
            </p>
          </header>

          <section className="contact-card" aria-labelledby="contact-heading">
            <div className="contact-info">
              <h2 id="contact-heading" className="contact-info-title">
                Get in <em>touch</em>
              </h2>

              <div className="contact-detail">
                <span>Email:</span>
                <a href="mailto:hello@nandysaura.com">hello@nandysaura.com</a>
              </div>

              <div className="contact-detail">
                <span>Phone:</span>
                <a href="tel:+914448500321">+91 44 4850 0321</a>
              </div>

              <div className="contact-social">
                <span>Follow Us</span>
                <div className="contact-social-row">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Instagram size={16} strokeWidth={1.6} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                    <Facebook size={16} strokeWidth={1.6} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={16} strokeWidth={1.6} />
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                    <PinterestIcon />
                  </a>
                </div>
              </div>
            </div>

            {sent ? (
              <div className="contact-success" role="status">
                <h3>Message sent</h3>
                <p>
                  Thank you, {form.name.trim().split(' ')[0]}. We&apos;ll reply to {form.email.trim()} shortly.
                </p>
                <button type="button" className="contact-submit" onClick={reset}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-row">
                  <label className="contact-field">
                    <span>Full name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={update('name')}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <small>{errors.name}</small>}
                  </label>

                  <label className="contact-field">
                    <span>Email address</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Your email address"
                      value={form.email}
                      onChange={update('email')}
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </label>
                </div>

                <div className="contact-row">
                  <label className="contact-field">
                    <span>Phone number (optional)</span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+91 44 4850 0000"
                      value={form.phone}
                      onChange={update('phone')}
                    />
                  </label>

                  <label className="contact-field">
                    <span>Enquiry subject</span>
                    <span className="contact-select-wrap">
                      <select
                        name="subject"
                        className={form.subject ? 'has-value' : ''}
                        value={form.subject}
                        onChange={update('subject')}
                        aria-invalid={Boolean(errors.subject)}
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {errors.subject && <small>{errors.subject}</small>}
                  </label>
                </div>

                <label className="contact-field">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Write something..."
                    value={form.message}
                    onChange={update('message')}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <small>{errors.message}</small>}
                </label>

                <button type="submit" className="contact-submit">
                  SEND MESSAGE
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
};

export default Contact;
