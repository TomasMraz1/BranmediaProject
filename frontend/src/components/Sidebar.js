import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const username = localStorage.getItem('username')
const Sidebar = ({ onLogout }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="/images/logo.png" alt="Company Logo" className="sidebar-logo" />
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard" className="menu-item">
                        <i className="fas fa-chart-line"></i>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/billboards" className="menu-item">
                        <i className="fas fa-ad"></i>
                        <span>Billboards</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/orders" className="menu-item">
                        <i className="fas fa-file-invoice"></i>
                        <span>Orders</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/reservations" className="menu-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>Reservations</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/users" className="menu-item">
                        <i className="fas fa-users"></i>
                        <span>Users</span>
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <p>Logged in as: {username}</p>
                <button className="logout-button" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
