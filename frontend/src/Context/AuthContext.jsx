import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // from firebase/auth directly


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      localStorage.removeItem('user'); // cleanup corrupted entry
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (name, username, email, password) => {
    await axios.post('http://127.0.0.1:8000/api/auth/register', { name, username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const googleLogin = async (navigate) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        username: user.displayName.replace(/\s+/g, '').toLowerCase(),
        email: user.email,
        password: user.uid.slice(0, 8),
      };

      // Try register
      try {
        await axios.post('http://127.0.0.1:8000/api/auth/register', userData);
      } catch (err) {
        if (!(err.response && err.response.status === 409)) {
          throw err;
        }
      }

      // Login
      const loginRes = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        email: userData.email,
        password: userData.password,
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      setUser(loginRes.data.user);

      navigate('/');
    } catch (error) {
      console.error('Google Login/Register Error:', error);
    }
  };




  return (
    <AuthContext.Provider value={{ user, login, logout, register, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
