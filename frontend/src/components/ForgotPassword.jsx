import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

  const handleSendOTP = async () => {
    if (!email) {
      setMessage('Please enter your email');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/sendotp', { email });
      console.log(res.data);
      setOtpSent(true);
      setMessage(res.data.message);
      setIsError(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
      setIsError(true);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/verifyotp', { email, otp });
      setOtpVerified(true);
      setMessage(res.data.message);
      setIsError(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid OTP');
      setIsError(true);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setMessage('Please enter a new password');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/resetpassword', {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setIsError(false);
      navigate('/login'); // Redirect to login page after resetting the password
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
      setIsError(true);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Forgot Password
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}
        >
          {message}
        </p>
      )}

      {!otpSent && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOTP}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {otpSent && !otpVerified && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            className="w-full mb-3 mt-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </>
      )}

      {otpVerified && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            className="w-full mb-3 mt-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
