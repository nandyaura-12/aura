import { jewellery } from './images';

/**
 * Festival Offer Popup — settings
 * --------------------------------
 * MAIN SETTING ADMIN LA: Admin > Offers > oru offer la
 * "Set as Festival Popup" button click panna adhu popup-a varum.
 * (title, discount, code, image, date ellame andha offer dhu)
 *
 * Inga irukuradhu:
 *  - showOnPaths : popup + Festival Offer button enga theriyanum
 *  - fallbackOffer : backend/offers illana theriyura default offer
 */
export const festivalOfferConfig = {
  enabled: true,
  showOnPaths: ['/', '/collections', '/about', '/contact'],
  delayMs: 1200,
  showAgain: 'session', // close panna andha visit la marubadiyum auto-varadhu (button click panna varum)
  fallbackOffer: {
    eyebrow: '✦ Festival Special ✦',
    title: 'Festival Offer',
    highlight: 'Up to 25% OFF',
    description:
      'Handcrafted antique & temple jewellery for your festive look — nakshi work, kemp stones and timeless finishes.',
    code: 'FESTIVE25',
    ctaText: 'Shop Now',
    ctaLink: '/collections',
    image: jewellery.img14,
    endDate: null,
  },
};
