import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight, Star, Recycle, Hand, Award } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import {
  hero,
  categories as staticCategories,
  collections,
  featured as staticFeatured,
  bestSellers as staticBestSellers,
  curated as staticCurated,
  grace,
  testimonials,
  jewellery,
} from '../data/images';
import { formatInr } from '../data/catalog';
import { fetchCategories, fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Home.css';

const Home = () => {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [categories, setCategories] = useState(staticCategories);
  const [featured, setFeatured] = useState(staticFeatured);
  const [bestSellers, setBestSellers] = useState(staticBestSellers);
  const [curated, setCurated] = useState(staticCurated);
  const sellersViewportRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([fetchProducts(), fetchCategories()]).then(([productResult, categoryResult]) => {
      if (cancelled) return;

      if (productResult.status === 'fulfilled') {
        const active = (productResult.value.data || []).filter((product) => product.status === 'Active');
        if (active.length) {
          const cards = active.map((product, index) => ({
            name: product.name,
            price: formatInr(product.discountPrice > 0 ? product.discountPrice : product.price),
            image: product.images?.[0] || jewellery.img01,
            slug: product.slug,
            rating: '4.9',
            tall: index % 2 === 0,
          }));
          setFeatured(cards.slice(0, 4));
          setBestSellers(cards);
          setCurated(cards.slice(0, 4));
        }
      }

      if (categoryResult.status === 'fulfilled') {
        const activeCategories = (categoryResult.value.data || []).filter(
          (category) => category.status !== 'Inactive'
        );
        if (activeCategories.length) {
          setCategories(
            activeCategories.map((category) => ({
              name: category.name,
              image: category.image || jewellery.img05,
            }))
          );
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
              <Link key={cat.name} to="/collections" className="category-card">
                <img src={cat.image} alt={cat.name} />
                <span>{cat.name}</span>
              </Link>
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
              <Link key={item.slot} to="/collections" className={`mosaic-cell mosaic-${item.slot}`}>
                <img src={item.image} alt={item.alt} />
              </Link>
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
            <Link to="/collections" className="text-link underline">
              VIEW COLLECTION
            </Link>
          </div>
          <div className="product-row">
            {featured.map((item) => (
              <Link
                key={item.slug || item.name}
                to={item.slug ? `/collections?piece=${item.slug}` : '/collections'}
                className="product-card"
              >
                <img src={item.image} alt={item.name} />
                <div className="product-meta">
                  <span>{item.name}</span>
                  <strong>{item.price}</strong>
                </div>
              </Link>
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
          </div>
          <div className="bestsellers-frame">
            <button
              type="button"
              className="seller-arrow prev"
              aria-label="Previous"
              onClick={() => scrollSellers(-1)}
            >
              <ArrowLeft size={16} />
            </button>
            <div className="bestsellers-viewport" ref={sellersViewportRef}>
            <div className="stagger-track">
              {bestSellers.map((item, i) => (
                <Link
                  key={`${item.slug || item.name}-${i}`}
                  to={item.slug ? `/collections?piece=${item.slug}` : '/collections'}
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
                </Link>
              ))}
            </div>
          </div>
            <button
              type="button"
              className="seller-arrow next"
              aria-label="Next"
              onClick={() => scrollSellers(1)}
            >
              <ArrowRight size={16} />
            </button>
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
              <Link
                key={item.slug || item.name}
                to={item.slug ? `/collections?piece=${item.slug}` : '/collections'}
                className={`curated-card h-${i}`}
              >
                <img src={item.image} alt={item.name} />
                <div className="product-meta">
                  <span>{item.name}</span>
                  <strong>{item.price}</strong>
                </div>
              </Link>
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
          <div className="testimonial-dots" role="tablist" aria-label="Feedback">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`testimonial-dot ${index === testimonialIndex ? 'active' : ''}`}
                aria-label={`Show feedback from ${item.name}`}
                onClick={() => setTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default Home;
