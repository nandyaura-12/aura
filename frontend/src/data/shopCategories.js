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

/** Known occasion slugs — used when older DB rows have no menuName yet. */
export const OCCASION_SLUGS = new Set(OCCASION_CATEGORIES.map((c) => c.slug));

export const DEFAULT_MENU_NAMES = ['Shop by Category', 'Shop by Occasion'];

export const resolveCategoryMenuName = (category = {}) => {
  const named = String(category.menuName || '').trim();
  if (named) return named;
  if (category.group === 'occasion' || OCCASION_SLUGS.has(category.slug)) {
    return 'Shop by Occasion';
  }
  return 'Shop by Category';
};

/**
 * Group categories under free-text menu names for Collections nav.
 * Returns [{ menuName, categories }] in first-seen order.
 */
export const groupCategoriesByMenu = (categories = []) => {
  const order = [];
  const map = new Map();

  categories.forEach((category) => {
    const menuName = resolveCategoryMenuName(category);
    if (!map.has(menuName)) {
      map.set(menuName, []);
      order.push(menuName);
    }
    map.get(menuName).push(category);
  });

  return order.map((menuName) => ({
    menuName,
    categories: map.get(menuName),
  }));
};

/** @deprecated Prefer groupCategoriesByMenu — kept for older callers. */
export const splitNavCategories = (categories = []) => {
  const sections = groupCategoriesByMenu(categories);
  const type =
    sections.find((s) => s.menuName === 'Shop by Category')?.categories ||
    sections.filter((s) => s.menuName !== 'Shop by Occasion').flatMap((s) => s.categories);
  const occasion =
    sections.find((s) => s.menuName === 'Shop by Occasion')?.categories || [];
  return { type, occasion };
};

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
  const value = String(nameOrSlug || '').trim();
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return `/shop/${value}`;
  return `/shop/${slugifyCategory(value)}`;
};
