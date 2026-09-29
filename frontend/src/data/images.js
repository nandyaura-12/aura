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
  { name: 'RINGS', image: jewellery.img05 },
  { name: 'EARRINGS', image: jewellery.img13 },
  { name: 'NECKLACES', image: jewellery.img21 },
  { name: 'BRACELETS', image: jewellery.img23 },
];

export const collections = [
  { image: jewellery.img17, slot: 'tall', alt: 'Floral gemstone necklace set' },
  { image: jewellery.img06, slot: 'right-top', alt: 'Emerald gold bangle' },
  { image: jewellery.img11, slot: 'mid-left', alt: 'Enamel floral bangles' },
  { image: jewellery.img10, slot: 'mid-right', alt: 'Hand chain bracelet' },
  { image: jewellery.img14, slot: 'right-bot', alt: 'Gemstone bracelets display' },
];

export const exploreCategories = [
  { name: 'RINGS', image: imgRings },
  { name: 'NECKLACES', image: cld('aura/explore/necklaces') },
  { name: 'BRACELETS', image: cld('aura/explore/bracelets') },
  { name: 'EARRINGS', image: cld('aura/explore/earrings') },
];

export const exploreGallery = {
  lifestyle: cld('aura/explore/lifestyle'),
  hoops: cld('aura/explore/hoops'),
  chains: cld('aura/explore/chains'),
};

export const featured = [
  { name: 'ORBITAL RING', price: '$420', image: imgOrbitalRing },
  { name: 'TEXTURE COIL', price: '$550', image: jewellery.img02 },
  { name: 'RAW CHARM', price: '$320', image: jewellery.img14 },
  { name: 'DUO BAND', price: '$460', image: jewellery.img16 },
];

export const bestSellers = [
  { name: 'Velina Drop Necklace', price: '₹563', rating: '4.9', image: jewellery.img01, tall: true },
  { name: 'Ruby Oval Bracelet', price: '₹899', rating: '4.8', image: jewellery.img19, tall: true },
  { name: 'Pearl Bloom Pendant', price: '₹1,240', rating: '5.0', image: jewellery.img03, tall: true },
  { name: 'Amber Leaf Set', price: '₹1,560', rating: '4.9', image: jewellery.img20, tall: true },
  { name: 'Floral Enamel Bangle', price: '₹720', rating: '4.9', image: jewellery.img05 },
  { name: 'Emerald Filigree Cuff', price: '₹980', rating: '5.0', image: jewellery.img14, tall: true },
  { name: 'Hand Chain Grace', price: '₹640', rating: '4.8', image: jewellery.img10 },
  { name: 'Rose Pearl Stud', price: '₹450', rating: '4.9', image: jewellery.img04, tall: true },
];

export const curated = [
  { name: 'CLASSIC CHAIN', price: '$890', image: jewellery.img12 },
  { name: 'DROP STUD', price: '$420', image: jewellery.img18 },
  { name: 'EMERALD CUFF', price: '$640', image: jewellery.img14 },
  { name: 'FLORAL SET', price: '$720', image: jewellery.img16 },
];

export const grace = {
  image: jewellery.img10,
};

export const brandLogo = cld('aura/brand/logo');

export const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Designer, Mumbai',
    quote:
      'Every piece feels curated with love. The craftsmanship is breathtaking and packaging was beautiful.',
    avatar: jewellery.img20,
  },
  {
    name: 'Ananya Reddy',
    role: 'Founder, Atelier',
    quote:
      'Nandys Aura elevated my bridal look. Soft gold tones and gemstones that catch every light.',
    avatar: jewellery.img12,
  },
  {
    name: 'Meera Kapoor',
    role: 'Stylist',
    quote:
      'From everyday chains to statement sets, the collection blends modern design with classic beauty.',
    avatar: jewellery.img03,
  },
];
