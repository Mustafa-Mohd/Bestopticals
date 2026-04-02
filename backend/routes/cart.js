const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');

// ─── In-Memory Cart Store ─────────────────────────────────────────────────────
// Structure: { userId: [ { id, productId, name, price, quantity, color, lensOption, image } ] }
const carts = {};

function getOrCreateCart(userId) {
    if (!carts[userId]) carts[userId] = [];
    return carts[userId];
}

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

// ─── GET /api/cart ────────────────────────────────────────────────────────────
router.get('/', authMiddleware, (req, res) => {
    const cart = getOrCreateCart(req.user.id);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 1000 ? 0 : 100;
    const total = subtotal + tax + shipping;

    res.json({
        success: true,
        cart,
        summary: {
            subtotal,
            tax,
            shipping,
            total,
            itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
        }
    });
});

// ─── POST /api/cart/add ───────────────────────────────────────────────────────
router.post('/add', authMiddleware, (req, res) => {
    const { productId, name, price, quantity = 1, color, lensOption, image, brand } = req.body;
    if (!productId || !name || !price) {
        return res.status(400).json({ success: false, message: 'productId, name and price are required' });
    }

    const cart = getOrCreateCart(req.user.id);
    const existingIndex = cart.findIndex(item => item.productId === productId && item.color === color && item.lensOption === lensOption);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ id: uuidv4(), productId, name, price, quantity, color, lensOption, image, brand });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
        success: true,
        message: 'Item added to cart',
        cart,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal
    });
});

// ─── PUT /api/cart/update/:itemId ─────────────────────────────────────────────
router.put('/update/:itemId', authMiddleware, (req, res) => {
    const cart = getOrCreateCart(req.user.id);
    const { quantity } = req.body;
    const index = cart.findIndex(item => item.id === req.params.itemId);

    if (index === -1) return res.status(404).json({ success: false, message: 'Cart item not found' });

    if (quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = quantity;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, message: 'Cart updated', cart, subtotal });
});

// ─── DELETE /api/cart/remove/:itemId ─────────────────────────────────────────
router.delete('/remove/:itemId', authMiddleware, (req, res) => {
    const cart = getOrCreateCart(req.user.id);
    const index = cart.findIndex(item => item.id === req.params.itemId);

    if (index === -1) return res.status(404).json({ success: false, message: 'Cart item not found' });
    cart.splice(index, 1);

    res.json({ success: true, message: 'Item removed from cart', cart });
});

// ─── DELETE /api/cart/clear ───────────────────────────────────────────────────
router.delete('/clear', authMiddleware, (req, res) => {
    carts[req.user.id] = [];
    res.json({ success: true, message: 'Cart cleared' });
});

module.exports = router;
module.exports.carts = carts;
