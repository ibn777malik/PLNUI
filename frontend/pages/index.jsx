// pages/index.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyGrid from '../components/PropertyGrid';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Planet Land Real Estate</h1>
        <PropertyGrid />
      </main>
      <Footer />
    </>
  );
}
