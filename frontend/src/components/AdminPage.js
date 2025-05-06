import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import ManageProduct from './ManageProduct';
import Order from './Order';
import headerLogo from '../images/header_logo.jpg';

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true" // Check localStorage on initial load
    );
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(null);
    const [confirmLogout, setConfirmLogout] = useState(false);

    const adminCredentials = {
        username: "Rohith", 
        password: "@admin", 
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === adminCredentials.username && password === adminCredentials.password) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true"); // Save authentication state
            setSuccess(`Welcome, ${username}! You are logged in as an Admin.`);
            setTimeout(() => setSuccess(null), 3500); 
        } else {
            alert("Invalid username or password");
            window.location.reload(); 
        }
    };

    const handleLogout = () => {
        setConfirmLogout(true);
    };

    const confirmLogoutHandler = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated"); // Clear authentication state
        window.location.href = "/"; // Redirect to the root path after logout
    };

    if (isAuthenticated) {
        return (
            <div>
                {success && <div className="admin-notification-success">{success}</div>}
                <BrowserRouter>
                    <div className="container">
                        <Navbar handleLogout={handleLogout} />
                        {
                            confirmLogout && (
                                <div className="confirm-logout">
                                    <p style={{fontSize: '18px'}}>Are you sure you want to logout?</p>
                                    <div className="confirm-logout-buttons">
                                    <button className="btn btn-success" style={{fontSize: '14px'}} onClick={() => setConfirmLogout(false)}>Cancel</button>
                                    <button className="btn btn-danger" style={{fontSize: '14px'}} onClick={(confirmLogoutHandler)}>Logout</button>
                                    </div>
                                </div>
                            )
                        }
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/manage-product" element={<ManageProduct />} />
                            <Route path="/order" element={<Order />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: "#FFFFFFE3",
            fontFamily: 'Arial, sans-serif',
            gap: '50px'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
            }}>
                <img src={headerLogo} alt="Grocery Store Icon" style={{ display: 'block', height: '50px', width: '50px', borderRadius: '15px' }} className="grocery-store-icon" />
                <h2 className="grocery-store-title">Grocery Store Management System</h2>
            </div>

            <form onSubmit={handleLogin} style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '300px'
            }}>
                <h1 style={{ color: '#09122C', marginBottom: '20px', marginTop: 0, fontSize: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        color: '#09122C'
                    }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: '95%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #393E46',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold',
                        color: '#09122C'
                    }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '95%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #393E46',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <button type="submit" style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }} className="btn btn-success">
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminPage;