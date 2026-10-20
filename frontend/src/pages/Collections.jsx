import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  Gem,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { jewellery } from '../data/images';
import { toStoreProduct } from '../data/catalog';
import { fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Collections.css';

// Shown until the admin catalogue responds, and if the API is unavailable.
// Antique / temple jewellery — antique-finish pieces, NOT solid gold or silver.
const fallbackCatalog = [
  {
    id: 'lakshmi-nakshi-temple-haram',
    title: 'Lakshmi Nakshi Temple Haram',
    originalPrice: '₹3,999',
    price: '₹2,999',
    rating: '4.9',
    reviewsCount: 124,
    onSale: true,
    description:
      'A long antique-finish haram with a hand-carved Goddess Lakshmi pendant, nakshi detailing and deep-red kemp stones. Inspired by heirloom temple jewellery of old Tamil Nadu.',
    styles: ['Standard'],
    images: [jewellery.img21, jewellery.img07, jewellery.img12, jewellery.img20],
    details: {
      description:
        'Cast and carved by hand, then given a dull antique finish so it looks like a treasured family heirloom — never bright or newly polished.',
      sizeAndMaterial:
        'Antique matte finish on brass alloy. Kemp-style stones and faux pearl drops. Haram length: approx. 24 inches with adjustable back chain. Skin-friendly, lead-free.',
      shippingAndReturns:
        'Free shipping across India. Delivery in 3-5 business days. Easy 7-day return in original condition.',
    },
  },
  {
    id: 'antique-kemp-jhumka',
    title: 'Antique Kemp Jhumka Earrings',
    originalPrice: '₹1,799',
    price: '₹1,299',
    rating: '4.8',
    reviewsCount: 86,
    onSale: true,
    description:
      'Classic temple jhumkas with peacock tops, kemp stones and tiny pearl drops, finished in a soft antique tone.',
    styles: ['Standard'],
    images: [jewellery.img05, jewellery.img02, jewellery.img16, jewellery.img04],
    details: {
      description:
        'Hand-finished jhumkas modelled on vintage Chettinad designs, with delicate nakshi work around the dome.',
      sizeAndMaterial:
        'Antique matte finish on brass alloy, kemp-style stones, faux pearls. Length: approx. 55mm. Push-back fitting.',
      shippingAndReturns:
        'Ships in 1-2 business days in protective gift packaging. 7-day return policy.',
    },
  },
  {
    id: 'temple-mango-mala',
    title: 'Temple Mango Mala Necklace',
    originalPrice: '₹3,299',
    price: '₹2,499',
    rating: '5.0',
    reviewsCount: 94,
    onSale: true,
    description:
      'A vintage mango-motif (manga malai) necklace — one of the oldest South Indian designs — in a rich antique finish with kemp accents.',
    styles: ['Standard'],
    images: [jewellery.img01, jewellery.img10, jewellery.img14, jewellery.img03],
    details: {
      description:
        'Rows of carved mango motifs strung in the traditional style, made to pair with silk sarees and bridal wear.',
      sizeAndMaterial:
        'Antique matte finish on brass alloy, kemp-style stones. Length: approx. 22 inches, adjustable back chain.',
      shippingAndReturns:
        'Free standard shipping across India. Keep away from water and perfume to preserve the antique finish.',
    },
  },
  {
    id: 'peacock-nakshi-choker',
    title: 'Peacock Nakshi Choker',
    originalPrice: '₹2,899',
    price: '₹2,199',
    rating: '4.9',
    reviewsCount: 68,
    onSale: true,
    description:
      'A close-fitting antique choker with twin peacock nakshi work, green stones and pearl drops — a vintage bridal favourite.',
    styles: ['Standard'],
    images: [jewellery.img13, jewellery.img18, jewellery.img19, jewellery.img06],
    details: {
      description:
        'Peacocks carved in deep relief, oxidised by hand so every feather stands out against the dull antique surface.',
      sizeAndMaterial:
        'Antique matte finish on brass alloy, stone and faux pearl detailing. Adjustable dori / back chain fitting.',
      shippingAndReturns:
        'Free shipping across India. 7-day return in original condition.',
    },
  },
  {
    id: 'antique-kada-bangle',
    title: 'Antique Kada Bangle',
    originalPrice: '₹2,499',
    price: '₹1,899',
    rating: '5.0',
    reviewsCount: 142,
    onSale: true,
    description:
      'A broad antique-finish kada with temple carvings and screw opening, modelled on bangles worn generations ago.',
    styles: ['2.4', '2.6', '2.8'],
    images: [jewellery.img03, jewellery.img21, jewellery.img17, jewellery.img22],
    details: {
      description:
        'Heavy nakshi carving all around, with an aged, matte surface that pairs beautifully with silk and cotton sarees alike.',
      sizeAndMaterial:
        'Antique matte finish on brass alloy. Screw-opening fitting. Sizes: 2.4, 2.6, 2.8.',
      shippingAndReturns:
        'Includes complimentary velvet pouch. Free shipping across India, 7-day returns.',
    },
  },
];

const Collections = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [catalog, setCatalog] = useState(fallbackCatalog);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const currentProduct = catalog[activeProductIndex];

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((res) => {
        const active = (res.data || []).filter((product) => product.status !== 'Draft');
        if (!cancelled && active.length) {
          setCatalog(active.map(toStoreProduct));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('Medium');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState({
    description: true,
    sizeAndMaterial: false,
    shippingAndReturns: false,
  });
  const [toast, setToast] = useState('');

  useEffect(() => {
    const piece = searchParams.get('piece');
    const found = piece ? catalog.findIndex((product) => product.id === piece) : 0;
    const next = found >= 0 ? found : 0;
    setActiveProductIndex(next);
    setSelectedImageIndex(0);
    setSelectedStyle(catalog[next]?.styles[0] || 'Medium');
    setQuantity(1);
  }, [catalog, searchParams]);

  const relatedItems = catalog
    .filter((product) => product.id !== currentProduct?.id)
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0],
    }));

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const pushCurrentToCart = () => {
    if (!currentProduct || currentProduct.stock === 0) return;
    const unitPrice =
      currentProduct.unitPrice ??
      (Number(String(currentProduct.price).replace(/[^\d.]/g, '')) || 0);
    addItem({
      id: `${currentProduct.id}-${selectedStyle.toLowerCase()}`,
      title: currentProduct.title,
      meta: selectedStyle,
      sku: currentProduct.sku || currentProduct.id.toUpperCase(),
      unitPrice,
      currency: 'INR',
      image: currentProduct.images[0],
      stock: currentProduct.stock || 8,
      qty: quantity,
    });
  };

  const handleAddToCart = () => {
    pushCurrentToCart();
    showToast(`Added ${currentProduct.title} (${selectedStyle} x ${quantity}) to your cart!`);
  };

  const handleBuyNow = () => {
    pushCurrentToCart();
    navigate('/cart');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 3500);
  };

  const handleSelectRelated = (relatedId) => {
    const foundIdx = catalog.findIndex((p) => p.id === relatedId);
    if (foundIdx !== -1) {
      setActiveProductIndex(foundIdx);
      setSelectedImageIndex(0);
      setSelectedStyle(catalog[foundIdx].styles[0] || 'Medium');
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const nextProduct = () => {
    const nextIdx = (activeProductIndex + 1) % catalog.length;
    setActiveProductIndex(nextIdx);
    setSelectedImageIndex(0);
    setSelectedStyle(catalog[nextIdx].styles[0] || 'Medium');
  };

  const prevProduct = () => {
    const prevIdx = (activeProductIndex - 1 + catalog.length) % catalog.length;
    setActiveProductIndex(prevIdx);
    setSelectedImageIndex(0);
    setSelectedStyle(catalog[prevIdx].styles[0] || 'Medium');
  };

  return (
    <div className="storefront">
      <StoreHeader />

      {/* Toast Notification */}
      {toast && (
        <div className="collection-toast">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Product / Collection Details */}
      <section className="collections-detail-section">
        <div className="store-container">
          <div className="product-detail-grid">
            {/* Left Column: Gallery */}
            <div className="product-gallery-col">
              <div className="main-image-card">
                <img
                  src={currentProduct.images[selectedImageIndex] || currentProduct.images[0]}
                  alt={currentProduct.title}
                  className="main-product-img"
                />
              </div>

              {/* 4 Thumbnails */}
              {currentProduct.images.length > 1 && (
              <div className="thumbnails-grid" style={{ gridTemplateColumns: `repeat(${Math.min(currentProduct.images.length, 4)}, 1fr)` }}>
                {currentProduct.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${currentProduct.title} view ${idx + 1}`} />
                  </button>
                ))}
              </div>
              )}
            </div>

            {/* Right Column: Product Information */}
            <div className="product-info-col">
              {currentProduct.specs?.category && (
                <p className="product-category-label">{currentProduct.specs.category}</p>
              )}
              <h1 className="product-title-serif">{currentProduct.title}</h1>

              {/* Price & Sale Badge */}
              <div className="product-price-row">
                {currentProduct.originalPrice && (
                  <span className="price-original">{currentProduct.originalPrice}</span>
                )}
                <span className="price-current">{currentProduct.price}</span>
                {currentProduct.onSale && <span className="badge-sale">SALE</span>}
              </div>
              {currentProduct.specs?.offerTag && (
                <p className="product-offer-tag">{currentProduct.specs.offerTag}</p>
              )}

              {/* Rating */}
              <div className="product-rating-row">
                <div className="stars-flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#b08d3e" stroke="none" />
                  ))}
                </div>
                <span className="review-count">({currentProduct.reviewsCount})</span>
              </div>

              {/* Product Lead Copy */}
              <p className="product-lead-copy">{currentProduct.description}</p>

              {currentProduct.specs ? (
                <dl className="product-spec-grid">
                  <div>
                    <dt>Finish</dt>
                    <dd>{currentProduct.specs.purity || '—'}</dd>
                  </div>
                  <div>
                    <dt>Weight</dt>
                    <dd>{currentProduct.specs.weightGrams ? `${currentProduct.specs.weightGrams} g` : '—'}</dd>
                  </div>
                  <div>
                    <dt>Craft</dt>
                    <dd>{currentProduct.specs.makingCharge ? `Hand-finished` : 'Hand-finished'}</dd>
                  </div>
                  <div>
                    <dt>Stock</dt>
                    <dd>{currentProduct.stock > 0 ? `${currentProduct.stock} pcs` : 'Out of stock'}</dd>
                  </div>
                  {currentProduct.sku && (
                    <div>
                      <dt>SKU</dt>
                      <dd>{currentProduct.sku}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <div className="selector-group">
                  <label className="selector-label">Style</label>
                  <div className="style-pills">
                    {currentProduct.styles.map((styleOpt) => (
                      <button
                        key={styleOpt}
                        type="button"
                        className={`style-pill-btn ${selectedStyle === styleOpt ? 'active' : ''}`}
                        onClick={() => setSelectedStyle(styleOpt)}
                      >
                        {styleOpt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
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
                    onClick={() =>
                      setQuantity((q) => Math.min(currentProduct.stock || 8, q + 1))
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="trust-badges-bar">
                <div className="trust-badge">
                  <Package size={22} className="badge-icon" />
                  <span>{currentProduct.specs?.purity || 'Antique finish'}</span>
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
                  <span>
                    {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cta-buttons-stack">
                <button
                  type="button"
                  className="cta-btn btn-add-cart"
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                >
                  {currentProduct.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
                <button
                  type="button"
                  className="cta-btn btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock === 0}
                >
                  BUY NOW
                </button>
                <button
                  type="button"
                  className={`cta-btn btn-wishlist${isWishlisted(currentProduct.id) ? ' active' : ''}`}
                  onClick={() => toggleWishlist(currentProduct)}
                  aria-pressed={isWishlisted(currentProduct.id)}
                >
                  <Heart size={17} />
                  {isWishlisted(currentProduct.id) ? 'SAVED IN WISHLIST' : 'ADD TO WISHLIST'}
                </button>
              </div>

              {/* Accordions */}
              <div className="accordions-wrapper">
                {/* Description Accordion */}
                <div className="accordion-block">
                  <button
                    type="button"
                    className="accordion-toggle"
                    onClick={() => toggleAccordion('description')}
                  >
                    <span>Description</span>
                    {openAccordion.description ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openAccordion.description && (
                    <div className="accordion-content">
                      <p>{currentProduct.details.description}</p>
                    </div>
                  )}
                </div>

                {/* Size & Material Accordion */}
                <div className="accordion-block">
                  <button
                    type="button"
                    className="accordion-toggle"
                    onClick={() => toggleAccordion('sizeAndMaterial')}
                  >
                    <span>Size &amp; Material</span>
                    {openAccordion.sizeAndMaterial ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openAccordion.sizeAndMaterial && (
                    <div className="accordion-content">
                      <p>{currentProduct.details.sizeAndMaterial}</p>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns Accordion */}
                <div className="accordion-block">
                  <button
                    type="button"
                    className="accordion-toggle"
                    onClick={() => toggleAccordion('shippingAndReturns')}
                  >
                    <span>Shipping &amp; Returns</span>
                    {openAccordion.shippingAndReturns ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {openAccordion.shippingAndReturns && (
                    <div className="accordion-content">
                      <p>{currentProduct.details.shippingAndReturns}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      <section className="section related-products-section">
        <div className="store-container">
          <div className="related-header-row">
            <h2 className="related-title-serif">You May Also Like</h2>
            <div className="related-carousel-nav">
              <button
                type="button"
                className="nav-circle-btn"
                onClick={prevProduct}
                aria-label="Previous product"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="nav-circle-btn"
                onClick={nextProduct}
                aria-label="Next product"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="related-cards-grid">
            {relatedItems.map((item) => (
              <div
                key={item.id}
                className="related-product-card"
                onClick={() => handleSelectRelated(item.id)}
              >
                <div className="related-card-media">
                  <img src={item.image} alt={item.name} />
                  <button
                    type="button"
                    className={`wishlist-heart-btn${isWishlisted(item.id) ? ' active' : ''}`}
                    aria-label={
                      isWishlisted(item.id)
                        ? `Remove ${item.name} from wishlist`
                        : `Add ${item.name} to wishlist`
                    }
                    aria-pressed={isWishlisted(item.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                  >
                    <Heart size={17} />
                  </button>
                </div>
                <div className="related-card-meta">
                  <h3 className="related-card-name">{item.name}</h3>
                  <span className="related-card-price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  );
};

export default Collections;
