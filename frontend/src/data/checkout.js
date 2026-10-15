import { jewellery } from './images';

export const TAX_RATE = 0.065;

export const formatMoney = (amount, currency = 'USD') => {
  const hasCents = Math.round(Math.abs(amount) * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const roundMoney = (amount) => Math.round(amount * 100) / 100;

export const initialCartItems = [
  {
    id: 'solstice-diamond-ring',
    title: 'Solstice Diamond Ring',
    meta: '18k Yellow Gold, 0.8ct Diamond, Size 6',
    sku: 'LL-RG-SOL-18K',
    unitPrice: 2480,
    qty: 1,
    currency: 'USD',
    image: jewellery.img02,
    stock: 12,
  },
  {
    id: 'aurelia-pendant-necklace',
    title: 'Aurelia Pendant Necklace',
    meta: '14k Gold, 18" Fine Chain',
    sku: 'LL-NK-AUR-14K',
    unitPrice: 1860,
    qty: 1,
    currency: 'USD',
    image: jewellery.img21,
    stock: 12,
  },
  {
    id: 'halo-stacking-rings',
    title: 'Halo Stacking Rings',
    meta: 'Gold Vermeil, Pavé Detail',
    sku: 'LL-RG-HAL-VML',
    unitPrice: 210,
    qty: 2,
    currency: 'USD',
    image: jewellery.img16,
    stock: 3,
  },
];

export const lookItems = [
  {
    id: 'lune-cuff-bracelet',
    title: 'Lune Cuff Bracelet',
    meta: '14k Gold Cuff',
    sku: 'LL-BR-LUN-14K',
    unitPrice: 480,
    currency: 'USD',
    image: jewellery.img23,
    stock: 8,
  },
  {
    id: 'eternal-band-pair',
    title: 'Eternal Band Pair',
    meta: 'Polished Gold Hoops',
    sku: 'LL-ER-ETR-GLD',
    unitPrice: 260,
    currency: 'USD',
    image: jewellery.img13,
    stock: 8,
  },
  {
    id: 'strand-bead-necklace',
    title: 'Strand Bead Necklace',
    meta: 'Gold Bead Strand',
    sku: 'LL-NK-STR-GLD',
    unitPrice: 540,
    currency: 'USD',
    image: jewellery.img12,
    stock: 8,
  },
];

export const initialAddresses = [
  {
    id: 'home',
    label: 'Home',
    firstName: 'Amelia',
    lastName: 'Hart',
    street: '120 Prince St',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10012',
    phone: '+1 (212) 555-0184',
    isDefault: true,
  },
  {
    id: 'studio',
    label: 'Studio',
    firstName: 'Amelia',
    lastName: 'Hart',
    street: '48 Wooster St',
    apartment: 'Floor 3',
    city: 'New York',
    state: 'NY',
    zip: '10013',
    phone: '+1 (212) 555-0127',
    isDefault: false,
  },
];

export const initialContact = {
  email: 'you@example.com',
  phone: '+1 (555) 000-0000',
};

export const emptyAddress = {
  label: '',
  firstName: '',
  lastName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  isDefault: false,
};

export const addressLines = (address) => {
  const street = [address.street, address.apartment].filter(Boolean).join(', ');
  const city = [address.city, address.state].filter(Boolean).join(', ');
  return {
    name: `${address.firstName} ${address.lastName}`.trim(),
    street,
    city: [city, address.zip].filter(Boolean).join(' '),
    phone: address.phone,
  };
};

export const addressSummary = (address) => {
  const lines = addressLines(address);
  return [lines.name, lines.street, lines.city].filter(Boolean).join(', ');
};
