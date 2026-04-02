const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');
const { carts } = require('./cart');

// ─── In-Memory Orders Store ───────────────────────────────────────────────────
const orders = {};

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

// ─── POST /api/orders/place ───────────────────────────────────────────────────
router.post('/place', authMiddleware, (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
        return res.status(400).json({ success: false, message: 'Shipping address and payment method required' });
    }

    const cart = carts[req.user.id] || [];
    if (cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 1000 ? 0 : 100;
    const total = subtotal + tax + shipping;

    const order = {
        id: `LK${Date.now()}`,
        orderId: uuidv4(),
        userId: req.user.id,
        items: [...cart],
        shippingAddress,
        paymentMethod,
        status: 'confirmed',
        subtotal,
        tax,
        shipping,
        total,
        placedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: [
            { status: 'Order Placed', date: new Date().toISOString(), done: true },
            { status: 'Order Confirmed', date: new Date().toISOString(), done: true },
            { status: 'Processing', date: '', done: false },
            { status: 'Shipped', date: '', done: false },
            { status: 'Out for Delivery', date: '', done: false },
            { status: 'Delivered', date: '', done: false }
        ]
    };

    if (!orders[req.user.id]) orders[req.user.id] = [];
    orders[req.user.id].push(order);

    // Clear cart after order
    carts[req.user.id] = [];

    res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order
    });
});

// ─── GET /api/orders ──────────────────────────────────────────────────────────
router.get('/', authMiddleware, (req, res) => {
    const userOrders = (orders[req.user.id] || []).sort(
        (a, b) => new Date(b.placedAt) - new Date(a.placedAt)
    );
    res.json({ success: true, orders: userOrders, total: userOrders.length });
});

// ─── GET /api/orders/:orderId ─────────────────────────────────────────────────
router.get('/:orderId', authMiddleware, (req, res) => {
    const userOrders = orders[req.user.id] || [];
    const order = userOrders.find(o => o.id === req.params.orderId || o.orderId === req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
});

// ─── PATCH /api/orders/:orderId/cancel ───────────────────────────────────────
router.patch('/:orderId/cancel', authMiddleware, (req, res) => {
    const userOrders = orders[req.user.id] || [];
    const index = userOrders.findIndex(o => o.id === req.params.orderId || o.orderId === req.params.orderId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

    if (['shipped', 'out-for-delivery', 'delivered'].includes(userOrders[index].status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }

    userOrders[index].status = 'cancelled';
    userOrders[index].cancelledAt = new Date().toISOString();

    res.json({ success: true, message: 'Order cancelled successfully', order: userOrders[index] });
});

module.exports = router;
