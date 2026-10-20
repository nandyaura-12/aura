import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Heart, Star, ArrowRight } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import ctaBannerBg from '../assets/jewellery/cta-banner-bg.jpg';
import '../styles/pages/storefront.css';
import '../styles/pages/About.css';

const aboutImages = {
  hero: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1400',
  story: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  materials: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
  shaping: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=800',
  finishing: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
  ctaBg: ctaBannerBg,
};

const About = () => {
  return (
    <div className="storefront">
      <StoreHeader />

      {/* 1. Hero Header Section */}
      <section className="about-hero-section">
        <div className="store-container">
          <div className="about-hero-head text-center">
            <h1 className="about-page-title">
              About <em>Us</em>
            </h1>
            <p className="about-page-sub">
              Antique &amp; temple jewellery inspired by the heirlooms of old South India.
            </p>
          </div>

          <div className="about-hero-statement text-center">
            <h2 className="about-statement-headline">
              Heirlooms made to be <em>worn again</em>,
              <br />
              and treasured for life.
            </h2>
            <p className="about-statement-body">
              Nandys Aura creates antique-finish temple jewellery by hand in India — nakshi,
              <br className="desktop-only-br" />
              kemp and mango motifs made to be worn at celebrations and passed on.
            </p>
          </div>

          <div className="about-hero-banner">
            <img
              src={aboutImages.hero}
              alt="Model wearing an antique temple necklace set"
              className="about-banner-img"
            />
          </div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="about-story-section">
        <div className="store-container">
          <div className="about-story-grid">
            <div className="about-story-media">
              <img
                src={aboutImages.story}
                alt="Flatlay of handcrafted antique jewellery and traditional tools"
              />
            </div>
            <div className="about-story-copy">
              <span className="about-pill">Our Story</span>
              <h2 className="about-section-title">
                It began with a grandmother&apos;s
                <br />
                temple haram.
              </h2>
              <p className="story-para">
                Nandys Aura began when we tried to recreate a treasured family heirloom — a
                dull-antique Lakshmi haram that no new, shiny piece could match. Friends asked
                for their own, and a small workshop slowly took shape.
              </p>
              <p className="story-para">
                Today our small team still works the same way: fewer pieces, cast and carved
                carefully, then antique-finished by hand so they look loved for generations.
              </p>
              <span className="story-signature">— Nandys Aura Founder</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Craftsmanship Section */}
      <section className="about-craft-section">
        <div className="store-container">
          <div className="craft-head-row">
            <div>
              <span className="about-pill">Our Craftsmanship</span>
              <h2 className="about-section-title">
                Every detail, finished by hand.
              </h2>
            </div>
            <p className="craft-sub-text">
              Each piece passes through master pairs of hands before it reaches yours.
            </p>
          </div>

          <div className="craft-cards-grid">
            <div className="craft-card">
              <div className="craft-media-wrap">
                <img src={aboutImages.materials} alt="Antique-finish bangles stack" />
              </div>
              <h3 className="craft-card-title">Materials</h3>
              <p className="craft-card-text">
                Brass alloy with a matte antique finish, kemp-style stones and faux pearls —
                skin-friendly and lead-free, never bright or newly polished.
              </p>
            </div>

            <div className="craft-card">
              <div className="craft-media-wrap">
                <img src={aboutImages.shaping} alt="Artisan carving nakshi jewellery at a workbench" />
              </div>
              <h3 className="craft-card-title">Shaping</h3>
              <p className="craft-card-text">
                Each Lakshmi, peacock and mango motif is cast and carved by hand using traditional nakshi techniques.
              </p>
            </div>

            <div className="craft-card">
              <div className="craft-media-wrap">
                <img src={aboutImages.finishing} alt="Artisan applying an antique finish by hand" />
              </div>
              <h3 className="craft-card-title">Finishing</h3>
              <p className="craft-card-text">
                Oxidised and antique-finished by hand, then inspected piece by piece before it leaves the workshop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Values Section */}
      <section className="about-values-section">
        <div className="store-container text-center">
          <span className="about-pill center-pill">Our Values</span>
          <h2 className="about-section-title center-title">What we hold to</h2>

          <div className="values-cards-grid">
            <div className="value-card">
              <div className="value-icon-circle">
                <Gem size={22} strokeWidth={1.5} />
              </div>
              <h3 className="value-card-title">True antique character</h3>
              <p className="value-card-text">
                A dull, aged finish modelled on real heirlooms — never bright, shiny or mass-polished.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-circle">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <h3 className="value-card-title">Heritage design</h3>
              <p className="value-card-text">
                Temple, nakshi and vintage motifs drawn from old South Indian family jewellery.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-circle">
                <Heart size={22} strokeWidth={1.5} />
              </div>
              <h3 className="value-card-title">Genuine care</h3>
              <p className="value-card-text">
                Antique-finish care guidance, re-finishing and repair support, with a real person ready to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Review Quote Section */}
      <section className="about-quote-section">
        <div className="store-container text-center">
          <div className="quote-featured-block">
            <blockquote className="featured-quote-serif">
              “The temple haram looks exactly like my grandmother&apos;s heirloom — I wore it all through my wedding.”
            </blockquote>
            <span className="featured-quote-author">PRIYA SHARMA · MUMBAI</span>
          </div>

          <div className="about-reviews-divider" />

          <div className="reviews-trio-grid">
            <div className="review-trio-item">
              <div className="review-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#bfa15f" stroke="none" />
                ))}
              </div>
              <p className="review-trio-body">
                Beautiful packaging, and the mango mala paired perfectly with my silk saree.
              </p>
              <span className="review-trio-buyer">Ananya R. · Verified buyer</span>
            </div>

            <div className="review-trio-item">
              <div className="review-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#bfa15f" stroke="none" />
                ))}
              </div>
              <p className="review-trio-body">
                They exchanged my kada for the right bangle size quickly, and the team was so warm to deal with.
              </p>
              <span className="review-trio-buyer">Meera K. · Verified buyer</span>
            </div>

            <div className="review-trio-item">
              <div className="review-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#bfa15f" stroke="none" />
                ))}
              </div>
              <p className="review-trio-body">
                A gift that felt truly personal. Exceptional quality for the price.
              </p>
              <span className="review-trio-buyer">Rhea S. · Verified buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Find the piece banner CTA */}
      <section className="about-cta-banner">
        <img
          src={aboutImages.ctaBg}
          alt="Handcrafted antique temple jewellery — harams, jhumkas and bangles"
          className="cta-banner-bg-img"
        />
        <div className="cta-banner-overlay" />
        <div className="cta-banner-content">
          <h2 className="cta-banner-headline">
            Find the piece that becomes
            <br />
            <span className="cta-gold-accent">yours</span>
            <span className="cta-period-white">.</span>
          </h2>
          <p className="cta-banner-sub">
            Harams, jhumkas, chokers and kadas — hand-finished and ready to wear.
          </p>
          <Link to="/collections" className="cta-banner-btn">
            EXPLORE ANTIQUE JEWELLERY <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default About;
