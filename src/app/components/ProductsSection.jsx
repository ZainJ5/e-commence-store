'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

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

  return (
    <section className="py-16 px-6 relative" style={{ backgroundColor: 'rgb(240, 230, 210)' }}>
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
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-12">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold" 
                style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(16, 81, 64)' }}>
              Latest Collection
            </h2>
            <p className="mt-2" style={{ color: 'rgb(16, 81, 64, 0.7)' }}>Explore our newest fashion arrivals</p>
          </div>
          <Link 
            href="/collections" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-md text-white bg-emerald-700 hover:bg-emerald-800 transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            View All Collections 
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">No products available at the moment. Please check back later.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.filter(product => product.isActive !== false).map((product) => (
              <div key={product._id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
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
                    <div className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {calculateDiscount(product.originalPrice, product.discountedPrice)}
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                  >
                    <svg 
                      className={`w-5 h-5 ${wishlist.includes(product._id) ? 'text-emerald-700 fill-current' : 'text-gray-800'}`} 
                      fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={wishlist.includes(product._id) ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  
                  {/* Quick View */}
                  <Link 
                    href={`/products/${product._id}`}
                    className="absolute bottom-3 left-3 right-3 bg-emerald-700/85 text-white text-center py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Quick View
                  </Link>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-emerald-900 truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-emerald-800/70 mt-1">{product.category || 'Fashion'} • {getAvailableSizes(product)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {product.discountedPrice ? (
                        <>
                          <span className="text-gray-500 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                          <span className="text-emerald-700 font-bold">{formatPrice(product.discountedPrice)}</span>
                        </>
                      ) : (
                        <span className="text-emerald-800 font-bold">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      aria-label="Add to cart"
                      className="w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
        )}
        
        {products.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex bg-emerald-100 rounded-full p-1">
              <div className="h-2 w-8 bg-emerald-700 rounded-full"></div>
              <div className="h-2 w-2 bg-emerald-200 rounded-full mx-1"></div>
              <div className="h-2 w-2 bg-emerald-200 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="absolute bottom-0 left-0 right-0 h-[30px]">
        <svg viewBox="0 0 1360 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C85,5 170,15 340,20 C680,30 1020,15 1360,0 L1360,30 L0,30 Z" fill="white"/>
        </svg>
      </div> */}
    </section>
  );
}