import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Recycle, Hand, Award, Heart, MoveHorizontal } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import { useWishlist } from '../context/WishlistContext';
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
  const [sellerIndex, setSellerIndex] = useState(0);
  const sellersViewportRef = useRef(null);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const renderHeart = (item) => {
    const id = item.slug || item.name;
    const active = isWishlisted(id);
    return (
      <button
        type="button"
        className={`wishlist-heart-btn${active ? ' active' : ''}`}
        aria-label={active ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
        aria-pressed={active}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(item);
        }}
      >
        <Heart size={17} />
      </button>
    );
  };

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

  // Arrow illa — segment click / swipe panna sellers move aagum
  const sellerStep = () => {
    const viewport = sellersViewportRef.current;
    if (!viewport) return 0;
    const card = viewport.querySelector('.stagger-card');
    if (!card) return 0;
    const track = viewport.querySelector('.stagger-track');
    const gap = track ? parseFloat(window.getComputedStyle(track).gap) || 22 : 22;
    return card.getBoundingClientRect().width + gap;
  };

  const scrollToSeller = (index) => {
    const viewport = sellersViewportRef.current;
    const step = sellerStep();
    if (!viewport || !step) return;
    viewport.scrollTo({ left: index * step, behavior: 'smooth' });
    setSellerIndex(index);
  };

  const handleSellersScroll = () => {
    const viewport = sellersViewportRef.current;
    const step = sellerStep();
    if (!viewport || !step) return;
    const index = Math.round(viewport.scrollLeft / step);
    setSellerIndex(Math.max(0, Math.min(index, bestSellers.length - 1)));
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
        <img src={hero.main} alt="Woman wearing antique temple jewellery" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            <span>Heritage,</span>
            <em>Worn Again</em>
          </h1>
          <p className="hero-copy">
            <span>Handcrafted antique &amp; temple jewellery inspired by old South Indian</span>
            <span>craft — nakshi work, kemp stones and timeless vintage finishes.</span>
          </p>
          <Link to="/collections" className="hero-cta">
            Explore Antique Collections
          </Link>
        </div>
        <div className="hero-thumbs">
          <img src={hero.thumb1} alt="Antique necklace with green kemp stones" />
          <img src={hero.thumb2} alt="Vintage pearl-drop jhumka earring" />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section category-section" id="shop">
        <div className="store-container">
          <h2 className="section-title center">Shop By Antique Category</h2>
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
            <span className="pill">Heritage Arrivals</span>
            <h2 className="section-title collections-title">
              Antique Collections for
              <br />
              Every Occasion
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
              <span className="pill">Featured Antique Pieces</span>
              <h2 className="section-title">Cast, Carved &amp; Hand-Finished.</h2>
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
                {renderHeart(item)}
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
              <span className="pill">Most Loved</span>
              <h2 className="section-title bestsellers-title">
                <span>Temple classics and vintage</span>
                <span>pieces, loved for generations</span>
              </h2>
            </div>
          </div>
          <div className="bestsellers-frame">
            <div className="bestsellers-viewport" ref={sellersViewportRef} onScroll={handleSellersScroll}>
            <div className="stagger-track">
              {bestSellers.map((item, i) => (
                <Link
                  key={`${item.slug || item.name}-${i}`}
                  to={item.slug ? `/collections?piece=${item.slug}` : '/collections'}
                  className={`stagger-card ${item.tall ? 'tall' : ''} ${i % 2 === 1 ? 'offset-1' : ''}`}
                >
                  {renderHeart(item)}
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
            {/* Arrow-ku badhila segment navigation */}
            <div className="seller-controls">
              <span className="seller-hint">
                <MoveHorizontal size={15} /> Swipe to explore
              </span>
              <div className="seller-segments" role="tablist" aria-label="Best sellers">
                {bestSellers.map((item, i) => (
                  <button
                    key={`${item.slug || item.name}-seg-${i}`}
                    type="button"
                    className={`seller-seg ${i === sellerIndex ? 'active' : ''}`}
                    aria-label={`Show ${item.name}`}
                    aria-current={i === sellerIndex}
                    onClick={() => scrollToSeller(i)}
                  />
                ))}
              </div>
              <span className="seller-count">
                {String(sellerIndex + 1).padStart(2, '0')} / {String(bestSellers.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grace in Every Detail */}
      <section className="grace-section" id="about">
        <div className="store-container grace-grid">
          <div className="grace-image">
            <img src={grace.image} alt="Antique hand ornament with nakshi detailing" />
          </div>
          <div className="grace-copy">
            <p className="eyebrow">ANTIQUE HAND ORNAMENT</p>
            <h2>
              Grace in Every
              <br />
              Detail
            </h2>
            <p>
              An antique-finish hand ornament with nakshi filigree work and kemp accents,
              inspired by ornaments worn in old temple towns. A graceful finishing touch for festive wear.
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
          <h2 className="section-title">Curated Heirlooms</h2>
          <p className="section-sub">Heritage pieces meant to be treasured, gifted and passed on.</p>
          <div className="curated-grid">
            {curated.map((item, i) => (
              <Link
                key={item.slug || item.name}
                to={item.slug ? `/collections?piece=${item.slug}` : '/collections'}
                className={`curated-card h-${i}`}
              >
                {renderHeart(item)}
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
            <h3>HERITAGE DESIGNS</h3>
            <p>Motifs drawn from temple art, old nakshi work and vintage family heirlooms.</p>
          </div>
          <div className="trust-item">
            <Hand size={28} strokeWidth={1.25} />
            <h3>MASTER CRAFTSMANSHIP</h3>
            <p>Cast, carved and antique-finished by hand using time-honoured techniques.</p>
          </div>
          <div className="trust-item">
            <Award size={28} strokeWidth={1.25} />
            <h3>CARE &amp; RESTORATION</h3>
            <p>Antique-finish care, re-polishing and repair support for every piece.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="store-container">
          <div className="section-head center">
            <span className="pill">Wearer Stories</span>
            <h2 className="section-title">Loved like an heirloom</h2>
            <p className="section-sub">
              Brides, festive wearers and collectors who treasure our antique pieces.
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
