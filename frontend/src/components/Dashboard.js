import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './Dashboard.css';
import socket from '../utils/socket';

const Dashboard = ({ onLogout }) => {
    const [analytics, setAnalytics] = useState({
        totalBillboards: 0,
        totalOrders: 0,
        totalReservations: 0,
        totalUsers: 0,
    });

    useEffect(() => {
        // Fetch initial analytics
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('https://branmedia.onrender.com/api/analytics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const data = await response.json();
                setAnalytics(data);
                console.log('Fetched analytics:', data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchAnalytics();

        // Listen for real-time analytics updates
        socket.on('dashboardAnalyticsUpdate', (updatedAnalytics) => {
            console.log('Received analytics update:', updatedAnalytics);
            setAnalytics(updatedAnalytics);
        });

        return () => {
            socket.off('dashboardAnalyticsUpdate'); // Cleanup socket listener
        };
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={onLogout} />
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <div className="analytics-cards">
                    <div className="analytics-card">
                        <h3>Total Billboards</h3>
                        <p>{analytics.totalBillboards}</p>
                    </div>
                    <div className="analytics-card">
                        <h3>Total Orders</h3>
                        <p>{analytics.totalOrders}</p>
                    </div>
                    <div className="analytics-card">
                        <h3>Total Reservations</h3>
                        <p>{analytics.totalReservations}</p>
                    </div>
                    <div className="analytics-card">
                        <h3>Total Users</h3>
                        <p>{analytics.totalUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
