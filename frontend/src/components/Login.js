import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login button clicked');
    
        try {
            console.log('Sending login request with:', { email, password });
            const response = await axios.post('https://branmedia.onrender.com/api/auth/login', {
                email,
                password,
            });
    
            console.log('Login response received:', response.data);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('username', response.data.username);
        } catch (err) {
            console.error('Error during login:', err.response || err.message);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <img src="/images/logo.png" alt="BranMedia Logo" />
            </div>

            <div className="login-container">
                <h2>Prihlásenie</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <div className="input-with-icon">
                            <img src="/images/user_icon.png" alt="Email Icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-with-icon">
                            <img src="/images/password_icon.png" alt="Password Icon" />
                            <input
                                type="password"
                                placeholder="Heslo"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Prihlásiť sa</button>
                </form>
            </div>
        </div>
    );
};

export default Login;