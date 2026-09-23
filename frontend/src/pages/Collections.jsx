import React from 'react';
import { Link } from 'react-router-dom';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { exploreCategories, exploreGallery } from '../data/images';

const Collections = () => {
  return (
    <div className="storefront">
      <StoreHeader />

      <section className="section explore-section">
        <div className="store-container">
          <div className="section-head center explore-head">
            <h1 className="section-title explore-title">
              Explore <em>Our</em> Collections
            </h1>
            <p className="section-sub">
              Discover the perfect jewelry to complement your style.
            </p>
          </div>

          <div className="explore-category-grid">
            {exploreCategories.map((cat) => (
              <Link
                key={cat.name}
                to={`/#shop`}
                className="explore-category-card"
                state={{ category: cat.name }}
              >
                <div className="explore-category-media">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>

          <div className="explore-gallery">
            <div className="explore-gallery-tall">
              <img
                src={exploreGallery.lifestyle}
                alt="Model wearing layered gold jewelry"
              />
            </div>
            <div className="explore-gallery-stack">
              <img
                src={exploreGallery.hoops}
                alt="Gold pavé hoop earrings"
              />
              <img
                src={exploreGallery.chains}
                alt="Gold chain bracelets"
              />
            </div>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default Collections;
