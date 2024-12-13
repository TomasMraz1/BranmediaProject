import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
if (!token) {
    console.error('Token missing! Please log in again.');
}

const socket = io('https://branmedia.onrender.com', {
    auth: { token },
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
});

export default socket;
