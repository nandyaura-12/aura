import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Customer from './models/Customer.js';
import Offer from './models/Offer.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aura_admin';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✨ Connected to MongoDB for Aura Fine Jewellery Seeding...');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Customer.deleteMany({});
    await Offer.deleteMany({});

    console.log('Cleared existing database records.');

    // Seed Jewellery Categories
    const categories = await Category.insertMany([
      {
        name: 'Gold Jewellery',
        slug: 'gold-jewellery',
        description: '22K & 18K BIS 916 Hallmarked Gold Necklaces, Chains, Bangles, and Earrings',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        productCount: 4,
        status: 'Active',
      },
      {
        name: 'Diamond Collection',
        slug: 'diamond-collection',
        description: 'Certified VVS-EF Diamond Solitaire Rings, Necklaces, Nose Pins, and Bracelets',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
        productCount: 3,
        status: 'Active',
      },
      {
        name: 'Bridal & Royal Sets',
        slug: 'bridal-royal-sets',
        description: 'Exquisite Heritage Temple, Antique, and Kundan Grand Bridal Jewellery Sets',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
        productCount: 2,
        status: 'Active',
      },
      {
        name: 'Silver & Platinum',
        slug: 'silver-platinum',
        description: 'Pure 925 Sterling Silver Payals & Rare Platinum Couple Bands',
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80',
        productCount: 2,
        status: 'Active',
      },
    ]);

    console.log('Jewellery Categories seeded.');

    // Seed Jewellery Products
    const products = await Product.insertMany([
      {
        name: 'Royal Heritage Lakshmi Gold Necklace',
        slug: 'royal-heritage-lakshmi-gold-necklace',
        description: 'Traditional 22K Gold Antique Choker with hand-carved Goddess Lakshmi motif and rubies.',
        category: 'Gold Jewellery',
        price: 185000,
        discountPrice: 172000,
        stock: 8,
        sku: 'SKU-JW-G001',
        purity: '22K Gold (916 Hallmarked)',
        weightGrams: 32.5,
        makingCharge: 12,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'],
        isFeatured: true,
        offerTag: 'AKSHAYA TRITIYA SPECIAL - 0% MAKING CHARGE',
        status: 'Active',
      },
      {
        name: 'Aura Crown Solitaire Diamond Ring',
        slug: 'aura-crown-solitaire-diamond-ring',
        description: '1.2 Carat VVS1 Clarity EF Color Diamond set in 18K Rose Gold band with IGI Certification.',
        category: 'Diamond Collection',
        price: 125000,
        discountPrice: 110000,
        stock: 5,
        sku: 'SKU-JW-D001',
        purity: '18K Rose Gold + VVS1 Diamond',
        weightGrams: 4.8,
        makingCharge: 8,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80'],
        isFeatured: true,
        offerTag: 'CERTIFIED VVS SOLITAIRE',
        status: 'Active',
      },
      {
        name: 'Maharani Kundan Grand Bridal Set',
        slug: 'maharani-kundan-grand-bridal-set',
        description: 'Full bridal wedding set featuring heavy Haram, matching Jhumkas, Maang Tikka, and Haath Phool.',
        category: 'Bridal & Royal Sets',
        price: 345000,
        discountPrice: 315000,
        stock: 3,
        sku: 'SKU-JW-B001',
        purity: '22K Gold & Uncut Polki Diamonds',
        weightGrams: 78.4,
        makingCharge: 14,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80'],
        isFeatured: true,
        offerTag: 'EXCLUSIVE WEDDING EDITION',
        status: 'Active',
      },
      {
        name: 'Platinum Forever Love Couple Bands',
        slug: 'platinum-forever-love-couple-bands',
        description: 'Pair of Pt950 Pure Platinum matching wedding bands with accent solitaire diamonds.',
        category: 'Silver & Platinum',
        price: 68000,
        discountPrice: 62000,
        stock: 12,
        sku: 'SKU-JW-P001',
        purity: 'Pt 950 Platinum',
        weightGrams: 14.2,
        makingCharge: 6,
        images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80'],
        isFeatured: false,
        offerTag: 'COUPLE SPECIAL',
        status: 'Active',
      },
      {
        name: 'Temple Antique Gold Jhumka Earrings',
        slug: 'temple-antique-gold-jhumka-earrings',
        description: '22K Yellow Gold peacock detailed hanging Jhumkas with emerald drops and pearls.',
        category: 'Gold Jewellery',
        price: 54000,
        discountPrice: 48500,
        stock: 15,
        sku: 'SKU-JW-G002',
        purity: '22K Gold (916 Hallmarked)',
        weightGrams: 9.6,
        makingCharge: 10,
        images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80'],
        isFeatured: false,
        offerTag: 'POPULAR CHOICE',
        status: 'Active',
      },
    ]);

    console.log('Jewellery Products seeded.');

    // Seed Jewellery Customers
    const customers = await Customer.insertMany([
      {
        name: 'Meenakshi Sundaram',
        email: 'meenakshi@example.com',
        phone: '+91 98401 23456',
        address: '24 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu',
        ordersCount: 3,
        totalSpent: 357000,
        status: 'Active',
      },
      {
        name: 'Kavitha Ranganathan',
        email: 'kavitha.r@example.com',
        phone: '+91 94432 10987',
        address: '15 DB Road, RS Puram, Coimbatore, Tamil Nadu',
        ordersCount: 2,
        totalSpent: 187000,
        status: 'Active',
      },
      {
        name: 'Anitha Vijay',
        email: 'anitha.v@example.com',
        phone: '+91 97890 54321',
        address: '102 West Masi Street, Madurai, Tamil Nadu',
        ordersCount: 1,
        totalSpent: 62000,
        status: 'Active',
      },
    ]);

    console.log('Jewellery Customers seeded.');

    // Seed Offers
    const offers = await Offer.insertMany([
      {
        title: 'Akshaya Tritiya Gold Festival',
        code: 'AKSHAYA2026',
        discountType: 'Percentage',
        discountValue: 15,
        bannerImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-10-31'),
        status: 'Active',
        minimumPurchase: 50000,
      },
      {
        title: 'Wedding Bridal Jewellery Savings',
        code: 'BRIDAL5000',
        discountType: 'Fixed Amount',
        discountValue: 5000,
        bannerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'Active',
        minimumPurchase: 150000,
      },
    ]);

    console.log('Offers seeded.');

    // Seed Orders with dates spanning last few weeks
    const today = new Date();
    const daysAgo = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

    const orders = await Order.insertMany([
      {
        orderId: 'ORD-JW-2026-8001',
        customerName: 'Meenakshi Sundaram',
        customerEmail: 'meenakshi@example.com',
        customerPhone: '+91 98401 23456',
        items: [
          {
            productId: products[0]._id.toString(),
            productName: products[0].name,
            quantity: 1,
            price: 172000,
            image: products[0].images[0],
          },
          {
            productId: products[1]._id.toString(),
            productName: products[1].name,
            quantity: 1,
            price: 110000,
            image: products[1].images[0],
          },
        ],
        totalAmount: 282000,
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        paymentMethod: 'Insured Bank Transfer',
        shippingAddress: '24 Cathedral Road, Gopalapuram, Chennai, Tamil Nadu',
        createdAt: daysAgo(2),
      },
      {
        orderId: 'ORD-JW-2026-8002',
        customerName: 'Kavitha Ranganathan',
        customerEmail: 'kavitha.r@example.com',
        customerPhone: '+91 94432 10987',
        items: [
          {
            productId: products[2]._id.toString(),
            productName: products[2].name,
            quantity: 1,
            price: 315000,
            image: products[2].images[0],
          },
        ],
        totalAmount: 315000,
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        paymentMethod: 'Credit Card',
        shippingAddress: '15 DB Road, RS Puram, Coimbatore, Tamil Nadu',
        createdAt: daysAgo(6),
      },
      {
        orderId: 'ORD-JW-2026-8003',
        customerName: 'Anitha Vijay',
        customerEmail: 'anitha.v@example.com',
        customerPhone: '+91 97890 54321',
        items: [
          {
            productId: products[3]._id.toString(),
            productName: products[3].name,
            quantity: 1,
            price: 62000,
            image: products[3].images[0],
          },
        ],
        totalAmount: 62000,
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        paymentMethod: 'Net Banking',
        shippingAddress: '102 West Masi Street, Madurai, Tamil Nadu',
        createdAt: daysAgo(10),
      },
    ]);

    console.log('Jewellery Orders seeded.');
    console.log('✨ Aura Fine Jewellery Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error Seeding DB:', error);
    process.exit(1);
  }
};

seedData();
