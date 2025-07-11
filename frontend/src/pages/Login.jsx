import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                Email
              </label>
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
              <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Login
            </button>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => googleLogin(navigate)}
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              Continue with Google
            </button>

            {/* Forgot Password Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
