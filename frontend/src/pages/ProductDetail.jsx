import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  Package,
  Truck,
  RotateCcw,
  Gem,
  CheckCircle2,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productPath, toStoreProduct } from '../data/catalog';
import { fetchProduct, fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Collections.css';
import '../styles/pages/Wishlist.css';

const asDetailLines = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(/\.\s+/)
    .map((line) => line.replace(/\.$/, '').trim())
    .filter(Boolean);
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setSelectedImageIndex(0);
    setQuantity(1);

    fetchProduct(slug)
      .then(async (res) => {
        if (cancelled) return;
        if (res.data?.status === 'Draft') {
          setNotFound(true);
          setProduct(null);
          return;
        }
        const mapped = toStoreProduct(res.data);
        setProduct(mapped);

        try {
          const listRes = await fetchProducts('', mapped.specs?.category || '');
          if (cancelled) return;
          const others = (listRes.data || [])
            .filter((item) => item.status !== 'Draft')
            .map(toStoreProduct)
            .filter((item) => item.id !== mapped.id)
            .slice(0, 4);
          setRelated(others);
        } catch {
          if (!cancelled) setRelated([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNotFound(true);
          setProduct(null);
          setRelated([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 3500);
  };

  const pushToCart = () => {
    if (!product || product.stock === 0) return;
    addItem({
      id: product.id,
      title: product.title,
      meta: product.specs?.purity || product.specs?.ringType || 'Antique finish',
      sku: product.sku || String(product.id).toUpperCase(),
      unitPrice: product.unitPrice || 0,
      currency: 'INR',
      image: product.images[0],
      stock: product.stock || 8,
      qty: quantity,
    });
  };

  const handleAddToCart = () => {
    pushToCart();
    showToast(`Added ${product.title} (x ${quantity}) to your cart!`);
  };

  const handleBuyNow = () => {
    pushToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="storefront">
        <StoreHeader />
        <div className="store-container collections-detail-section">
          <p className="product-lead-copy">Loading piece…</p>
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="storefront">
        <StoreHeader />
        <div className="store-container collections-detail-section">
          <h1 className="product-title-serif">Piece not found</h1>
          <p className="product-lead-copy">This antique design is unavailable or has been removed.</p>
          <Link to="/collections" className="cta-btn btn-buy-now" style={{ display: 'inline-flex', width: 'auto', padding: '0 1.75rem', alignItems: 'center', textDecoration: 'none' }}>
            Browse collections
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="storefront">
      <StoreHeader />

      {toast && (
        <div className="collection-toast">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      <section className="collections-detail-section">
        <div className="store-container">
          <Link to="/collections" className="co-back" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem', color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to collections
          </Link>

          <div className="product-detail-grid">
            <div className="product-gallery-col">
              <div className="main-image-card">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="main-product-img"
                />
              </div>

              {product.images.length > 1 && (
                <div
                  className="thumbnails-grid"
                  style={{ gridTemplateColumns: `repeat(${Math.min(product.images.length, 4)}, 1fr)` }}
                >
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={imgUrl + idx}
                      type="button"
                      className={`thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`${product.title} view ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-info-col">
              {product.specs?.category && (
                <p className="product-category-label">{product.specs.category}</p>
              )}
              <h1 className="product-title-serif">{product.title}</h1>

              <div className="product-price-row">
                {product.originalPrice && (
                  <span className="price-original">{product.originalPrice}</span>
                )}
                <span className="price-current">{product.price}</span>
                {product.onSale && <span className="badge-sale">SALE</span>}
              </div>
              {product.specs?.offerTag && (
                <p className="product-offer-tag">{product.specs.offerTag}</p>
              )}

              <div className="product-rating-row">
                <div className="stars-flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#b08d3e" stroke="none" />
                  ))}
                </div>
                <span className="review-count">({product.reviewsCount})</span>
              </div>

              <div className="product-lead-copy">
                <p>{product.description}</p>
              </div>

              <dl className="product-spec-grid">
                {product.specs.ringType && (
                  <div>
                    <dt>Ring Type</dt>
                    <dd>{product.specs.ringType}</dd>
                  </div>
                )}
                {product.specs.purity && (
                  <div>
                    <dt>Finish</dt>
                    <dd>{product.specs.purity}</dd>
                  </div>
                )}
                {!!product.specs.weightGrams && (
                  <div>
                    <dt>Weight</dt>
                    <dd>{`${product.specs.weightGrams} g`}</dd>
                  </div>
                )}
                <div>
                  <dt>Craft</dt>
                  <dd>Hand-finished</dd>
                </div>
                <div>
                  <dt>Stock</dt>
                  <dd>{product.stock > 0 ? `${product.stock} pcs` : 'Out of stock'}</dd>
                </div>
                {product.sku && (
                  <div>
                    <dt>SKU</dt>
                    <dd>{product.sku}</dd>
                  </div>
                )}
              </dl>

              <div className="selector-group">
                <label className="selector-label">Quantity</label>
                <div className="qty-picker">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-num">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stock || 8, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="trust-badges-bar">
                <div className="trust-badge">
                  <Package size={22} className="badge-icon" />
                  <span>{product.specs?.purity || 'Antique finish'}</span>
                </div>
                <div className="trust-badge">
                  <Truck size={22} className="badge-icon" />
                  <span>Free express shipping</span>
                </div>
                <div className="trust-badge">
                  <RotateCcw size={22} className="badge-icon" />
                  <span>Easy 7-day return</span>
                </div>
                <div className="trust-badge">
                  <Gem size={22} className="badge-icon" />
                  <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>
              </div>

              <div className="cta-buttons-stack">
                <button
                  type="button"
                  className="cta-btn btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
                <button
                  type="button"
                  className="cta-btn btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  BUY NOW
                </button>
                <button
                  type="button"
                  className={`cta-btn btn-wishlist${isWishlisted(product.id) ? ' active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-pressed={isWishlisted(product.id)}
                >
                  <Heart size={17} />
                  {isWishlisted(product.id) ? 'SAVED IN WISHLIST' : 'ADD TO WISHLIST'}
                </button>
              </div>

              <div className="product-details-panel">
                <section className="product-detail-block">
                  <h3>Product details</h3>
                  <p className="product-detail-copy">
                    {product.details?.description || product.description}
                  </p>
                </section>

                {asDetailLines(product.details?.sizeAndMaterial).length > 0 && (
                  <section className="product-detail-block">
                    <h3>Size &amp; material</h3>
                    <ul className="product-detail-list">
                      {asDetailLines(product.details.sizeAndMaterial).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="product-detail-block">
                  <h3>Delivery &amp; returns</h3>
                  <ul className="product-detail-list">
                    {asDetailLines(product.details?.shippingAndReturns).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section related-products-section">
          <div className="store-container">
            <div className="related-header-row">
              <h2 className="related-title-serif">You May Also Like</h2>
            </div>

            <div className="related-cards-grid">
              {related.map((item) => (
                <Link key={item.id} to={productPath(item)} className="related-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="related-card-media" style={{ position: 'relative' }}>
                    <img src={item.images[0]} alt={item.title} />
                    <button
                      type="button"
                      className={`wishlist-heart-btn${isWishlisted(item.id) ? ' active' : ''}`}
                      aria-label={
                        isWishlisted(item.id)
                          ? `Remove ${item.title} from wishlist`
                          : `Add ${item.title} to wishlist`
                      }
                      aria-pressed={isWishlisted(item.id)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                    >
                      <Heart size={17} />
                    </button>
                  </div>
                  <div className="related-card-meta">
                    <h3 className="related-card-name">{item.title}</h3>
                    <span className="related-card-price">{item.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <StoreFooter />
    </div>
  );
};

export default ProductDetail;
