import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import api from '../services/api';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users/posts');
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Feed</h1>
        <CreatePost />
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feed;