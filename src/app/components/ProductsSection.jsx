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
  
  const getAvailableSizes = (product) => {
    if (!product.size || product.size.length === 0) return 'Standard Size';
    return product.size.join(', ');
  };

  const categories = ['All', 'Men\'s', 'Women\'s', 'Accessories'];

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'All') return product.isActive !== false;
    if (activeCategory === 'Men\'s') return product.category?.toLowerCase().includes('men') && product.isActive !== false;
    if (activeCategory === 'Women\'s') return product.category?.toLowerCase().includes('women') && product.isActive !== false;
    if (activeCategory === 'Accessories') return product.category?.toLowerCase().includes('accessories') && product.isActive !== false;
    return product.isActive !== false;
  });

  return (
    <section className="py-16 px-4 sm:px-6 relative" style={{ backgroundColor: 'rgb(240, 230, 210)' }}>
      <div className="absolute top-0 left-0 right-0 h-[30px] -mt-[30px] overflow-hidden">
        <svg 
          viewBox="0 0 1360 30" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <path d="M0,30 C85,25 170,15 340,10 C680,0 1020,15 1360,30 L1360,30 L0,30 Z" fill="rgb(240, 230, 210)"/>
        </svg>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" 
              style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(16, 81, 64)' }}>
            LATEST COLLECTION
          </h2>
          
          {/* Category Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-emerald-700 border border-emerald-700 hover:bg-emerald-50'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => {
                  const container = document.getElementById('products-container');
                  container.scrollLeft -= 300;
                }}
                className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-50 transition-all"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  const container = document.getElementById('products-container');
                  container.scrollLeft += 300;
                }}
                className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center hover:bg-emerald-50 transition-all"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">No products available in this category. Please check back later.</span>
          </div>
        ) : (
          <>
            {/* Horizontal Scrolling Container */}
            <div 
              id="products-container"
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
            >
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="flex-none w-64 sm:w-72 md:w-80 group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* NEW Badge */}
                  {index < 4 && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                      NEW
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                        {calculateDiscount(product.originalPrice, product.discountedPrice)}
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                    >
                      <svg 
                        className={`w-4 h-4 ${wishlist.includes(product._id) ? 'text-emerald-700 fill-current' : 'text-gray-600'}`} 
                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={wishlist.includes(product._id) ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    
                    {/* Quick View Overlay */}
                    <Link 
                      href={`/products/${product._id}`}
                      className="absolute inset-0 bg-emerald-700/0 hover:bg-emerald-700/20 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="bg-emerald-700 text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                        Quick View
                      </span>
                    </Link>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-emerald-900 line-clamp-2" 
                          style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                            <span className="text-emerald-700 font-bold text-lg">{formatPrice(product.discountedPrice)}</span>
                          </>
                        ) : (
                          <span className="text-emerald-800 font-bold text-lg">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                        className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Stock indicator */}
                    {(product.stock === 0 || product.stock < 5) && (
                      <div className={`text-xs mt-2 ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Collections Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/collections/mens" 
                className="inline-flex items-center justify-center px-6 py-3 border border-emerald-700 text-base font-bold rounded-md text-emerald-700 bg-white hover:bg-emerald-50 transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                View Full Men's Collection
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/collections" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-md text-white bg-emerald-700 hover:bg-emerald-800 transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                View All Collections 
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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