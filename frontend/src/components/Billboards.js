import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Billboards.css';
import socket from '../utils/socket';

const Billboards = ({ onLogout }) => {
    const [billboards, setBillboards] = useState([]);

    useEffect(() => {
        // Fetch initial billboards
        const fetchBillboards = async () => {
            try {
                const response = await fetch('https://branmedia.onrender.com/api/billboards', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setBillboards(data);
                console.log('Fetched initial billboards:', data);
            } catch (error) {
                console.error('Error fetching billboards:', error);
            }
        };

        fetchBillboards();

        // Listen for real-time billboards updates
        socket.on('billboardsUpdate', (updatedBillboards) => {
            console.log('Received billboards update:', updatedBillboards);
            setBillboards(updatedBillboards);
        });

        return () => {
            socket.off('billboardsUpdate'); // Cleanup socket listener
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={onLogout} />
            <div className="billboards-content">
                <h1>Billboards</h1>
                <table className="billboards-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Type</th>
                            <th>Price Monthly</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billboards.map((billboard) => (
                            <tr key={billboard.id}>
                                <td>{billboard.id}</td>
                                <td>{billboard.name}</td>
                                <td>{billboard.city}</td>
                                <td>{billboard.type}</td>
                                <td>{billboard.price_monthly}</td>
                                <td>{billboard.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Billboards;
