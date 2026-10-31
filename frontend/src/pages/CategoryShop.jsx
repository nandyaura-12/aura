import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { jewellery } from '../data/images';
import { formatInr, toStoreProduct } from '../data/catalog';
import {
  SHOP_CATEGORIES,
  getCategoryBySlug,
  categoryPath,
} from '../data/shopCategories';
import { fetchProducts, fetchCategories } from '../services/api';
import '../styles/pages/storefront.css';
import '../styles/pages/Wishlist.css';
import '../styles/pages/CategoryShop.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Certified Quality', text: 'Antique finish guarantee' },
  { icon: CreditCard, title: 'Secure Payments', text: 'UPI, cards & COD' },
  { icon: Truck, title: 'Free Shipping', text: 'Insured, pan India' },
  { icon: RotateCcw, title: 'Easy Returns', text: '7-day, no questions' },
  { icon: Sparkles, title: 'Personal Stylist', text: 'WhatsApp styling help' },
];

const defaultFilters = {
  priceMax: null,
  finishes: [],
  inStockOnly: false,
  featuredOnly: false,
  onSaleOnly: false,
};

const CategoryShop = () => {
  const { categorySlug } = useParams();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addItem } = useCart();
  const [categories, setCategories] = useState(SHOP_CATEGORIES);
  const [category, setCategory] = useState(() => getCategoryBySlug(categorySlug));
  const [categoryReady, setCategoryReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('featured');
  const [filters, setFilters] = useState(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCategoryReady(false);

    fetchCategories()
      .then((res) => {
        if (cancelled) return;
        const active = (res.data || [])
          .filter((item) => item.status !== 'Inactive')
          .sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          );
        const list = active.length ? active : SHOP_CATEGORIES;
        setCategories(list);
        setCategory(
          list.find((item) => item.slug === categorySlug) ||
            getCategoryBySlug(categorySlug) ||
            null
        );
      })
      .catch(() => {
        if (cancelled) return;
        setCategories(SHOP_CATEGORIES);
        setCategory(getCategoryBySlug(categorySlug) || null);
      })
      .finally(() => {
        if (!cancelled) setCategoryReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  useEffect(() => {
    if (!category) return undefined;
    let cancelled = false;
    setLoading(true);
    setFilters(defaultFilters);
    setSort('featured');

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

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 50000 };
    const prices = products.map((p) => p.unitPrice || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const priceCeiling = filters.priceMax ?? priceBounds.max;

  const finishOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.specs?.purity) set.add(p.specs.purity);
    });
    return [...set];
  }, [products]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.priceMax != null && filters.priceMax < priceBounds.max) {
      chips.push({
        key: 'price',
        label: `Under ${formatInr(filters.priceMax)}`,
      });
    }
    filters.finishes.forEach((finish) => {
      chips.push({ key: `finish:${finish}`, label: finish });
    });
    if (filters.featuredOnly) chips.push({ key: 'featured', label: 'Featured' });
    if (filters.onSaleOnly) chips.push({ key: 'sale', label: 'On sale' });
    if (filters.inStockOnly) chips.push({ key: 'stock', label: 'In stock' });
    return chips;
  }, [filters, priceBounds.max]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((product) => {
      if (product.unitPrice > priceCeiling) return false;
      if (filters.inStockOnly && product.stock <= 0) return false;
      if (filters.featuredOnly && !product.isFeatured) return false;
      if (filters.onSaleOnly && !product.onSale) return false;
      if (
        filters.finishes.length &&
        !filters.finishes.includes(product.specs?.purity)
      ) {
        return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.unitPrice - b.unitPrice;
      if (sort === 'price-desc') return b.unitPrice - a.unitPrice;
      if (sort === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [products, priceCeiling, filters, sort]);

  const clearFilters = () => setFilters(defaultFilters);

  const removeChip = (key) => {
    if (key === 'price') {
      setFilters((prev) => ({ ...prev, priceMax: null }));
      return;
    }
    if (key === 'featured') {
      setFilters((prev) => ({ ...prev, featuredOnly: false }));
      return;
    }
    if (key === 'sale') {
      setFilters((prev) => ({ ...prev, onSaleOnly: false }));
      return;
    }
    if (key === 'stock') {
      setFilters((prev) => ({ ...prev, inStockOnly: false }));
      return;
    }
    if (key.startsWith('finish:')) {
      const finish = key.slice(7);
      setFilters((prev) => ({
        ...prev,
        finishes: prev.finishes.filter((item) => item !== finish),
      }));
    }
  };

  const toggleFinish = (finish) => {
    setFilters((prev) => ({
      ...prev,
      finishes: prev.finishes.includes(finish)
        ? prev.finishes.filter((item) => item !== finish)
        : [...prev.finishes, finish],
    }));
  };

  const handleAddToBag = (product) => {
    if (product.stock <= 0) {
      toast.info('This piece is currently out of stock');
      return;
    }
    addItem({
      id: product.id,
      title: product.title,
      meta: product.specs?.purity || 'Antique finish',
      sku: product.sku || String(product.id).toUpperCase(),
      unitPrice: product.unitPrice || 0,
      currency: 'INR',
      image: product.images?.[0],
      stock: product.stock,
      qty: 1,
    });
    toast.success(`${product.title} added to bag`);
  };

  if (!categoryReady) {
    return (
      <div className="storefront category-shop">
        <StoreHeader />
        <div className="store-container category-shop__loading">Loading collection…</div>
        <StoreFooter />
      </div>
    );
  }

  if (!category) {
    return <Navigate to="/#shop" replace />;
  }

  const heroImage = category.image || jewellery.img07;
  const countLabel = loading
    ? 'Gathering designs…'
    : `${visibleProducts.length} ${visibleProducts.length === 1 ? 'design' : 'designs'} available`;

  const filterPanel = (
    <aside className="category-shop__filters" aria-label="Refine collection">
      <div className="category-shop__filters-head">
        <h2>Refine</h2>
        <button
          type="button"
          className="category-shop__filters-close"
          onClick={() => setFiltersOpen(false)}
          aria-label="Close filters"
        >
          <X size={18} />
        </button>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="category-shop__chips">
          {activeFilterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="category-shop__chip"
              onClick={() => removeChip(chip.key)}
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button type="button" className="category-shop__clear" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}

      <div className="category-shop__filter-block">
        <h3>Price</h3>
        <div className="category-shop__price-row">
          <span>{formatInr(priceBounds.min)}</span>
          <span>Up to {formatInr(priceCeiling)}</span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max || priceBounds.min + 1}
          step={Math.max(100, Math.round((priceBounds.max - priceBounds.min) / 40) || 100)}
          value={priceCeiling}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceMax: Number(e.target.value),
            }))
          }
          aria-label="Maximum price"
        />
      </div>

      {finishOptions.length > 0 && (
        <div className="category-shop__filter-block">
          <h3>Finish</h3>
          <div className="category-shop__checklist">
            {finishOptions.map((finish) => (
              <label key={finish}>
                <input
                  type="checkbox"
                  checked={filters.finishes.includes(finish)}
                  onChange={() => toggleFinish(finish)}
                />
                <span>{finish}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="category-shop__filter-block">
        <h3>Highlights</h3>
        <div className="category-shop__checklist">
          <label>
            <input
              type="checkbox"
              checked={filters.featuredOnly}
              onChange={() =>
                setFilters((prev) => ({ ...prev, featuredOnly: !prev.featuredOnly }))
              }
            />
            <span>Featured pieces</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={() =>
                setFilters((prev) => ({ ...prev, onSaleOnly: !prev.onSaleOnly }))
              }
            />
            <span>On sale</span>
          </label>
        </div>
      </div>

      <div className="category-shop__filter-block category-shop__filter-block--toggle">
        <span>In stock only</span>
        <button
          type="button"
          role="switch"
          aria-checked={filters.inStockOnly}
          className={`category-shop__switch${filters.inStockOnly ? ' is-on' : ''}`}
          onClick={() =>
            setFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
          }
        >
          <span />
        </button>
      </div>

      <div className="category-shop__filter-block">
        <h3>Browse</h3>
        <nav className="category-shop__browse">
          {categories.map((item) => (
            <Link
              key={item.slug || item._id}
              to={categoryPath(item.slug || item.name)}
              className={item.slug === category.slug ? 'is-active' : ''}
              onClick={() => setFiltersOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );

  return (
    <div className="storefront category-shop">
      <StoreHeader />

      <section className="category-shop__hero store-container">
        <div className="category-shop__hero-copy">
          <p className="category-shop__eyebrow">Antique collection</p>
          <h1>{category.name}</h1>
          <p>
            {category.description ||
              `Hand-finished antique pieces from the ${category.name} edit — crafted to complement every version of you.`}
          </p>
        </div>
        <figure className="category-shop__hero-media">
          <img src={heroImage} alt="" aria-hidden="true" />
        </figure>
      </section>

      <section className="category-shop__board store-container">
        <div className="category-shop__toolbar">
          <div>
            <h2>Shop All {category.name}</h2>
            <p>{countLabel}</p>
          </div>
          <div className="category-shop__toolbar-actions">
            <button
              type="button"
              className="category-shop__refine-btn"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} />
              Refine
            </button>
            <label className="category-shop__sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="category-shop__layout">
          <div className="category-shop__filters-desktop">{filterPanel}</div>

          <div className="category-shop__results">
            {!loading && visibleProducts.length === 0 ? (
              <div className="category-shop__empty">
                <h3>No pieces match these filters</h3>
                <p>Try clearing filters or browse another collection.</p>
                <button type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="category-shop__grid">
                {(loading ? Array.from({ length: 4 }, (_, i) => ({ id: `s-${i}`, skeleton: true })) : visibleProducts).map(
                  (product) =>
                    product.skeleton ? (
                      <article key={product.id} className="category-shop__card is-skeleton" />
                    ) : (
                      <article key={product.id} className="category-shop__card">
                        <div className="category-shop__card-media">
                          <Link to={`/collections?piece=${product.id}`}>
                            <img
                              src={product.images?.[0] || jewellery.img01}
                              alt={product.title}
                            />
                          </Link>
                          {(product.specs?.offerTag || product.isFeatured || product.onSale) && (
                            <span className="category-shop__badge">
                              {product.specs?.offerTag ||
                                (product.onSale ? 'Sale' : 'Bestseller')}
                            </span>
                          )}
                          <button
                            type="button"
                            className={`wishlist-heart-btn${isWishlisted(product.id) ? ' active' : ''}`}
                            aria-label={
                              isWishlisted(product.id)
                                ? `Remove ${product.title} from wishlist`
                                : `Add ${product.title} to wishlist`
                            }
                            aria-pressed={isWishlisted(product.id)}
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
                        </div>
                        <div className="category-shop__card-body">
                          <Link to={`/collections?piece=${product.id}`}>
                            <h3>{product.title}</h3>
                            <p className="category-shop__card-meta">
                              {product.specs?.purity || 'Antique matte finish'}
                            </p>
                          </Link>
                          <div className="category-shop__card-price">
                            <strong>{product.price || formatInr(product.unitPrice)}</strong>
                            {product.originalPrice && <span>{product.originalPrice}</span>}
                          </div>
                          <button
                            type="button"
                            className="category-shop__bag-btn"
                            disabled={product.stock <= 0}
                            onClick={() => handleAddToBag(product)}
                          >
                            {product.stock <= 0 ? 'Out of stock' : 'Add to bag'}
                          </button>
                        </div>
                      </article>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="category-shop__trust" aria-label="Shopping assurances">
        <div className="store-container category-shop__trust-row">
          {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="category-shop__trust-item">
              <Icon size={20} strokeWidth={1.6} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {filtersOpen && (
        <div className="category-shop__drawer" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="category-shop__drawer-backdrop"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="category-shop__drawer-panel">{filterPanel}</div>
        </div>
      )}

      <StoreFooter />
    </div>
  );
};

export default CategoryShop;
