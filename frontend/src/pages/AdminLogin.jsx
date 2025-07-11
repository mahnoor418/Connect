// src/pages/AdminLogin.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://127.0.0.1:5003/api/admin/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
            navigate('/admin');

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
