import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Billboards from './components/Billboards';
import Orders from './components/Orders';
import Reservations from './components/Reservations';
import './css/style.css';

const App = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check for a token in localStorage when the app loads
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        setToken(null); // Reset token state
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />}
                />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/billboards"
                    element={token ? <Billboards onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/orders"
                    element={token ? <Orders onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/reservations"
                    element={token ? <Reservations onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route
                    path="*"
                    element={<Navigate to={token ? "/dashboard" : "/login"} />}
                />
            </Routes>
        </Router>
    );
};

export default App;
