import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext'; // ✅ import your context
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import Search from './pages/Search';
import EditProfile from './pages/EditProfile';
import CreatePost from './pages/CreatePost';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import './index.css';
import 'leaflet/dist/leaflet.css';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Private Routes */}
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
