const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// GET /api/categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ type: 1, name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/categories
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, icon_name } = req.body;
    if (!name || !type) return res.status(400).json({ message: 'Name and type required' });
    const category = new Category({ user: req.user.id, name, type, icon_name: icon_name || 'label' });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const { name, icon_name } = req.body;
    if (name) category.name = name;
    if (icon_name) category.icon_name = icon_name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
