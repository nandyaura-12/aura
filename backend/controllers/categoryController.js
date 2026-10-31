import Category from '../models/Category.js';

const DEFAULT_MENU = 'Shop by Category';

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const uniqueSlug = async (name, excludeId = null) => {
  const base = slugify(name) || `category-${Date.now().toString(36)}`;
  let slug = base;
  let attempt = 0;

  while (attempt < 20) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Category.findOne(query).select('_id').lean();
    if (!exists) return slug;
    attempt += 1;
    slug = `${base}-${Date.now().toString(36).slice(-4)}${attempt}`;
  }

  return `${base}-${Date.now()}`;
};

const resolveMenuName = (body = {}) => {
  const raw = String(body.menuName || '').trim();
  if (raw) return raw;
  if (body.group === 'occasion') return 'Shop by Occasion';
  return DEFAULT_MENU;
};

const resolveGroup = (menuName) => {
  const value = String(menuName || '').toLowerCase();
  if (value.includes('occasion') || value.includes('bridal') || value.includes("men")) {
    return 'occasion';
  }
  return 'type';
};

const isDuplicateKeyError = (error) =>
  error?.code === 11000 || /duplicate key/i.test(String(error?.message || ''));

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim();
    const image = String(req.body.image || '').trim();
    const status = req.body.status === 'Inactive' ? 'Inactive' : 'Active';
    const menuName = resolveMenuName(req.body);
    const group = resolveGroup(menuName);

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const existing = await Category.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    }).lean();
    if (existing) {
      return res.status(409).json({
        message: `Category "${existing.name}" already exists. Use a different name.`,
      });
    }

    const slug = await uniqueSlug(name);
    const category = new Category({
      name,
      slug,
      description,
      image,
      menuName,
      group,
      status,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message: 'A category with this name already exists. Use a different name.',
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const nextName =
      req.body.name !== undefined ? String(req.body.name || '').trim() : category.name;

    if (!nextName) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    if (nextName.toLowerCase() !== String(category.name).toLowerCase()) {
      const existing = await Category.findOne({
        _id: { $ne: category._id },
        name: { $regex: `^${nextName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      }).lean();
      if (existing) {
        return res.status(409).json({
          message: `Category "${existing.name}" already exists. Use a different name.`,
        });
      }
      category.slug = await uniqueSlug(nextName, category._id);
    }

    category.name = nextName;
    if (req.body.description !== undefined) {
      category.description = String(req.body.description || '').trim();
    }
    if (req.body.image !== undefined) {
      category.image = String(req.body.image || '').trim();
    }
    if (req.body.menuName !== undefined || req.body.group !== undefined) {
      const menuName = resolveMenuName({
        menuName: req.body.menuName ?? category.menuName,
        group: req.body.group,
      });
      category.menuName = menuName;
      category.group = resolveGroup(menuName);
    }
    if (req.body.status !== undefined) {
      category.status = req.body.status === 'Inactive' ? 'Inactive' : 'Active';
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        message: 'A category with this name already exists. Use a different name.',
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
