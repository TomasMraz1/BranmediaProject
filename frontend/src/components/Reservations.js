import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Reservations.css';
import socket from '../utils/socket';

const Reservations = ({ onLogout }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // Fetch initial reservations
        const fetchReservations = async () => {
            try {
                const response = await fetch('https://branmedia.onrender.com/api/reservations', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setReservations(data);
                console.log('Fetched initial reservations:', data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();

        // Listen for real-time reservations updates
        socket.on('reservationsUpdate', (updatedReservations) => {
            console.log('Received reservations update:', updatedReservations);
            setReservations(updatedReservations);
        });

        return () => {
            socket.off('reservationsUpdate'); // Cleanup socket listener
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={onLogout} />
            <div className="reservations-content">
                <h1>Reservations</h1>
                <table className="reservations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Reserved By</th>
                            <th>Created By</th>
                            <th>Valid Until</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.id}</td>
                                <td>{reservation.reserved_by}</td>
                                <td>{reservation.created_by}</td>
                                <td>{new Date(reservation.valid_until).toLocaleString()}</td>
                                <td>{new Date(reservation.created_at).toLocaleString()}</td>
                                <td>{new Date(reservation.updated_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reservations;
