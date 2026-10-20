import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Copy, Check, Sparkles, PartyPopper } from 'lucide-react';
import { fetchOffers } from '../../services/api';
import { festivalOfferConfig } from '../../data/festivalOffer';
import '../../styles/components/FestivalOfferPopup.css';

const DISMISS_KEY = 'nandys-festival-popup-dismissed';

const isWithinDates = (o) => {
  const now = Date.now();
  if (o.startDate && new Date(o.startDate).getTime() > now) return false;
  if (o.endDate && new Date(o.endDate).getTime() < now) return false;
  return true;
};

function useCountdown(endDate) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    if (!endDate) return undefined;
    const tick = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) { setLeft(null); return; }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return left;
}

const FestivalOfferPopup = () => {
  const { pathname } = useLocation();
  const [offer, setOffer] = useState(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const shouldShowOnPage = useMemo(() => {
    if (!festivalOfferConfig.enabled) return false;
    if (pathname.startsWith('/admin') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')) return false;
    return festivalOfferConfig.showOnPaths.includes(pathname);
  }, [pathname]);

  const dismissId = offer ? `${offer.code}:${offer.endDate || ''}` : '';
  const countdown = useCountdown(visible ? offer?.endDate : null);

  const close = useCallback(() => {
    setVisible(false);
    try {
      const store = festivalOfferConfig.showAgain === 'session' ? sessionStorage : localStorage;
      store.setItem(DISMISS_KEY, dismissId);
    } catch { /* ignore */ }
  }, [dismissId]);

  const openManually = () => { setCopied(false); setVisible(true); };

  // Admin la showAsPopup set panna offer-a edukkanum
  useEffect(() => {
    if (!shouldShowOnPage) return undefined;
    let cancelled = false;
    fetchOffers()
      .then((res) => {
        if (cancelled) return;
        const list = res.data || [];
        const popupOffer = list.find((o) => o.showAsPopup && o.status === 'Active' && isWithinDates(o));
        if (popupOffer) {
          const off = popupOffer.discountType === 'Percentage'
            ? `${popupOffer.discountValue}% OFF`
            : `₹${Number(popupOffer.discountValue).toLocaleString('en-IN')} OFF`;
          setOffer({
            eyebrow: '✦ Festival Special ✦',
            title: popupOffer.title,
            highlight: off,
            description: popupOffer.minimumPurchase
              ? `On orders above ₹${Number(popupOffer.minimumPurchase).toLocaleString('en-IN')} · Handcrafted antique & temple jewellery for your festive look.`
              : 'Handcrafted antique & temple jewellery for your festive look.',
            code: popupOffer.code,
            ctaText: popupOffer.popupButtonText || 'Shop Now',
            ctaLink: '/collections',
            image: popupOffer.bannerImage || festivalOfferConfig.fallbackOffer.image,
            endDate: popupOffer.endDate || null,
          });
        } else if (list.length === 0) {
          setOffer(festivalOfferConfig.fallbackOffer);
        } else {
          setOffer(null); // Offers iruku, aana admin popup set pannala → popup varadhu
        }
      })
      .catch(() => { if (!cancelled) setOffer(festivalOfferConfig.fallbackOffer); });
    return () => { cancelled = true; };
  }, [shouldShowOnPage]);

  // Page open aana delay kalichu auto-popup
  useEffect(() => {
    if (!offer || !shouldShowOnPage) return undefined;
    try {
      const store = festivalOfferConfig.showAgain === 'session' ? sessionStorage : localStorage;
      if (dismissId && store.getItem(DISMISS_KEY) === dismissId) return undefined;
    } catch { /* ignore */ }
    const id = setTimeout(() => setVisible(true), festivalOfferConfig.delayMs);
    return () => clearTimeout(id);
  }, [offer, shouldShowOnPage, dismissId]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, close]);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(offer.code); } catch {
      const el = document.createElement('textarea');
      el.value = offer.code; document.body.appendChild(el); el.select();
      document.execCommand('copy'); el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shouldShowOnPage || !offer) return null;
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      {/* Festival Offer Button — click panna popup open aagum */}
      {!visible && (
        <button type="button" className="fest-fab" onClick={openManually} aria-label="Open festival offer">
          <PartyPopper size={16} /> Festival Offer
        </button>
      )}

      {visible && (
        <div className="fest-overlay" onClick={close} role="dialog" aria-modal="true" aria-label={offer.title}>
          <div className="fest-popup" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="fest-close" onClick={close} aria-label="Close offer"><X size={18} /></button>
            <div className="fest-media">
              <img src={offer.image} alt={offer.title} />
              <span className="fest-badge"><Sparkles size={13} /> {offer.highlight}</span>
            </div>
            <div className="fest-body">
              <p className="fest-eyebrow">{offer.eyebrow}</p>
              <h2 className="fest-title">{offer.title}</h2>
              <p className="fest-highlight">{offer.highlight}</p>
              <p className="fest-desc">{offer.description}</p>
              {countdown && (
                <div className="fest-countdown" aria-label="Offer ends in">
                  {[['Days', countdown.d], ['Hrs', countdown.h], ['Min', countdown.m], ['Sec', countdown.s]].map(([label, v]) => (
                    <span key={label} className="fest-time"><strong>{pad(v)}</strong><small>{label}</small></span>
                  ))}
                </div>
              )}
              <button type="button" className="fest-code" onClick={copyCode} title="Copy code">
                <span>{offer.code}</span>
                {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
              </button>
              <Link to={offer.ctaLink} className="fest-cta" onClick={close}>{offer.ctaText}</Link>
              <button type="button" className="fest-later" onClick={close}>No thanks, continue shopping</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FestivalOfferPopup;
