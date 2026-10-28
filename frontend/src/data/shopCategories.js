import { jewellery } from './images';

/** Shop-by-category list — matches Collections dropdown order. */
export const SHOP_CATEGORIES = [
  {
    name: 'Necklace Sets',
    slug: 'necklace-sets',
    group: 'type',
    description: 'Coordinated necklace and earring sets in antique and temple finishes.',
    image: jewellery.img21,
  },
  {
    name: 'Pendant Sets',
    slug: 'pendant-sets',
    group: 'type',
    description: 'Pendant necklaces and matching sets with floral and pearl detailing.',
    image: jewellery.img18,
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    group: 'type',
    description: 'Pearl studs, ornate drops, jhumkas and pendant earring sets.',
    image: jewellery.img13,
  },
  {
    name: 'Bangles',
    slug: 'bangles',
    group: 'type',
    description: 'Floral gemstone bangles and statement emerald / ruby wrist pieces.',
    image: jewellery.img23,
  },
  {
    name: 'Rings',
    slug: 'rings',
    group: 'type',
    description: 'Everyday and statement rings with antique matte finishes.',
    image: jewellery.img16,
  },
  {
    name: 'Hand Chains',
    slug: 'hand-chains',
    group: 'type',
    description: 'Delicate hand chains and hath phools for festive looks.',
    image: jewellery.img10,
  },
  {
    name: 'Festive & Bridal Wear',
    slug: 'festive-bridal-wear',
    group: 'occasion',
    description: 'Statement bridal and festive pieces for weddings and celebrations.',
    image: jewellery.img07,
  },
  {
    name: 'Everyday Essentials',
    slug: 'everyday-essentials',
    group: 'occasion',
    description: 'Light, wearable pieces made for daily polish.',
    image: jewellery.img04,
  },
  {
    name: "Men's Collection",
    slug: 'mens-collection',
    group: 'occasion',
    description: 'Subtle antique pieces styled for him.',
    image: jewellery.img03,
  },
];

export const TYPE_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.group === 'type');
export const OCCASION_CATEGORIES = SHOP_CATEGORIES.filter((c) => c.group === 'occasion');

export const slugifyCategory = (name = '') =>
  String(name)
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const getCategoryBySlug = (slug) =>
  SHOP_CATEGORIES.find((c) => c.slug === slug) || null;

export const getCategoryByName = (name) =>
  SHOP_CATEGORIES.find((c) => c.name.toLowerCase() === String(name || '').toLowerCase()) ||
  null;

export const categoryPath = (nameOrSlug) => {
  const bySlug = getCategoryBySlug(nameOrSlug);
  if (bySlug) return `/shop/${bySlug.slug}`;
  const byName = getCategoryByName(nameOrSlug);
  if (byName) return `/shop/${byName.slug}`;
  return `/shop/${slugifyCategory(nameOrSlug)}`;
};
