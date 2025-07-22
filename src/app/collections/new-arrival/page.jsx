"use client"
import React, { useEffect, useState } from 'react';
import ProductsDisplay from '../components/ProductsDisplay';
import { Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const NewArrivalPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/new-arrival');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-black animate-spin mb-4" />
            <p className="text-gray-600 font-light">Loading collection...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-medium mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-white text-sm hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductsDisplay products={products} title="New Arrivals" description='Discover our exquisite collection of premium clothing that blends timeless elegance with contemporary'/>
      <Footer />
    </>
  );
};

export default NewArrivalPage;