const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authMiddleware');

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
  res.json(cart || { items: [] });
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.userId });

  if (!cart) {
    cart = new Cart({ user: req.user.userId, items: [] });
  }

  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Remove item from cart
router.post('/remove', authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user.userId });

  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

// Update item quantity
router.post('/update', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.userId });

  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const item = cart.items.find(item => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

module.exports = router;
