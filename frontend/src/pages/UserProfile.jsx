import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;