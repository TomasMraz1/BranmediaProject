const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Login Endpoint
router.post('/auth/login', async (req, res) => {
    console.log('Login request received:', req.body); // Debugging log
    const { email, password } = req.body;

    try {
        // Fetch user from the database by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0]; // Get the first (and only) user
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Sign the JWT and include the email in the payload
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful, returning token and username:', token, 'and', user.username); // Debugging log
        res.json({ token, username: user.username, email: user.email }); // Include the email in the response
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get billboards endpoint
router.get('/billboards', async (req, res) => {
    try {
        const [billboards] = await db.query(`
            SELECT id, name, city, type, price_monthly, status 
            FROM billboards
        `);
        res.json(billboards);
    } catch (err) {
        console.error('Error fetching billboards:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new billboard
router.post('/billboards', async (req, res) => {
    const { name, city, type, price_monthly, status } = req.body;

    try {
        await db.query(
            'INSERT INTO billboards (name, city, type, price_monthly, status) VALUES (?, ?, ?, ?, ?)',
            [name, city, type, price_monthly, status]
        );

        // Emit the update
        const [billboards] = await db.query('SELECT * FROM billboards');
        global.io.emit('billboardsUpdate', billboards);

        res.status(201).json({ message: 'Billboard added successfully' });
    } catch (err) {
        console.error('Error adding billboard:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get orders endpoint
router.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT id, customer_name, invoice_status, invoice_number, created_by, created_at, updated_at
            FROM orders
        `);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new order
router.post('/orders', async (req, res) => {
    const { customer_name, invoice_status, invoice_number, created_by } = req.body;

    try {
        await db.query(
            'INSERT INTO orders (customer_name, invoice_status, invoice_number, created_by, created_at) VALUES (?, ?, ?, ?, NOW())',
            [customer_name, invoice_status, invoice_number, created_by]
        );

        // Emit the update
        const [orders] = await db.query('SELECT * FROM orders');
        global.io.emit('ordersUpdate', orders);

        res.status(201).json({ message: 'Order added successfully' });
    } catch (err) {
        console.error('Error adding order:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get reservations endpoint
router.get('/reservations', async (req, res) => {
    try {
        const [reservations] = await db.query(`
            SELECT id, reserved_by, created_by, valid_until, created_at, updated_at 
            FROM reservations
        `);
        res.json(reservations);
    } catch (err) {
        console.error('Error fetching reservations:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new reservation
router.post('/reservations', async (req, res) => {
    const { reserved_by, created_by, valid_until } = req.body;

    try {
        await db.query(
            'INSERT INTO reservations (reserved_by, created_by, valid_until, created_at) VALUES (?, ?, ?, NOW())',
            [reserved_by, created_by, valid_until]
        );

        // Emit the update
        const [reservations] = await db.query('SELECT * FROM reservations');
        global.io.emit('reservationsUpdate', reservations);

        res.status(201).json({ message: 'Reservation added successfully' });
    } catch (err) {
        console.error('Error adding reservation:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
    try {
        const [[billboards]] = await db.query('SELECT COUNT(*) AS total FROM billboards');
        const [[orders]] = await db.query('SELECT COUNT(*) AS total FROM orders');
        const [[reservations]] = await db.query('SELECT COUNT(*) AS total FROM reservations');
        const [[users]] = await db.query('SELECT COUNT(*) AS total FROM users');

        res.json({
            totalBillboards: billboards.total,
            totalOrders: orders.total,
            totalReservations: reservations.total,
            totalUsers: users.total,
        });
    } catch (err) {
        console.error('Error fetching analytics data:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
