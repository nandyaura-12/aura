import { jewellery } from './images';

const fallbackGallery = [jewellery.img21, jewellery.img07, jewellery.img12, jewellery.img20];

export const formatInr = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const toStoreProduct = (product) => {
  const listPrice = Number(product.price) || 0;
  const salePrice = Number(product.discountPrice) || 0;
  const onSale = salePrice > 0 && salePrice < listPrice;
  const unitPrice = onSale ? salePrice : listPrice;
  const images = (product.images || []).filter(Boolean);

  return {
    id: product.slug || product._id,
    title: product.name,
    originalPrice: onSale ? formatInr(listPrice) : '',
    price: formatInr(unitPrice),
    unitPrice,
    rating: '4.9',
    reviewsCount: 24,
    onSale,
    isFeatured: Boolean(product.isFeatured),
    description: product.description || '',
    styles: [],
    images: images.length ? images : [fallbackGallery[0]],
    stock: Number(product.stock) || 0,
    sku: product.sku || '',
    createdAt: product.createdAt || null,
    specs: {
      category: product.category || '',
      purity: product.purity || '',
      weightGrams: Number(product.weightGrams) || 0,
      makingCharge: Number(product.makingCharge) || 0,
      ringType: product.ringType || '',
      offerTag: product.offerTag || '',
    },
    details: {
      description: product.description || '',
      sizeAndMaterial: [
        product.ringType ? `Ring type: ${product.ringType}` : '',
        product.purity || (String(product.category || '').toLowerCase() === 'rings' ? '' : 'Antique matte finish on brass alloy'),
        product.weightGrams ? `Approx. weight ${product.weightGrams} g` : '',
        'Hand-finished nakshi detailing',
        product.category,
        product.sku ? `SKU ${product.sku}` : '',
      ].filter(Boolean),
      shippingAndReturns: [
        'Free shipping across India',
        'Standard delivery within 3–5 business days',
        'Packed in protective gift-ready packaging',
        'Easy 7-day return in original condition',
        'Keep away from water and perfume to preserve the antique finish',
      ],
    },
  };
};
