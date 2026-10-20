import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import StoreHeader from '../components/store/StoreHeader';
import StoreFooter from '../components/store/StoreFooter';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatInr } from '../data/catalog';
import '../styles/pages/storefront.css';
import '../styles/pages/Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    addItem({
      id: item.slug || item.id,
      title: item.title,
      meta: 'Standard',
      sku: String(item.slug || item.id || '').toUpperCase(),
      unitPrice: item.unitPrice || 0,
      currency: 'INR',
      image: item.image,
      stock: item.stock || 8,
      qty: 1,
    });
    toast.success(`Added ${item.title} to your cart!`);
  };

  return (
    <div className="storefront">
      <StoreHeader />
      <main className="wishlist-main">
        <div className="store-container">
          <h1 className="wishlist-title">
            My Wishlist
            {wishlistItems.length > 0 && (
              <span>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'piece' : 'pieces'}
              </span>
            )}
          </h1>

          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <Heart size={42} strokeWidth={1.25} />
              <h2>Your wishlist is empty</h2>
              <p>
                Tap the heart on any antique piece you love — it will be saved here
                so you can find it again and buy it anytime.
              </p>
              <Link to="/collections" className="wishlist-shop-btn">
                Shop Antique Collections
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <article key={item.id} className="wishlist-card">
                  <button
                    type="button"
                    className="wishlist-card-media"
                    onClick={() => navigate(item.slug ? `/collections?piece=${item.slug}` : '/collections')}
                  >
                    {item.image && <img src={item.image} alt={item.title} />}
                  </button>
                  <div className="wishlist-card-body">
                    <h3>{item.title}</h3>
                    <strong>{item.price || formatInr(item.unitPrice)}</strong>
                    <div className="wishlist-card-actions">
                      <button
                        type="button"
                        className="wishlist-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag size={15} /> Add to Cart
                      </button>
                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        aria-label={`Remove ${item.title} from wishlist`}
                        title="Remove from wishlist"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};

export default Wishlist;
