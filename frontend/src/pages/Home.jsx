import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PostHome from '../components/PostHome';

const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api';

const Home = () => {
  const navigate = useNavigate();

  /* ──────────────────────────────── Local state ────────────────────────────── */
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);

  /* ─────────────────────── Logged-in user info (from LS) ───────────────────── */
  const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');
  const userId = storedUser?._id || storedUser?.id || null;

  /* ───────────────────────── Fetch logged-in user doc ──────────────────────── */
  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`${API}/users/${userId}`);
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }, [userId]);

  /* ───────────────────────────── Fetch home feed ───────────────────────────── */
  const fetchFeed = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await axios.get(`${API}/users/${userId}/feed/posts`);

      // Accept either `[...]` or `{ posts: [...] }`
      setPosts(Array.isArray(data) ? data : data.posts ?? []);
    } catch (err) {
      console.error('Error fetching feed:', err);
    }
  }, [userId]);

  /* ────────────────────────────── Side-effects ─────────────────────────────── */
  useEffect(() => {
    if (!userId) {
      // navigate('/login'); // ← enable if you want to force login
      return;
    }
    fetchUser();
    fetchFeed();
  }, [userId, fetchUser, fetchFeed]);

  /* ──────────────────────────────── Render ─────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight mb-4">
            Welcome to <span className="text-blue-600">Connect</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Share your moments. Follow friends. Explore stories.
          </p>

          {/* Post Feed */}
          <div className="max-w-3xl mx-auto space-y-8">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center">
                No posts yet. Follow others or create a post!
              </p>
            ) : (
              posts.map((post) => (
                <PostHome
                  key={post._id}
                  post={post}
                  viewerId={userId}
                  userhe={userData}
                  onPostUpdated={fetchFeed}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
