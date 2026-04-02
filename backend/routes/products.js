const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '../data/products.json');
let products = require(DATA_PATH);

// Helper to save products
const saveProducts = () => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
};

// ─── Multer Config ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ─── GET /api/products ────────────────────────────────────────────────────────
router.get('/', (req, res) => {
    let filtered = [...products];

    const { category, brand, gender, minPrice, maxPrice, frameShape, isPolarized, isBlueLight, isBestSeller, sort, search, page = 1, limit = 12 } = req.query;

    if (category) filtered = filtered.filter(p => p.category === category);
    if (brand) filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    if (gender) filtered = filtered.filter(p => p.gender === gender || p.gender === 'unisex');
    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
    if (frameShape) filtered = filtered.filter(p => p.frameShape === frameShape);
    if (isPolarized === 'true') filtered = filtered.filter(p => p.isPolarized);
    if (isBlueLight === 'true') filtered = filtered.filter(p => p.isBlueLight);
    if (isBestSeller === 'true') filtered = filtered.filter(p => p.isBestSeller);
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.frameShape && p.frameShape.toLowerCase().includes(q))
        );
    }

    // Sort
    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'discount') filtered.sort((a, b) => b.discount - a.discount);
    else if (sort === 'popular') filtered.sort((a, b) => b.reviews - a.reviews);

    // Pagination
    const total = filtered.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    res.json({
        success: true,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
        products: paginated
    });
});

// ─── GET /api/products/featured ───────────────────────────────────────────────
router.get('/featured', (req, res) => {
    const featured = products.filter(p => p.isBestSeller).slice(0, 8);
    res.json({ success: true, products: featured });
});

// ─── GET /api/products/new-arrivals ──────────────────────────────────────────
router.get('/new-arrivals', (req, res) => {
    const newArrivals = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
    res.json({ success: true, products: newArrivals });
});

// ─── GET /api/products/categories ────────────────────────────────────────────
router.get('/categories', (req, res) => {
    const categories = [
        { id: 'eyeglasses', name: 'Eyeglasses', count: products.filter(p => p.category === 'eyeglasses').length, icon: '👓' },
        { id: 'sunglasses', name: 'Sunglasses', count: products.filter(p => p.category === 'sunglasses').length, icon: '🕶️' },
        { id: 'contact-lenses', name: 'Contact Lenses', count: products.filter(p => p.category === 'contact-lenses').length, icon: '👁️' }
    ];
    res.json({ success: true, categories });
});

// ─── GET /api/products/brands ─────────────────────────────────────────────────
router.get('/brands', (req, res) => {
    const brandSet = [...new Set(products.map(p => p.brand))];
    const brands = brandSet.map(b => ({
        name: b,
        count: products.filter(p => p.brand === b).length
    }));
    res.json({ success: true, brands });
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products
    const related = products
        .filter(p => p.id !== product.id && p.category === product.category)
        .slice(0, 4);

    res.json({ success: true, product, related });
});

// ─── ADMIN: Add Product ───────────────────────────────────────────────────────
router.post('/', upload.single('image'), (req, res) => {
    try {
        const { name, brand, category, price, description, gender, frameShape, isPolarized, isBlueLight, isBestSeller, stock } = req.body;

        const newProduct = {
            id: uuidv4(),
            name,
            brand,
            category,
            price: Number(price),
            description,
            gender: gender || 'unisex',
            frameShape,
            isPolarized: isPolarized === 'true',
            isBlueLight: isBlueLight === 'true',
            isBestSeller: isBestSeller === 'true',
            stock: Number(stock) || 0,
            image: req.file ? `/uploads/${req.file.filename}` : 'https://placehold.co/400x400?text=No+Image',
            rating: 4.5,
            reviews: 0,
            discount: 0,
            colors: ['#000000']
        };

        products.push(newProduct);
        saveProducts();

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── ADMIN: Update Product ────────────────────────────────────────────────────
router.put('/:id', upload.single('image'), (req, res) => {
    try {
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

        const updates = { ...req.body };
        if (updates.price) updates.price = Number(updates.price);
        if (updates.stock) updates.stock = Number(updates.stock);
        if (updates.isPolarized) updates.isPolarized = updates.isPolarized === 'true';
        if (updates.isBlueLight) updates.isBlueLight = updates.isBlueLight === 'true';
        if (updates.isBestSeller) updates.isBestSeller = updates.isBestSeller === 'true';

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        products[index] = { ...products[index], ...updates };
        saveProducts();

        res.json({ success: true, product: products[index] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── ADMIN: Delete Product ────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

    products.splice(index, 1);
    saveProducts();

    res.json({ success: true, message: 'Product deleted' });
});

module.exports = router;
