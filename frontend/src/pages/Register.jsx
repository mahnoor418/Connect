import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, username, email, password);
      console.log('Registration successful');
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Register</h2>

          {/* Error Message Display */}
          {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-5">
              <label htmlFor="name" className="block text-gray-600 font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Enter your full name"
              />
            </div>

            {/* Username Input */}
            <div className="mb-5">
              <label htmlFor="username" className="block text-gray-600 font-medium mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Create a username"
              />
            </div>

            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-gray-600 font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Create a password"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Register
            </button>

            {/* Already have an account? */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
