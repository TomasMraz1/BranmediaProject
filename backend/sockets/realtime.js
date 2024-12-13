const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const setupSockets = (io) => {
    // Middleware to validate the token during the handshake
    io.use((socket, next) => {
        const token = socket.handshake.auth.token; // Extract the token from the handshake

        if (!token) {
            console.error('Authentication error: No token provided');
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            // Verify the token using the secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach the user information to the socket object
            console.log(`Token validated for user: ${decoded.email}`);
            next(); // Allow the connection
        } catch (err) {
            console.error('Authentication error: Invalid token');
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    // Handle Socket.IO connections
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id} (User ID: ${socket.user.id})`);

        let lastBillboardsChecksum = null;
        let lastOrdersChecksum = null;
        let lastReservationsChecksum = null;
        let lastDashboardChecksum = null;

        // Function to fetch and emit billboards data
        const fetchBillboards = async () => {
            try {
                const [billboards] = await db.query(`
                    SELECT id, name, city, type, price_monthly, status 
                    FROM billboards
                `);
                const checksum = JSON.stringify(billboards);

                if (checksum !== lastBillboardsChecksum) {
                    lastBillboardsChecksum = checksum;
                    console.log('Emitting billboards update');
                    socket.emit('billboardsUpdate', billboards);
                }
            } catch (err) {
                console.error('Error fetching billboards data:', err.message);
            }
        };

        // Function to fetch and emit orders data
        const fetchOrders = async () => {
            try {
                const [orders] = await db.query(`
                    SELECT id, customer_name, invoice_status, invoice_number, created_by, created_at, updated_at
                    FROM orders
                `);
                const checksum = JSON.stringify(orders);

                if (checksum !== lastOrdersChecksum) {
                    lastOrdersChecksum = checksum;
                    console.log('Emitting orders update');
                    socket.emit('ordersUpdate', orders);
                }
            } catch (err) {
                console.error('Error fetching orders data:', err.message);
            }
        };

        // Function to fetch and emit reservations data
        const fetchReservations = async () => {
            try {
                const [reservations] = await db.query(`
                    SELECT id, reserved_by, created_by, valid_until, created_at, updated_at 
                    FROM reservations
                `);
                const checksum = JSON.stringify(reservations);

                if (checksum !== lastReservationsChecksum) {
                    lastReservationsChecksum = checksum;
                    console.log('Emitting reservations update');
                    socket.emit('reservationsUpdate', reservations);
                }
            } catch (err) {
                console.error('Error fetching reservations data:', err.message);
            }
        };

        // Function to fetch and emit dashboard analytics data
        const fetchDashboardAnalytics = async () => {
            try {
                const [[billboards]] = await db.query('SELECT COUNT(*) AS total FROM billboards');
                const [[orders]] = await db.query('SELECT COUNT(*) AS total FROM orders');
                const [[reservations]] = await db.query('SELECT COUNT(*) AS total FROM reservations');
                const [[users]] = await db.query('SELECT COUNT(*) AS total FROM users');

                const analytics = {
                    totalBillboards: billboards.total,
                    totalOrders: orders.total,
                    totalReservations: reservations.total,
                    totalUsers: users.total,
                };

                const checksum = JSON.stringify(analytics);

                if (checksum !== lastDashboardChecksum) {
                    lastDashboardChecksum = checksum;
                    console.log('Emitting dashboard analytics update');
                    socket.emit('dashboardAnalyticsUpdate', analytics);
                }
            } catch (err) {
                console.error('Error fetching dashboard analytics data:', err.message);
            }
        };

        // Function to fetch and emit all updates
        const fetchAllUpdates = async () => {
            await Promise.all([fetchBillboards(), fetchOrders(), fetchReservations(), fetchDashboardAnalytics()]);
        };

        // Check for updates every 5 seconds
        const interval = setInterval(fetchAllUpdates, 5000);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            clearInterval(interval); // Stop polling when the client disconnects
        });
    });

    console.log('Socket.IO setup complete');
};

module.exports = setupSockets;
