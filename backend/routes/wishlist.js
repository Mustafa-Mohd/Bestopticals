const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');

// ─── In-Memory Wishlist Store ─────────────────────────────────────────────────
const wishlists = {};

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

// ─── GET /api/wishlist ────────────────────────────────────────────────────────
router.get('/', authMiddleware, (req, res) => {
    const wishlist = wishlists[req.user.id] || [];
    res.json({ success: true, wishlist, count: wishlist.length });
});

// ─── POST /api/wishlist/add ───────────────────────────────────────────────────
router.post('/add', authMiddleware, (req, res) => {
    const { productId, name, price, originalPrice, image, brand, category } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });

    if (!wishlists[req.user.id]) wishlists[req.user.id] = [];
    const exists = wishlists[req.user.id].find(item => item.productId === productId);

    if (exists) {
        return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    wishlists[req.user.id].push({
        productId, name, price, originalPrice, image, brand, category,
        addedAt: new Date().toISOString()
    });

    res.json({
        success: true,
        message: 'Added to wishlist',
        wishlist: wishlists[req.user.id],
        count: wishlists[req.user.id].length
    });
});

// ─── DELETE /api/wishlist/remove/:productId ───────────────────────────────────
router.delete('/remove/:productId', authMiddleware, (req, res) => {
    if (!wishlists[req.user.id]) wishlists[req.user.id] = [];
    wishlists[req.user.id] = wishlists[req.user.id].filter(item => item.productId !== req.params.productId);

    res.json({
        success: true,
        message: 'Removed from wishlist',
        wishlist: wishlists[req.user.id],
        count: wishlists[req.user.id].length
    });
});

// ─── GET /api/wishlist/check/:productId ──────────────────────────────────────
router.get('/check/:productId', authMiddleware, (req, res) => {
    const wishlist = wishlists[req.user.id] || [];
    const inWishlist = wishlist.some(item => item.productId === req.params.productId);
    res.json({ success: true, inWishlist });
});

module.exports = router;
