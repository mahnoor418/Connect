import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const UserActivityChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5003/api/admin/activity-summary');
                const chartData = res.data.map(entry => ({
                    date: entry._id,
                    logins: entry.logins
                }));
                setData(chartData);
            } catch (err) {
                console.error("Failed to fetch activity data:", err);
            }
        };

        fetchActivityData();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">User Login Activity</h2>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 20, right: 30, bottom: 10, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="linear" dataKey="logins" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500">No login data available.</p>
            )}
        </div>
    );
};

export default UserActivityChart;
