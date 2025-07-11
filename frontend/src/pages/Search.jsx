import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search from '../components/Search';

const SearchPage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Search />
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;