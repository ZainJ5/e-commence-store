"use client";
import React, { useEffect, useState } from 'react';
import ProductsDisplay from '../components/ProductsDisplay';
import { Loader } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ShahCollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/mr-shah-collection');
        
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center space-y-4" role="status" aria-live="polite">
            <div className="relative">
              <Loader 
                className="w-12 h-12 text-gray-800 animate-spin" 
                aria-label="Loading Mr. Shah Collection"
              />
              <div className="absolute inset-0 bg-gray-200 opacity-20 rounded-full animate-pulse" />
            </div>
            <p className="text-lg font-medium text-gray-700 tracking-wide animate-pulse">
              Loading Mr. Shah Collection...
            </p>
            <p className="text-sm text-gray-500 font-light">
              Curating elegance, just for you.
            </p>
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-medium mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black text-sm hover:bg-gray-800"
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
      <ProductsDisplay 
        products={products} 
        title="Mr. Shah Collection" 
        description="Explore our exclusive Mr. Shah collection, featuring premium craftsmanship and unique designs that embody sophistication and timeless elegance."
      />
      <Footer />
    </>
  );
};

export default ShahCollectionPage;