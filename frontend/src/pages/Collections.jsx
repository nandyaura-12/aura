import React, { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useWishlist } from '../context/WishlistContext';
import { productPath, toStoreProduct } from '../data/catalog';
import { fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Collections.css';
import '../styles/pages/Wishlist.css';

const Collections = () => {
  const [searchParams] = useSearchParams();
  const piece = searchParams.get('piece');
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (piece) return undefined;
    let cancelled = false;
    fetchProducts()
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
  }, [piece]);

  // Old links used /collections?piece=slug — send them to the real PDP.
  if (piece) {
    return <Navigate to={`/product/${piece}`} replace />;
  }

  return (
    <div className="storefront">
      <StoreHeader />

      <section className="section related-products-section" style={{ borderTop: 'none', paddingTop: '3rem' }}>
        <div className="store-container">
          <div className="related-header-row">
            <div>
              <p className="product-category-label" style={{ marginBottom: '0.35rem' }}>
                Shop
              </p>
              <h1 className="related-title-serif">Antique Collections</h1>
            </div>
          </div>

          {loading ? (
            <p className="product-lead-copy">Gathering designs…</p>
          ) : products.length === 0 ? (
            <p className="product-lead-copy">No pieces are listed yet. Check back soon.</p>
          ) : (
          <div className="related-cards-grid">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={productPath(product)}
                className="related-product-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
              >
                  <div className="related-card-media" style={{ position: 'relative' }}>
                    <img src={product.images[0]} alt={product.title} />
                    {product.onSale && <span className="badge-sale" style={{ position: 'absolute', top: 12, left: 12 }}>SALE</span>}
                  <button
                    type="button"
                      className={`wishlist-heart-btn${isWishlisted(product.id) ? ' active' : ''}`}
                    aria-label={
                        isWishlisted(product.id)
                          ? `Remove ${product.title} from wishlist`
                          : `Add ${product.title} to wishlist`
                      }
                      aria-pressed={isWishlisted(product.id)}
                    onClick={(e) => {
                        e.preventDefault();
                      e.stopPropagation();
                        toggleWishlist(product);
                    }}
                  >
                    <Heart size={17} />
                  </button>
                </div>
                <div className="related-card-meta">
                    {product.specs?.category && (
                      <p className="product-category-label" style={{ marginBottom: '0.35rem' }}>
                        {product.specs.category}
                      </p>
                    )}
                    <h2 className="related-card-name">{product.title}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                      {product.originalPrice && (
                        <span className="price-original" style={{ fontSize: '0.85rem' }}>
                          {product.originalPrice}
                        </span>
                      )}
                      <span className="related-card-price">{product.price}</span>
                </div>
              </div>
                </Link>
            ))}
          </div>
          )}
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default Collections;
