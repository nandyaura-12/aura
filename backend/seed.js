import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Customer from './models/Customer.js';
import Offer from './models/Offer.js';
import { hashPassword } from './utils/password.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_admin';
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME || 'mxihlfki';
const cld = (id) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto/${id}`;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✨ Connected to MongoDB for Aura Antique Jewellery Seeding...');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Customer.deleteMany({});
    await Offer.deleteMany({});

    console.log('Cleared existing database records.');

    // Seed Antique Jewellery Categories
    const categories = await Category.insertMany([
      {
        name: 'Temple Sets',
        slug: 'temple-sets',
        description: 'Antique-finish temple sets with Lakshmi nakshi work, kemp stones and pearl drops',
        image: cld('aura/jewellery/img21'),
        productCount: 4,
        status: 'Active',
      },
      {
        name: 'Jhumkas & Earrings',
        slug: 'jhumkas-earrings',
        description: 'Vintage temple jhumkas and studs with peacock tops, kemp stones and faux pearls',
        image: cld('aura/jewellery/img13'),
        productCount: 3,
        status: 'Active',
      },
      {
        name: 'Antique Harams & Necklaces',
        slug: 'antique-harams-necklaces',
        description: 'Long nakshi harams, mango malas and peacock chokers in a dull antique finish',
        image: cld('aura/jewellery/img18'),
        productCount: 3,
        status: 'Active',
      },
      {
        name: 'Bangles & Kadas',
        slug: 'bangles-kadas',
        description: 'Broad antique-finish kadas and bangles with temple carvings and screw openings',
        image: cld('aura/jewellery/img23'),
        productCount: 2,
        status: 'Active',
      },
      {
        name: 'Bridal Antique Sets',
        slug: 'bridal-antique-sets',
        description: 'Heritage bridal antique sets inspired by heirloom South Indian wedding jewellery',
        image: cld('aura/jewellery/img14'),
        productCount: 2,
        status: 'Active',
      },
    ]);

    console.log('Antique Jewellery Categories seeded.');

    // Seed Antique Jewellery Products — antique-finish pieces, NOT solid gold or silver
    const products = await Product.insertMany([
      {
        name: 'Lakshmi Nakshi Temple Haram',
        slug: 'lakshmi-nakshi-temple-haram',
        description: 'A long antique-finish haram with a hand-carved Goddess Lakshmi pendant, nakshi detailing and deep-red kemp stones. Inspired by heirloom temple jewellery of old Tamil Nadu.',
        category: 'Antique Harams & Necklaces',
        price: 3999,
        discountPrice: 2999,
        stock: 12,
        sku: 'SKU-AQ-H001',
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: 48,
        makingCharge: 0,
        images: [cld('aura/jewellery/img21')],
        isFeatured: true,
        offerTag: 'FESTIVE SPECIAL - ANTIQUE TEMPLE EDIT',
        status: 'Active',
      },
      {
        name: 'Antique Kemp Jhumka Earrings',
        slug: 'antique-kemp-jhumka',
        description: 'Classic temple jhumkas with peacock tops, kemp stones and tiny pearl drops, finished in a soft antique tone.',
        category: 'Jhumkas & Earrings',
        price: 1799,
        discountPrice: 1299,
        stock: 20,
        sku: 'SKU-AQ-J001',
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: 18,
        makingCharge: 0,
        images: [cld('aura/jewellery/img05')],
        isFeatured: true,
        offerTag: 'MOST LOVED JHUMKA',
        status: 'Active',
      },
      {
        name: 'Temple Mango Mala Necklace',
        slug: 'temple-mango-mala',
        description: 'A vintage mango-motif (manga malai) necklace — one of the oldest South Indian designs — in a rich antique finish with kemp accents.',
        category: 'Antique Harams & Necklaces',
        price: 3299,
        discountPrice: 2499,
        stock: 10,
        sku: 'SKU-AQ-N001',
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: 42,
        makingCharge: 0,
        images: [cld('aura/jewellery/img01')],
        isFeatured: true,
        offerTag: 'HERITAGE MANGO MALA',
        status: 'Active',
      },
      {
        name: 'Peacock Nakshi Choker',
        slug: 'peacock-nakshi-choker',
        description: 'A close-fitting antique choker with twin peacock nakshi work, green stones and pearl drops — a vintage bridal favourite.',
        category: 'Bridal Antique Sets',
        price: 2899,
        discountPrice: 2199,
        stock: 8,
        sku: 'SKU-AQ-C001',
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: 36,
        makingCharge: 0,
        images: [cld('aura/jewellery/img13')],
        isFeatured: false,
        offerTag: 'BRIDAL FAVOURITE',
        status: 'Active',
      },
      {
        name: 'Antique Kada Bangle',
        slug: 'antique-kada-bangle',
        description: 'A broad antique-finish kada with temple carvings and screw opening, modelled on bangles worn generations ago.',
        category: 'Bangles & Kadas',
        price: 2499,
        discountPrice: 1899,
        stock: 15,
        sku: 'SKU-AQ-B001',
        purity: 'Antique Matte Finish (Brass Alloy)',
        weightGrams: 32,
        makingCharge: 0,
        images: [cld('aura/jewellery/img03')],
        isFeatured: false,
        offerTag: 'POPULAR CHOICE',
        status: 'Active',
      },
    ]);

    console.log('Antique Jewellery Products seeded.');

    // Seed Customers
    const customers = await Customer.insertMany([
      {
        name: 'Meenakshi Sundaram',
        email: 'meenakshi@example.com',
        passwordHash: hashPassword('Aura@123'),
        phone: '+91 98401 23456',
        address: '24 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu',
        ordersCount: 3,
        totalSpent: 8596,
        status: 'Active',
      },
      {
        name: 'Kavitha Ranganathan',
        email: 'kavitha.r@example.com',
        passwordHash: hashPassword('Aura@123'),
        phone: '+91 94432 10987',
        address: '15 DB Road, RS Puram, Coimbatore, Tamil Nadu',
        ordersCount: 2,
        totalSpent: 4698,
        status: 'Active',
      },
      {
        name: 'Anitha Vijay',
        email: 'anitha.v@example.com',
        passwordHash: hashPassword('Aura@123'),
        phone: '+91 97890 54321',
        address: '102 West Masi Street, Madurai, Tamil Nadu',
        ordersCount: 1,
        totalSpent: 1899,
        status: 'Active',
      },
    ]);

    console.log('Antique Jewellery Customers seeded.');

    // Seed Offers
    const offers = await Offer.insertMany([
      {
        title: 'Festive Antique Sale',
        code: 'ANTIQUE25',
        discountType: 'Percentage',
        discountValue: 25,
        bannerImage: cld('aura/jewellery/img07'),
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-12-31'),
        status: 'Active',
        minimumPurchase: 999,
        showAsPopup: true,
        popupButtonText: 'Shop Now',
      },
      {
        title: 'Bridal Temple Set Savings',
        code: 'BRIDAL300',
        discountType: 'Fixed Amount',
        discountValue: 300,
        bannerImage: cld('aura/jewellery/img14'),
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'Active',
        minimumPurchase: 2999,
      },
    ]);

    console.log('Offers seeded.');

    // Seed Orders with dates spanning last few weeks
    const today = new Date();
    const daysAgo = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    const orders = await Order.insertMany([
      {
        orderId: 'ORD-AQ-2026-8001',
        customerName: 'Meenakshi Sundaram',
        customerEmail: 'meenakshi@example.com',
        customerPhone: '+91 98401 23456',
        items: [
          {
            productId: products[0]._id.toString(),
            productName: products[0].name,
            quantity: 1,
            price: 2999,
            image: products[0].images[0],
          },
          {
            productId: products[1]._id.toString(),
            productName: products[1].name,
            quantity: 1,
            price: 1299,
            image: products[1].images[0],
          },
        ],
        totalAmount: 4298,
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        paymentMethod: 'UPI',
        shippingAddress: '24 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu',
        createdAt: daysAgo(2),
      },
      {
        orderId: 'ORD-AQ-2026-8002',
        customerName: 'Kavitha Ranganathan',
        customerEmail: 'kavitha.r@example.com',
        customerPhone: '+91 94432 10987',
        items: [
          {
            productId: products[2]._id.toString(),
            productName: products[2].name,
            quantity: 1,
            price: 2499,
            image: products[2].images[0],
          },
          {
            productId: products[3]._id.toString(),
            productName: products[3].name,
            quantity: 1,
            price: 2199,
            image: products[3].images[0],
          },
        ],
        totalAmount: 4698,
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        paymentMethod: 'Credit Card',
        shippingAddress: '15 DB Road, RS Puram, Coimbatore, Tamil Nadu',
        createdAt: daysAgo(6),
      },
      {
        orderId: 'ORD-AQ-2026-8003',
        customerName: 'Anitha Vijay',
        customerEmail: 'anitha.v@example.com',
        customerPhone: '+91 97890 54321',
        items: [
          {
            productId: products[4]._id.toString(),
            productName: products[4].name,
            quantity: 1,
            price: 1899,
            image: products[4].images[0],
          },
        ],
        totalAmount: 1899,
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        paymentMethod: 'Net Banking',
        shippingAddress: '102 West Masi Street, Madurai, Tamil Nadu',
        createdAt: daysAgo(10),
      },
    ]);

    console.log('Antique Jewellery Orders seeded.');
    console.log('✨ Aura Antique Jewellery Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding DB:', error);
    process.exit(1);
  }
};

seedData();
