import { jewellery } from './images';

const fallbackGallery = [jewellery.img21, jewellery.img07, jewellery.img12, jewellery.img20];

export const formatInr = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const padGallery = (images) => {
  const list = (images || []).filter(Boolean);
  const source = list.length ? list : fallbackGallery;
  const padded = [...source];
  while (padded.length < 4) padded.push(source[0]);
  return padded.slice(0, 4);
};

export const toStoreProduct = (product) => {
  const listPrice = Number(product.price) || 0;
  const salePrice = Number(product.discountPrice) || 0;
  const onSale = salePrice > 0 && salePrice < listPrice;
  const unitPrice = onSale ? salePrice : listPrice;

  return {
    id: product.slug || product._id,
    title: product.name,
    originalPrice: onSale ? formatInr(listPrice) : '',
    price: formatInr(unitPrice),
    unitPrice,
    rating: '4.9',
    reviewsCount: 24,
    onSale,
    description: product.description || '',
    styles: [product.purity || 'Standard'],
    images: padGallery(product.images),
    stock: Number(product.stock) || 1,
    sku: product.sku || product.slug || '',
    details: {
      description: product.description || '',
      sizeAndMaterial: [
        product.purity,
        product.weightGrams ? `Weight ${product.weightGrams} g` : '',
        product.makingCharge ? `Making charge ${product.makingCharge}%` : '',
        product.category,
      ]
        .filter(Boolean)
        .join('. ')
        .concat('.'),
      shippingAndReturns:
        'Free insured express shipping across India. Standard delivery within 3-5 business days. Easy 30-day return in original condition with certificate.',
    },
  };
};
