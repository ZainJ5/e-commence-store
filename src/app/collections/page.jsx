"use client";
import React, { useEffect, useState } from 'react';
import ProductsDisplay from './components/ProductsDisplay';
import { Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CollectionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchProducts = async (currentPage = 1) => {
    try {
      const response = await fetch(`/api/collections?page=${currentPage}&limit=24`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (currentPage === 1) {
        setProducts(data.products || []);
      } else {
        setProducts(prev => [...prev, ...(data.products || [])]);
      }
      
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    if (!hasMore) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center" role="status" aria-live="polite">
            <Loader 
              className="w-10 h-10 text-black animate-spin mb-4" 
              aria-label="Loading All Collections"
            />
            <p className="text-gray-600 font-light">
              Loading All Collections...
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
              onClick={() => {
                setPage(1);
                fetchProducts();
              }}
              className="px-6 py-3 bg-black text-white text-sm hover:bg-gray-800"
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
        title="All Collections" 
        description="Discover our complete range of premium clothing and accessories, crafted with attention to detail and quality materials."
        hasMore={hasMore}
        loadMore={loadMoreProducts}
      />
      <Footer />
    </>
  );
};

export default CollectionsPage;