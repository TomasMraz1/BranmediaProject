import React, { useState, useEffect } from 'react';
import socket from '../utils/socket'; // Centralized socket instance
import Sidebar from './Sidebar';
import './Orders.css';

const Orders = ({ onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newOrder, setNewOrder] = useState({
        customer_name: '',
        invoice_status: 'Paid', // Default selection
        invoice_number: '',
        created_by: localStorage.getItem('username'), // Initialize with an empty string
    });

    useEffect(() => {
        // Confirm socket connection
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        // Fetch initial orders
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://branmedia.onrender.com/api/orders', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (!response.ok) {
                    throw new Error(`Error fetching orders: ${response.statusText}`);
                }
                const data = await response.json();
                setOrders(data);
                console.log('Fetched initial orders:', data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();

        // Fetch the logged-in user's name and set it for the "Created By" field
        /*const fetchUserEmail = () => {
            const email = localStorage.getItem('email'); // Retrieve the email from local storage
            if (email) {
                setNewOrder((prevOrder) => ({
                    ...prevOrder,
                    created_by: email, // Use the email to prefill the 'Created By' field
                }));
            }
        };
    
        fetchUserEmail();*/

        /*const fetchUserName = () => {
            const username = localStorage.getItem('username'); // Retrieve the email from local storage
            if (username) {
                setNewOrder((prevOrder) => ({
                    ...prevOrder,
                    created_by: username, // Use the email to prefill the 'Created By' field
                }));
            }
        };
    
        fetchUserName();*/

        // Listen for real-time updates
        socket.on('ordersUpdate', (updatedOrders) => {
            console.log('Received orders update:', updatedOrders);
            setOrders(updatedOrders);
        });

        // Cleanup function to avoid memory leaks
        return () => {
            socket.off('ordersUpdate');
        };
    }, []);

    const handleAddOrder = async () => {
        try {
            const response = await fetch('https://branmedia.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newOrder),
            });

            if (!response.ok) {
                throw new Error(`Error adding order: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Order added successfully:', result);
            setShowPopup(false); // Close the popup
            setNewOrder({
                customer_name: '',
                invoice_status: 'Paid',
                invoice_number: '',
                created_by: localStorage.getItem('email') || '',
            });
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({ ...newOrder, [name]: value });
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar onLogout={onLogout} />
            <div className="orders-content">
                <h1>Orders</h1>
                <button className="add-order-button" onClick={() => setShowPopup(true)}>
                    Add Order
                </button>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Invoice Status</th>
                            <th>Invoice Number</th>
                            <th>Created By</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer_name}</td>
                                <td>{order.invoice_status}</td>
                                <td>{order.invoice_number}</td>
                                <td>{order.created_by}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                                <td>{new Date(order.updated_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h2>Add New Order</h2>
                            <label>
                                Customer Name:
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={newOrder.customer_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer name"
                                />
                            </label>
                            <label>
                                Invoice Status:
                                <select
                                    name="invoice_status"
                                    value={newOrder.invoice_status}
                                    onChange={handleInputChange}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </label>
                            <label>
                                Invoice Number:
                                <input
                                    type="text"
                                    name="invoice_number"
                                    value={newOrder.invoice_number}
                                    onChange={handleInputChange}
                                    placeholder="Enter invoice number"
                                />
                            </label>
                            <label>
                                Created By:
                                <input
                                    type="text"
                                    value={newOrder.created_by}
                                    readOnly
                                    placeholder={newOrder.created_by}
                                />
                            </label>
                            <div className="popup-buttons">
                                <button onClick={handleAddOrder} className="submit-button">
                                    Submit
                                </button>
                                <button onClick={() => setShowPopup(false)} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
