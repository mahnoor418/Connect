import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserActivityChart from '../components/UserActivityChart';
import Header from '../components/Header';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5003/api/admin/users');
            setUsers(res.data);
            setShowUsers(true);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="max-w-6xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="bg-white shadow-lg rounded-lg p-8">
                        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Admin Dashboard</h1>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="http://127.0.0.1:5003/api/admin/activity-log/download"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download Activity Log (PDF)
                            </a>
                            <button
                                onClick={fetchUsers}
                                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition"
                            >
                                View All Users
                            </button>
                        </div>
                    </div>

                    {/* Users Table */}
                    {showUsers && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-700">User List</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse text-sm">
                                    <thead className="bg-gray-200 text-gray-700">
                                        <tr>
                                            <th className="p-3 border">Name</th>
                                            <th className="p-3 border">Username</th>
                                            <th className="p-3 border">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="p-3 border">{user.name}</td>
                                                <td className="p-3 border">{user.username}</td>
                                                <td className="p-3 border">{user.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Activity Chart */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <UserActivityChart />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
