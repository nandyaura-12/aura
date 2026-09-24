import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight, Star, Recycle, Hand, Award } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import {
  hero,
  categories,
  collections,
  featured,
  bestSellers,
  curated,
  grace,
  testimonials,
} from '../data/images';

const Home = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const sellersViewportRef = useRef(null);

  const scrollSellers = (direction) => {
    const viewport = sellersViewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector('.stagger-card');
    if (!card) return;
    const styles = window.getComputedStyle(viewport.querySelector('.stagger-track'));
    const gap = parseFloat(styles.gap) || 22;
    const step = card.getBoundingClientRect().width + gap;
    viewport.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  const nextTestimonial = () =>
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () =>
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const visibleTestimonials = [
    testimonials[testimonialIndex],
    testimonials[(testimonialIndex + 1) % testimonials.length],
    testimonials[(testimonialIndex + 2) % testimonials.length],
  ];

  return (
    <div className="storefront">
      <StoreHeader />

      {/* Hero */}
      <section className="hero">
        <img src={hero.main} alt="Woman wearing layered gold chains" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            <span>Discover</span>
            <em>Your Sparkles</em>
          </h1>
          <p className="hero-copy">
            <span>Discover beautifully crafted pieces designed to celebrate every moment—from</span>
            <span>everyday elegance to unforgettable occasions.</span>
          </p>
          <Link to="/collections" className="hero-cta">
            Explore Collections
          </Link>
        </div>
        <div className="hero-thumbs">
          <img src={hero.thumb1} alt="Green gemstone necklace" />
          <img src={hero.thumb2} alt="Pearl flower earring" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section category-section" id="shop">
        <div className="store-container">
          <h2 className="section-title center">Shop By Category</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <a key={cat.name} href="#collections" className="category-card">
                <img src={cat.image} alt={cat.name} />
                <span>{cat.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sophisticated Collections */}
      <section className="section collections-section" id="collections">
        <div className="store-container">
          <div className="section-head center collections-head">
            <span className="pill">New Arrivals</span>
            <h2 className="section-title collections-title">
              Sophisticated Collections for
              <br />
              Every Moment
            </h2>
            <Link to="/collections" className="text-link collections-link">
              View All Collections <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="collections-mosaic">
            {collections.map((item) => (
              <figure key={item.slot} className={`mosaic-cell mosaic-${item.slot}`}>
                <img src={item.image} alt={item.alt} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Creating Crafting & Wearing */}
      <section className="section featured-section" id="featured">
        <div className="store-container">
          <div className="section-head row">
            <div>
              <span className="pill">Featured Collections</span>
              <h2 className="section-title">Creating, Crafting &amp; Wearing.</h2>
            </div>
            <a href="#bestsellers" className="text-link underline">
              VIEW COLLECTION
            </a>
          </div>
          <div className="product-row">
            {featured.map((item) => (
              <article key={item.name} className="product-card">
                <img src={item.image} alt={item.name} />
                <div className="product-meta">
                  <span>{item.name}</span>
                  <strong>{item.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section bestsellers-section" id="bestsellers">
        <div className="store-container">
          <div className="section-head row">
            <div>
              <span className="pill">Best Sellers</span>
              <h2 className="section-title bestsellers-title">
                <span>Explore pieces that blend modern</span>
                <span>design with classic beauty</span>
              </h2>
            </div>
            <div className="carousel-nav">
              <button
                type="button"
                className="nav-circle outline"
                aria-label="Previous"
                onClick={() => scrollSellers(-1)}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="nav-circle solid"
                aria-label="Next"
                onClick={() => scrollSellers(1)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="bestsellers-viewport" ref={sellersViewportRef}>
            <div className="stagger-track">
              {bestSellers.map((item, i) => (
                <article
                  key={`${item.name}-${i}`}
                  className={`stagger-card ${item.tall ? 'tall' : ''} ${i % 2 === 1 ? 'offset-1' : ''}`}
                >
                  <div className="stagger-meta">
                    <div>
                      <h3>{item.name}</h3>
                      <span className="rating">
                        <Star size={14} fill="#E8B923" stroke="none" /> {item.rating}
                      </span>
                    </div>
                    <strong>{item.price}</strong>
                  </div>
                  <img src={item.image} alt={item.name} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grace in Every Detail */}
      <section className="grace-section" id="about">
        <div className="store-container grace-grid">
          <div className="grace-image">
            <img src={grace.image} alt="Hand chain bracelet on champagne silk" />
          </div>
          <div className="grace-copy">
            <p className="eyebrow">HAND CHAIN BRACELET</p>
            <h2>
              Grace in Every
              <br />
              Detail
            </h2>
            <p>
              A delicate gold chain flows from wrist to finger, accented with a filigree centerpiece
              and softly colored charms. A graceful finishing touch for every occasion.
            </p>
            <a href="#curated" className="text-link light">
              EXPLORE MORE →
            </a>
          </div>
        </div>
      </section>

      {/* Curated Essentials */}
      <section className="section curated-section" id="curated">
        <div className="store-container">
          <h2 className="section-title">Curated Essentials</h2>
          <p className="section-sub">Foundation pieces meant to be layered, lived in, and loved.</p>
          <div className="curated-grid">
            {curated.map((item, i) => (
              <article key={item.name} className={`curated-card h-${i}`}>
                <img src={item.image} alt={item.name} />
                <div className="product-meta">
                  <span>{item.name}</span>
                  <strong>{item.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-section">
        <div className="store-container trust-grid">
          <div className="trust-item">
            <Recycle size={28} strokeWidth={1.25} />
            <h3>ETHICAL SOURCING</h3>
            <p>Responsibly sourced materials chosen with care for people and planet.</p>
          </div>
          <div className="trust-item">
            <Hand size={28} strokeWidth={1.25} />
            <h3>MASTER CRAFTSMANSHIP</h3>
            <p>Hand-finished details that honour tradition and modern design.</p>
          </div>
          <div className="trust-item">
            <Award size={28} strokeWidth={1.25} />
            <h3>LIFETIME WARRANTY</h3>
            <p>Pieces built to last—backed by our lifetime care promise.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="store-container">
          <div className="section-head center">
            <span className="pill">Valuable Insights</span>
            <h2 className="section-title">User feedback</h2>
            <p className="section-sub">
              Discover our community of clients who celebrate every sparkle with us.
            </p>
          </div>
          <div className="testimonial-grid">
            {visibleTestimonials.map((t) => (
              <article key={t.name} className="testimonial-card">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <div className="testimonial-user">
                  <img src={t.avatar} alt={t.name} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
                <span className="quote-mark">“</span>
                <p>{t.quote}</p>
              </article>
            ))}
          </div>
          <div className="carousel-nav center-nav">
            <button type="button" className="nav-circle outline" onClick={prevTestimonial} aria-label="Previous">
              <ArrowLeft size={18} />
            </button>
            <button type="button" className="nav-circle solid" onClick={nextTestimonial} aria-label="Next">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default Home;
