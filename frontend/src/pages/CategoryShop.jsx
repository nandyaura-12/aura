import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useWishlist } from '../context/WishlistContext';
import { jewellery } from '../data/images';
import { formatInr, toStoreProduct } from '../data/catalog';
import {
  SHOP_CATEGORIES,
  getCategoryBySlug,
  categoryPath,
} from '../data/shopCategories';
import { fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Wishlist.css';
import '../styles/pages/CategoryShop.css';

const CategoryShop = () => {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return undefined;
    let cancelled = false;
    setLoading(true);

    fetchProducts('', category.name)
      .then((res) => {
        if (cancelled) return;
        const active = (res.data || [])
          .filter((product) => product.status !== 'Draft')
          .map(toStoreProduct);
        setProducts(active);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!category) {
    return <Navigate to="/#shop" replace />;
  }

  return (
    <div className="storefront">
      <StoreHeader />

      <section className="category-shop-hero">
        <img
          src={category.image || jewellery.img07}
          alt=""
          className="category-shop-hero__bg"
          aria-hidden="true"
        />
        <div className="category-shop-hero__overlay" />
        <div className="store-container category-shop-hero__content">
          <p className="category-shop-eyebrow">Shop by Category</p>
          <h1>{category.name}</h1>
          <p className="category-shop-lead">{category.description}</p>
        </div>
      </section>

      <nav className="category-shop-nav" aria-label="Shop categories">
        <div className="store-container category-shop-nav__inner">
          {SHOP_CATEGORIES.map((item) => (
            <Link
              key={item.slug}
              to={categoryPath(item.slug)}
              className={item.slug === category.slug ? 'is-active' : ''}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="category-shop-main">
        <div className="store-container">
          <div className="category-shop-head">
            <h2>
              {loading
                ? 'Loading pieces…'
                : products.length
                  ? `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}`
                  : 'No pieces yet'}
            </h2>
            <Link to="/collections" className="category-shop-all">
              View all collections <ArrowUpRight size={15} />
            </Link>
          </div>

          {!loading && products.length === 0 ? (
            <div className="category-shop-empty">
              <h3>Coming soon</h3>
              <p>
                New antique pieces for {category.name} will appear here once they
                are added to the catalogue.
              </p>
              <Link to="/collections" className="category-shop-cta">
                Browse collections
              </Link>
            </div>
          ) : (
            <div className="category-shop-grid">
              {products.map((product) => {
                const wishId = product.id;
                const active = isWishlisted(wishId);
                return (
                  <article key={product.id} className="category-shop-card">
                    <Link
                      to={`/collections?piece=${product.id}`}
                      className="category-shop-card__media"
                    >
                      <img
                        src={product.images?.[0] || jewellery.img01}
                        alt={product.title}
                      />
                    </Link>
                    <button
                      type="button"
                      className={`wishlist-heart-btn${active ? ' active' : ''}`}
                      aria-label={
                        active
                          ? `Remove ${product.title} from wishlist`
                          : `Add ${product.title} to wishlist`
                      }
                      aria-pressed={active}
                      onClick={() =>
                        toggleWishlist({
                          name: product.title,
                          title: product.title,
                          slug: product.id,
                          image: product.images?.[0],
                          price: product.price,
                          unitPrice: product.unitPrice,
                        })
                      }
                    >
                      <Heart size={17} />
                    </button>
                    <div className="category-shop-card__body">
                      <Link to={`/collections?piece=${product.id}`}>
                        <h3>{product.title}</h3>
                      </Link>
                      <div className="category-shop-card__price">
                        <strong>{product.price}</strong>
                        {product.originalPrice && (
                          <span>{product.originalPrice}</span>
                        )}
                      </div>
                      {!product.price && (
                        <strong>{formatInr(product.unitPrice)}</strong>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <StoreFooter />
    </div>
  );
};

export default CategoryShop;
