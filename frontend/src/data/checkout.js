import { jewellery } from './images';

export const TAX_RATE = 0.065;

export const formatMoney = (amount, currency = 'INR') => {
  const hasCents = Math.round(Math.abs(amount) * 100) % 100 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const roundMoney = (amount) => Math.round(amount * 100) / 100;

export const initialCartItems = [
  {
    id: 'mint-necklace-set',
    title: 'Mint Necklace Set',
    meta: 'Gold-tone set with mint accents & matching earrings',
    sku: 'AQ-NK-MNT-001',
    unitPrice: 2999,
    qty: 1,
    currency: 'INR',
    image: jewellery.img21,
    stock: 12,
  },
  {
    id: 'floral-gemstone-bangle',
    title: 'Floral Gemstone Bangle',
    meta: 'Floral open bangle, multi-colour stones, Size 2.6',
    sku: 'AQ-BG-FLR-002',
    unitPrice: 1299,
    qty: 1,
    currency: 'INR',
    image: jewellery.img05,
    stock: 12,
  },
  {
    id: 'ornate-pendant-necklace',
    title: 'Ornate Pendant Necklace',
    meta: 'Statement pendant on adjustable chain',
    sku: 'AQ-PN-ORN-003',
    unitPrice: 1899,
    qty: 1,
    currency: 'INR',
    image: jewellery.img03,
    stock: 3,
  },
];

export const lookItems = [
  {
    id: 'ornate-pearl-earrings',
    title: 'Ornate Pearl Earrings',
    meta: 'Drop earrings with pearl centres',
    sku: 'AQ-ER-PRL-004',
    unitPrice: 2199,
    currency: 'INR',
    image: jewellery.img13,
    stock: 8,
  },
  {
    id: 'floral-ruby-bangle',
    title: 'Floral Ruby Bangle',
    meta: 'Floral cuff with ruby-red stones, Size 2.6',
    sku: 'AQ-BG-RBY-005',
    unitPrice: 2499,
    currency: 'INR',
    image: jewellery.img01,
    stock: 8,
  },
  {
    id: 'green-gemstone-necklace',
    title: 'Green Gemstone Necklace',
    meta: 'Green stone pendant necklace',
    sku: 'AQ-NK-GRN-006',
    unitPrice: 899,
    currency: 'INR',
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
