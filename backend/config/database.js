const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool for MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST, // Database host
    user: process.env.DB_USER, // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
    waitForConnections: true, // Wait for available connections
    connectionLimit: 10, // Limit the number of concurrent connections
    queueLimit: 0, // Unlimited queued requests
});

module.exports = { db };
