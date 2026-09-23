import Product from '../models/Product.js';

// @desc    Get all products with search & category filter
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { purity: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Jewellery item not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      sku,
      purity,
      weightGrams,
      makingCharge,
      images,
      offerTag,
      status,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = new Product({
      name,
      slug: slug + '-' + Date.now().toString().slice(-4),
      description,
      category,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      stock: Number(stock),
      sku: sku || `SKU-JW-${Math.floor(1000 + Math.random() * 9000)}`,
      purity: purity || '22K Gold (916 Hallmarked)',
      weightGrams: Number(weightGrams) || 0,
      makingCharge: Number(makingCharge) || 0,
      images: images || [],
      offerTag: offerTag || '',
      status: status || (Number(stock) > 0 ? 'Active' : 'Out of Stock'),
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Jewellery item not found' });

    Object.assign(product, req.body);
    if (req.body.name) {
      product.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Jewellery item not found' });

    await product.deleteOne();
    res.json({ message: 'Jewellery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
