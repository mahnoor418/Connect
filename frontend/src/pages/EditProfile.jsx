import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EditProfile from '../components/EditProfile';

const EditProfilePage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <EditProfile />
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;