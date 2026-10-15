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
} from 'lucide-react';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useCart } from '../context/CartContext';
import { jewellery } from '../data/images';
import { toStoreProduct } from '../data/catalog';
import { fetchProducts } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Collections.css';

// Shown until the admin catalogue responds, and if the API is unavailable.
const fallbackCatalog = [
  {
    id: 'zodiac-sign-necklace',
    title: 'Zodiac Sign Necklace',
    originalPrice: '₹3,999',
    price: '₹3,199',
    rating: '4.9',
    reviewsCount: 124,
    onSale: true,
    description:
      'Handcrafted in solid 14k yellow gold, the Aurelia Cuff is a masterpiece in minimalist luxury. Its subtle curve reflects light beautifully, designed to be worn effortlessly day or night.',
    styles: ['Small', 'Medium', 'Large'],
    images: [
      jewellery.img21,
      jewellery.img07,
      jewellery.img12,
      jewellery.img20,
    ],
    details: {
      description:
        'Beautifully crafted design for everyday elegance. This stunning piece makes for a versatile addition to any wardrobe, catching the light perfectly with its polished finish.',
      sizeAndMaterial:
        'Hand-finished 14K solid yellow gold. Adjustable chain length: 16 to 18 inches. Pendant diameter: 16mm. Average weight: 4.2 grams. Nickel-free, lead-free and hypoallergenic.',
      shippingAndReturns:
        'Free insured express shipping across India. Standard delivery within 3-5 business days. Easy 30-day hassle-free return and exchange policy in original condition with certificate.',
    },
  },
  {
    id: 'the-gilmore-ring',
    title: 'The Gilmore Ring',
    originalPrice: '₹350',
    price: '₹280',
    rating: '4.8',
    reviewsCount: 86,
    onSale: true,
    description:
      'An exquisite solitaire ring featuring a cushion-cut crystal encased in warm 14k yellow gold. Designed for stacking or standing out on its own.',
    styles: ['Small', 'Medium', 'Large'],
    images: [
      jewellery.img05,
      jewellery.img02,
      jewellery.img16,
      jewellery.img04,
    ],
    details: {
      description:
        'Hand-finished band crafted with polished gold detailing and sparkling gemstone setting for timeless sophistication.',
      sizeAndMaterial:
        'Solid 14k Yellow Gold, 2.5mm band width, conflict-free ethically sourced stone. Sizes available: 6, 7, 8.',
      shippingAndReturns:
        'Ships next business day in signature gift packaging. 30-day money-back guarantee.',
    },
  },
  {
    id: 'minimalist-gold-chain',
    title: 'Minimalist Gold Chain',
    originalPrice: '₹400',
    price: '₹320',
    rating: '5.0',
    reviewsCount: 94,
    onSale: true,
    description:
      'A sleek gold chain with a delicate bow pendant symbolising grace and connectivity. Lightweight, elegant, and durable.',
    styles: ['Small', 'Medium', 'Large'],
    images: [
      jewellery.img01,
      jewellery.img10,
      jewellery.img14,
      jewellery.img03,
    ],
    details: {
      description:
        'Perfect for layering with longer chains or worn alone as a subtle statement of elegance.',
      sizeAndMaterial:
        '14k Solid Gold, 18-inch chain with secure lobster clasp fastening.',
      shippingAndReturns:
        'Free standard shipping nationwide. Guaranteed authentic certification included.',
    },
  },
  {
    id: 'pearl-drop-earrings',
    title: 'Pearl Drop Earrings',
    originalPrice: '₹480',
    price: '₹390',
    rating: '4.9',
    reviewsCount: 68,
    onSale: true,
    description:
      'Vintage-inspired drop earrings showcasing deep blue sapphire-tone crystals framed by intricate filigree gold craft.',
    styles: ['Standard'],
    images: [
      jewellery.img13,
      jewellery.img18,
      jewellery.img19,
      jewellery.img06,
    ],
    details: {
      description:
        'Captivating drop earrings that capture light with every movement. Handcrafted by master artisans.',
      sizeAndMaterial:
        'Solid Gold with synthetic royal blue sapphire and micro-pave detailing. Length: 28mm.',
      shippingAndReturns:
        'Free express shipping with signature requirement. 30 days return policy.',
    },
  },
  {
    id: 'diamond-solitaire-necklace',
    title: 'Diamond Solitaire Necklace',
    originalPrice: '₹550',
    price: '₹450',
    rating: '5.0',
    reviewsCount: 142,
    onSale: true,
    description:
      'A geometric teal diamond solitaire pendant suspended on an intricate multi-strand gold chain.',
    styles: ['Small', 'Medium', 'Large'],
    images: [
      jewellery.img03,
      jewellery.img21,
      jewellery.img17,
      jewellery.img22,
    ],
    details: {
      description:
        'Striking modern geometry meets classic gold craftsmanship in this iconic centerpiece necklace.',
      sizeAndMaterial:
        '14K Solid Gold, faceted teal gem crystal, 18-inch adjustable cable chain.',
      shippingAndReturns:
        'Includes complimentary velvet presentation box and certificate of authenticity.',
    },
  },
];

const Collections = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
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
    if (piece) {
      const idx = catalog.findIndex((product) => product.id === piece);
      if (idx >= 0) {
        setActiveProductIndex(idx);
        setSelectedImageIndex(0);
        setSelectedStyle(catalog[idx].styles[0] || 'Medium');
        setQuantity(1);
        return;
      }
    }
    setActiveProductIndex((index) => Math.min(index, Math.max(catalog.length - 1, 0)));
    setSelectedImageIndex(0);
    setSelectedStyle(catalog[0]?.styles[0] || 'Medium');
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
                  src={currentProduct.images[selectedImageIndex]}
                  alt={currentProduct.title}
                  className="main-product-img"
                />
              </div>

              {/* 4 Thumbnails */}
              <div className="thumbnails-grid">
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
            </div>

            {/* Right Column: Product Information */}
            <div className="product-info-col">
              <h1 className="product-title-serif">{currentProduct.title}</h1>

              {/* Price & Sale Badge */}
              <div className="product-price-row">
                {currentProduct.originalPrice && (
                  <span className="price-original">{currentProduct.originalPrice}</span>
                )}
                <span className="price-current">{currentProduct.price}</span>
                {currentProduct.onSale && <span className="badge-sale">SALE</span>}
              </div>

              {/* Rating */}
              <div className="product-rating-row">
                <div className="stars-flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#E8B923" stroke="none" />
                  ))}
                </div>
                <span className="review-count">({currentProduct.reviewsCount})</span>
              </div>

              {/* Product Lead Copy */}
              <p className="product-lead-copy">{currentProduct.description}</p>

              {/* Style Selector */}
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
                  <span>14K GOLD</span>
                </div>
                <div className="trust-badge">
                  <Truck size={22} className="badge-icon" />
                  <span>FREE EXPRESS SHIPPING</span>
                </div>
                <div className="trust-badge">
                  <RotateCcw size={22} className="badge-icon" />
                  <span>EASY 30 DAYS RETURN</span>
                </div>
                <div className="trust-badge">
                  <Gem size={22} className="badge-icon" />
                  <span>CERTIFIED NATURAL DIAMONDS</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cta-buttons-stack">
                <button
                  type="button"
                  className="cta-btn btn-add-cart"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
                <button
                  type="button"
                  className="cta-btn btn-buy-now"
                  onClick={handleBuyNow}
                >
                  BUY NOW
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
