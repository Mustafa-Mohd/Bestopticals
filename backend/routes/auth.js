const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const JWT_SECRET = 'lenskart_clone_secret_key_2024';
const JWT_EXPIRES_IN = '7d';

// ─── In-Memory User Store (replace with DB later) ────────────────────────────
const users = [];

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            id: uuidv4(),
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00BAC7&color=fff`,
            address: [],
            lenskartGold: false,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                avatar: newUser.avatar,
                lenskartGold: newUser.lenskartGold
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                lenskartGold: user.lenskartGold
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                address: user.address,
                lenskartGold: user.lenskartGold,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

// ─── PUT /api/auth/profile ────────────────────────────────────────────────────
router.put('/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const userIndex = users.findIndex(u => u.id === decoded.id);
        if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

        const { name, phone, address } = req.body;
        if (name) users[userIndex].name = name;
        if (phone) users[userIndex].phone = phone;
        if (address) users[userIndex].address = address;
        users[userIndex].avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(users[userIndex].name)}&background=00BAC7&color=fff`;

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: users[userIndex].id,
                name: users[userIndex].name,
                email: users[userIndex].email,
                phone: users[userIndex].phone,
                avatar: users[userIndex].avatar,
                address: users[userIndex].address,
                lenskartGold: users[userIndex].lenskartGold
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

module.exports = router;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
