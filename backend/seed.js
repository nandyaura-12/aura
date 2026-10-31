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

    // Seed categories — matches storefront Shop by Category menu
    const categories = await Category.insertMany([
      {
        name: 'Necklace Sets',
        slug: 'necklace-sets',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Coordinated necklace and earring sets in soft mint, green and gold tones',
        image: cld('aura/jewellery/img21'),
        productCount: 1,
        status: 'Active',
      },
      {
        name: 'Pendant Sets',
        slug: 'pendant-sets',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Pendant necklaces and matching sets with floral and pearl detailing',
        image: cld('aura/jewellery/img18'),
        productCount: 1,
        status: 'Active',
      },
      {
        name: 'Earrings',
        slug: 'earrings',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Pearl studs, ornate drops and pendant earring sets',
        image: cld('aura/jewellery/img13'),
        productCount: 1,
        status: 'Active',
      },
      {
        name: 'Bangles',
        slug: 'bangles',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Floral gemstone bangles and statement emerald / ruby wrist pieces',
        image: cld('aura/jewellery/img23'),
        productCount: 2,
        status: 'Active',
      },
      {
        name: 'Rings',
        slug: 'rings',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Everyday and statement rings with antique matte finishes',
        image: cld('aura/jewellery/img16'),
        productCount: 0,
        status: 'Active',
      },
      {
        name: 'Hand Chains',
        slug: 'hand-chains',
        group: 'type',
        menuName: 'Shop by Category',
        description: 'Delicate hand chains and hath phools for festive looks',
        image: cld('aura/jewellery/img10'),
        productCount: 0,
        status: 'Active',
      },
      {
        name: 'Festive & Bridal Wear',
        slug: 'festive-bridal-wear',
        group: 'occasion',
        menuName: 'Shop by Occasion',
        description: 'Statement bridal and festive pieces for weddings and celebrations',
        image: cld('aura/jewellery/img07'),
        productCount: 0,
        status: 'Active',
      },
      {
        name: 'Everyday Essentials',
        slug: 'everyday-essentials',
        group: 'occasion',
        menuName: 'Shop by Occasion',
        description: 'Light, wearable pieces made for daily polish',
        image: cld('aura/jewellery/img04'),
        productCount: 0,
        status: 'Active',
      },
      {
        name: "Men's Collection",
        slug: 'mens-collection',
        group: 'occasion',
        menuName: 'Shop by Occasion',
        description: 'Subtle antique pieces styled for him',
        image: cld('aura/jewellery/img03'),
        productCount: 0,
        status: 'Active',
      },
    ]);

    console.log('Jewellery Categories seeded.');

    // Seed products — each name matches what the photo actually shows
    const products = await Product.insertMany([
      {
        name: 'Mint Necklace Set',
        slug: 'mint-necklace-set',
        description: 'A soft mint and gold-tone necklace set with matching earrings — light, elegant and easy to pair with festive wear.',
        category: 'Necklace Sets',
        price: 3999,
        discountPrice: 2999,
        stock: 12,
        sku: 'SKU-AQ-H001',
        purity: 'Gold-Tone Alloy',
        weightGrams: 48,
        makingCharge: 0,
        images: [cld('aura/jewellery/img21')],
        isFeatured: true,
        offerTag: 'FESTIVE FAVOURITE',
        status: 'Active',
      },
      {
        name: 'Floral Gemstone Bangle',
        slug: 'floral-gemstone-bangle',
        description: 'A floral open bangle with colourful gemstone petals — statement wrist piece for festive looks.',
        category: 'Bangles',
        price: 1799,
        discountPrice: 1299,
        stock: 20,
        sku: 'SKU-AQ-B002',
        purity: 'Gold-Tone Alloy',
        weightGrams: 28,
        makingCharge: 0,
        images: [cld('aura/jewellery/img05')],
        isFeatured: true,
        offerTag: 'MOST LOVED BANGLE',
        status: 'Active',
      },
      {
        name: 'Floral Ruby Bangle',
        slug: 'floral-ruby-bangle',
        description: 'A bold floral bangle with ruby-red stones — exactly as shown in the product photo.',
        category: 'Bangles',
        price: 3299,
        discountPrice: 2499,
        stock: 10,
        sku: 'SKU-AQ-B001',
        purity: 'Gold-Tone Alloy',
        weightGrams: 32,
        makingCharge: 0,
        images: [cld('aura/jewellery/img01')],
        isFeatured: true,
        offerTag: 'HERITAGE FLORAL EDIT',
        status: 'Active',
      },
      {
        name: 'Ornate Pearl Earrings',
        slug: 'ornate-pearl-earrings',
        description: 'Ornate drop earrings with pearl centres and detailed metal work — elegant for weddings and evenings.',
        category: 'Earrings',
        price: 2899,
        discountPrice: 2199,
        stock: 8,
        sku: 'SKU-AQ-E001',
        purity: 'Gold-Tone Alloy',
        weightGrams: 16,
        makingCharge: 0,
        images: [cld('aura/jewellery/img13')],
        isFeatured: false,
        offerTag: 'EVENING FAVOURITE',
        status: 'Active',
      },
      {
        name: 'Ornate Pendant Necklace',
        slug: 'ornate-pendant-necklace',
        description: 'An ornate pendant necklace with detailed metalwork — matches the product photograph exactly.',
        category: 'Pendant Sets',
        price: 2499,
        discountPrice: 1899,
        stock: 15,
        sku: 'SKU-AQ-N001',
        purity: 'Gold-Tone Alloy',
        weightGrams: 22,
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
