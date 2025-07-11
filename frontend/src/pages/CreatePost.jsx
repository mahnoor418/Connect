import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreatePost from '../components/CreatePost';

const CreatePostPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Create a New Post</h1>
        <CreatePost />
      </main>
      <Footer />
    </div>
  );
};

export default CreatePostPage;
