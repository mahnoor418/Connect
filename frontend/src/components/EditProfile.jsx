import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/users/${user.id}`);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put(`http://127.0.0.1:5000/api/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await axios.delete('http://127.0.0.1:8000/api/auth/deleteaccount', {
          data: { userId: user.id },
        });

        if (response.status === 200) {
          alert('Account deleted successfully.');
          localStorage.removeItem('token');
          navigate('/register');
        } else {
          alert('Failed to delete account.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error occurred while deleting account.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border text-blue-500" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Your Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-medium">Profile Picture</label>
            <div className="mt-2">
              <input
                type="file"
                id="profilePicture"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
              />
              {profilePicture && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
              Update Profile
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-between">
          {/* Delete Account Button */}
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="py-3 px-6 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Delete Account
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="py-3 px-6 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
