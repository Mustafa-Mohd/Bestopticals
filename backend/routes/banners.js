const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '../data/banners.json');
let banners = require(DATA_PATH);

// Helper to save banners
const saveBanners = () => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(banners, null, 2));
};

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// GET all banners
router.get('/', (req, res) => {
    res.json({ success: true, banners });
});

// POST new banner
router.post('/', upload.single('image'), (req, res) => {
    const { title, subtitle, description, tag, link } = req.body;
    const newBanner = {
        id: uuidv4(),
        title,
        subtitle,
        description,
        tag,
        link,
        image: req.file ? `/uploads/${req.file.filename}` : 'https://placehold.co/1200x400'
    };
    banners.push(newBanner);
    saveBanners();
    res.status(201).json({ success: true, banner: newBanner });
});

// DELETE banner
router.delete('/:id', (req, res) => {
    const index = banners.findIndex(b => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Banner not found' });
    banners.splice(index, 1);
    saveBanners();
    res.json({ success: true, message: 'Banner deleted' });
});

module.exports = router;
