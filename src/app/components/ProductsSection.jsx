'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const categories = [
    { id: 'all', name: 'Shop All', icon: '' },
    { id: 'men', name: "Men's", icon: '' },
    { id: 'women', name: "Women's", icon: '' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products.filter(product => product.isActive !== false)
    : products.filter(product => product.isActive !== false && product.category === selectedCategory);

  const formatPrice = (price) => {
    return `Rs.${Number(price).toLocaleString()}.00`;
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
    
    // Show success notification
    alert(`Added ${product.name} to cart!`);
  };
  
  const getAvailableSizes = (product) => {
    if (!product.size || product.size.length === 0) return 'Standard Size';
    return product.size.join(', ');
  };

  return (
    <section className="py-16 lg:py-20 bg-[rgb(240,230,210)]">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-black mb-2" 
                style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
              NEW ARRIVALS
            </h2>
            <p className="text-sm text-gray-600 font-light tracking-wide uppercase mb-4">
              Discover our latest collection
            </p>
            
            {/* Category Tabs - Moved to left side below heading */}
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex bg-white/50 rounded-full p-1">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-black text-white shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                    style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Arrows - Always black background */}
          <div className="hidden lg:flex items-center space-x-3 mt-6 lg:mt-0">
            <button 
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                const container = document.querySelector('.products-scroll');
                container?.scrollBy({ left: -300, behavior: 'smooth' });
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors duration-200"
              onClick={() => {
                const container = document.querySelector('.products-scroll');
                container?.scrollBy({ left: 300, behavior: 'smooth' });
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center" role="alert">
            <span className="font-medium">{error}</span>
          </div>
        ) : filteredFilteredProducts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg text-center" role="alert">
            <span className="font-medium">No products available in this category.</span>
          </div>
        ) : (
          <div className="products-scroll overflow-x-auto scrollbar-hide" 
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .products-scroll::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 flex-shrink-0 w-72 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  {/* Image Container - Full width with enhanced UI */}
                  <div className="relative mb-5 cursor-pointer" 
                       onClick={() => window.location.href = `/products/${product._id}`}>
                    
                    <div className="w-full aspect-[4/5] overflow-hidden bg-gray-100 rounded-xl relative">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectFit: 'cover', objectPosition: 'center' }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Image Overlay for Hover Effect */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl"></div>
                    </div>
                    
                    {/* Badges Container */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      {/* New Badge */}
                      {product.isNew && (
                        <div className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          NEW
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                        <div className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ml-auto">
                          {calculateDiscount(product.originalPrice, product.discountedPrice)}
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button - Positioned over image */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg 
                        className={`w-4 h-4 ${wishlist.includes(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info Container - Fixed height for consistency */}
                  <div className="space-y-3 h-32 flex flex-col justify-between">
                    {/* Product Name */}
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200 line-clamp-2 leading-5" 
                          style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Price Section */}
                    <div className="flex items-center space-x-2">
                      {product.discountedPrice ? (
                        <>
                          <span className="text-gray-900 font-bold text-base">{formatPrice(product.discountedPrice)}</span>
                          <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-bold text-base">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    
                    {/* Stock Status */}
                    {(product.stock === 0 || product.stock < 5) && (
                      <div className="text-xs">
                        <span className={`${product.stock === 0 ? 'text-red-600' : 'text-amber-600'} font-medium`}>
                          {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                        </span>
                      </div>
                    )}
                    
                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        product.stock === 0 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                      }`}
                      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* View All Link */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              href="/collections" 
              className="inline-flex items-center text-black border-b border-black pb-1 hover:border-gray-400 transition-colors duration-200 text-sm font-medium"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              View All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}