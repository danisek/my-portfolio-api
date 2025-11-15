const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/authMiddleware');

// Place an order from cart
router.post('/place', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const total = cart.items.reduce((sum, item) => {
            if (!item.product || typeof item.product.price !== 'number') {
                throw new Error('Invalid product reference or missing price');
            }
            return sum + item.product.price * item.quantity;
        }, 0);


        const order = new Order({
            user: req.user.userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            total
        });

        await order.save();
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        console.error('Order placement error:', err); // ✅ Add this
        res.status(500).json({ error: 'Order placement failed', details: err.message });
    }
});


// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  const orders = await Order.find({ user: req.user.userId }).populate('items.product');
  res.json(orders);
});

// Simulate checkout/payment
router.post('/checkout', authenticateToken, async (req, res) => {
    const { orderId, paymentMethod } = req.body;

    try {
        const order = await Order.findOne({ _id: orderId, user: req.user.userId });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Simulate payment success
        order.status = 'Paid';
        order.paymentMethod = paymentMethod || 'Card';
        order.paymentStatus = 'Paid';
        await order.save();

        res.json({ message: 'Payment successful', order });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ error: 'Checkout failed', details: err.message });
    }
});


module.exports = router;
