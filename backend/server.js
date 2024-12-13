// File: server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const setupSockets = require('./sockets/realtime');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://branmedia.virtualize.sk', 'http://localhost:3001'], // Allow multiple origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});


// Middleware
app.use(cors());
app.use(express.json());

// Set up Socket.IO
global.io = io; // Expose io globally
setupSockets(io);

// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
