'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Load cart and wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');
    
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return `Rs${Number(price).toFixed(2)}`;
  };
  
  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    const percentage = Math.round((1 - discounted / original) * 100);
    return `-${percentage}%`;
  };
  
  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };
  
  const addToCart = (product) => {
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product._id);
    
    let newCart;
    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      newCart = [...cart, {
        id: product._id,
        name: product.name,
        price: product.discountedPrice || product.originalPrice,
        image: product.image,
        quantity: 1
      }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Show success notification (you can implement this)
    alert(`Added ${product.name} to cart!`);
  };

  const categories = ['All', 'Men\'s', 'Women\'s'];

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'All') return product.isActive !== false;
    if (activeCategory === 'Men\'s') return product.category?.toLowerCase().includes('men') && product.isActive !== false;
    if (activeCategory === 'Women\'s') return product.category?.toLowerCase().includes('women') && product.isActive !== false;
    return product.isActive !== false;
  });

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="absolute top-0 left-0 right-0 h-[40px] -mt-[40px] overflow-hidden">
        <svg 
          viewBox="0 0 1360 40" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,40 C85,30 170,20 340,15 C680,5 1020,20 1360,40 L1360,40 L0,40 Z" fill="rgb(249, 250, 251)"/>
        </svg>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
            LATEST COLLECTION
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Discover our carefully curated selection of premium fashion pieces
          </p>
          
          {/* Category Tabs */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-4 bg-white p-2 rounded-full shadow-lg border border-gray-100">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button 
              onClick={() => {
                const container = document.getElementById('products-container');
                container.scrollLeft -= 300;
              }}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 shadow-md"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('products-container');
                container.scrollLeft += 300;
              }}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 shadow-md"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-900 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl relative shadow-sm" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl relative shadow-sm" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">No products available in this category. Please check back later.</span>
            </div>
          </div>
        ) : (
          <>
            {/* Horizontal Scrolling Container */}
            <div 
              id="products-container"
              className="flex gap-6 md:gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="flex-none w-72 sm:w-80 md:w-96 group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 snap-start border border-gray-100"
                >
                  {/* NEW Badge */}
                  {index < 4 && (
                    <div className="absolute top-4 left-4 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                      NEW
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {calculateDiscount(product.originalPrice, product.discountedPrice)}
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                    >
                      <svg 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          wishlist.includes(product._id) ? 'text-gray-900 fill-current' : 'text-gray-600'
                        }`} 
                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={wishlist.includes(product._id) ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    
                    {/* Quick View Overlay */}
                    <Link 
                      href={`/products/${product._id}`}
                      className="absolute inset-0 bg-gray-900/0 hover:bg-gray-900/30 transition-all duration-500 flex items-center justify-center"
                    >
                      <span className="bg-gray-900 text-white px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 text-sm font-semibold shadow-lg backdrop-blur-sm">
                        Quick View
                      </span>
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 leading-tight" 
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-gray-400 line-through text-sm font-medium">{formatPrice(product.originalPrice)}</span>
                            <span className="text-gray-900 font-bold text-xl">{formatPrice(product.discountedPrice)}</span>
                          </>
                        ) : (
                          <span className="text-gray-900 font-bold text-xl">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                        className="w-11 h-11 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Stock indicator */}
                    {(product.stock === 0 || product.stock < 5) && (
                      <div className={`text-xs mt-3 font-medium ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Collections Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 md:mt-16">
              <Link 
                href="/collections/mens" 
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 text-base font-bold rounded-full text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                View Full Men's Collection
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/collections" 
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-base font-bold rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                View All Collections 
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}