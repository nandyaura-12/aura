import imgRings from '../assets/jewellery/img-rings.png';
import imgOrbitalRing from '../assets/jewellery/img-orbital-ring.jpg';

const CLOUD_NAME = 'mxihlfki';

/** Build a Cloudinary delivery URL (public CDN — no API secret needed to display). */
export const cld = (publicId, transforms = 'f_auto,q_auto') =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;

const j = (n) => cld(`aura/jewellery/img${String(n).padStart(2, '0')}`);

export const jewellery = {
  img01: j(1),
  img02: j(2),
  img03: j(3),
  img04: j(4),
  img05: j(5),
  img06: j(6),
  img07: j(7),
  img08: j(8),
  img09: j(9),
  img10: j(10),
  img11: j(11),
  img12: j(12),
  img13: j(13),
  img14: j(14),
  img15: j(15),
  img16: j(16),
  img17: j(17),
  img18: j(18),
  img19: j(19),
  img20: j(20),
  img21: j(21),
  img22: j(22),
  img23: j(23),
};

export const hero = {
  main: jewellery.img07,
  thumb1: jewellery.img12,
  thumb2: jewellery.img04,
};

export const categories = [
  { name: 'NECKLACE SETS', image: jewellery.img21 },
  { name: 'EARRINGS', image: jewellery.img13 },
  { name: 'PENDANT SETS', image: jewellery.img18 },
  { name: 'BANGLES', image: jewellery.img23 },
];

export const collections = [
  { image: jewellery.img17, slot: 'tall', alt: 'Floral necklace jewellery set' },
  { image: jewellery.img06, slot: 'right-top', alt: 'Emerald open bangle' },
  { image: jewellery.img11, slot: 'mid-left', alt: 'Floral enamel bangles' },
  { image: jewellery.img10, slot: 'mid-right', alt: 'Gemstone hand chain' },
  { image: jewellery.img14, slot: 'right-bot', alt: 'Emerald statement bangle' },
];

export const exploreCategories = [
  { name: 'RINGS', image: imgRings },
  { name: 'NECKLACES', image: cld('aura/explore/necklaces') },
  { name: 'BANGLES', image: cld('aura/explore/bracelets') },
  { name: 'EARRINGS', image: cld('aura/explore/earrings') },
];

export const exploreGallery = {
  lifestyle: cld('aura/explore/lifestyle'),
  hoops: cld('aura/explore/hoops'),
  chains: cld('aura/explore/chains'),
};

export const featured = [
  { name: 'HALO DIAMOND RING', price: '₹2,499', image: imgOrbitalRing },
  { name: 'PENDANT EARRING SET', price: '₹1,899', image: jewellery.img02 },
  { name: 'EMERALD STATEMENT BANGLE', price: '₹2,199', image: jewellery.img14 },
  { name: 'FLORAL PENDANT SET', price: '₹1,299', image: jewellery.img16 },
];

export const bestSellers = [
  { name: 'Floral Ruby Bangle', price: '₹2,999', rating: '4.9', image: jewellery.img01, tall: true },
  { name: 'Ruby Gemstone Bangle', price: '₹1,499', rating: '4.8', image: jewellery.img19, tall: true },
  { name: 'Ornate Pendant Necklace', price: '₹1,799', rating: '5.0', image: jewellery.img03, tall: true },
  { name: 'Leaf Pendant Set', price: '₹2,499', rating: '4.9', image: jewellery.img20, tall: true },
  { name: 'Floral Gemstone Bangle', price: '₹1,199', rating: '4.9', image: jewellery.img05 },
  { name: 'Emerald Statement Bangle', price: '₹1,699', rating: '5.0', image: jewellery.img14, tall: true },
  { name: 'Gemstone Hand Chain', price: '₹1,399', rating: '4.8', image: jewellery.img10 },
  { name: 'Pearl Flower Studs', price: '₹899', rating: '4.9', image: jewellery.img04, tall: true },
];

export const curated = [
  { name: 'GREEN GEMSTONE NECKLACE', price: '₹2,999', image: jewellery.img12 },
  { name: 'PEARL PENDANT SET', price: '₹1,299', image: jewellery.img18 },
  { name: 'EMERALD STATEMENT BANGLE', price: '₹1,899', image: jewellery.img14 },
  { name: 'FLORAL PENDANT SET', price: '₹3,499', image: jewellery.img16 },
];

export const grace = {
  image: jewellery.img10,
};

export const brandLogo = cld('aura/brand/logo');

export const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Bride, Chennai',
    quote:
      'The temple set looked like my grandmother\u2019s heirloom. Beautiful antique finish and lovely packaging.',
    avatar: jewellery.img20,
  },
  {
    name: 'Ananya Reddy',
    role: 'Festive Buyer, Hyderabad',
    quote:
      'Nandys Aura completed my traditional look. The kemp stones and dull antique tone are perfect — not shiny, just classic.',
    avatar: jewellery.img12,
  },
  {
    name: 'Meera Kapoor',
    role: 'Collector, Bengaluru',
    quote:
      'From jhumkas to harams, every piece feels like it came from an old temple town workshop.',
    avatar: jewellery.img03,
  },
];
