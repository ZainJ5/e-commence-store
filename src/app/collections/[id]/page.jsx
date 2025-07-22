"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductsDisplay from '../components/ProductsDisplay';

const CollectionPage = () => {
  const params = useParams();
  const collectionId = params.id;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  
  useEffect(() => {
    switch (collectionId) {
      case 'men':
        setCollectionTitle('Men\'s Collection');
        setCollectionDescription('Sophisticated and modern menswear designed for comfort and style.');
        break;
      case 'women':
        setCollectionTitle('Women\'s Collection');
        setCollectionDescription('Elegant and versatile women\'s fashion for every occasion.');
        break;
      case 'kids':
        setCollectionTitle('Kids Collection');
        setCollectionDescription('Colorful and comfortable clothing for the little ones.');
        break;
      case 'customizable':
        setCollectionTitle('Customizable Collection');
        setCollectionDescription('Make it yours - unique pieces that can be customized to your preferences.');
        break;
      case 'sale':
        setCollectionTitle('Sale Items');
        setCollectionDescription('Special offers on our premium collection - limited time only.');
        break;
      case 'new-arrival':
        setCollectionTitle('New Arrivals');
        setCollectionDescription('Discover our latest additions to the collection - fresh designs just for you.');
        break;
      case 'featured':
        setCollectionTitle('Featured Collection');
        setCollectionDescription('Our hand-picked selection of standout pieces that showcase the best of our range.');
        break;
      case 'mr-shah-collection':
        setCollectionTitle('Mr. Shah Collection');
        setCollectionDescription('Explore our exclusive Mr. Shah collection, featuring premium craftsmanship and unique designs.');
        break;
      default:
        setCollectionTitle(collectionId.charAt(0).toUpperCase() + collectionId.slice(1));
        setCollectionDescription('Explore our exclusive collection of premium items.');
    }
    
    setPage(1);
    setProducts([]);
    setLoading(true);
    fetchProducts(1);
  }, [collectionId]);
  
  const fetchProducts = async (currentPage = 1) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}?page=${currentPage}&limit=24`);
      
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
              aria-label={`Loading ${collectionTitle || 'Collection'}`}
            />
            <p className="text-gray-600 font-light">
              Loading {collectionTitle || 'collection'}...
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
        title={collectionTitle} 
        description={collectionDescription}
        hasMore={hasMore}
        loadMore={loadMoreProducts}
      />
      <Footer />
    </>
  );
};

export default CollectionPage;