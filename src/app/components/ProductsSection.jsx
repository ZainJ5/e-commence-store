'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const scrollRef = useRef(null);

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

    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    fetchProducts();
  }, []);

  const formatPrice = (price) => `Rs${Number(price).toFixed(2)}`;
  
  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    return `-${Math.round((1 - discounted / original) * 100)}%`;
  };
  
  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };
  
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product._id);
    let newCart;
    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
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
    alert(`Added ${product.name} to cart!`);
  };
  
  const getAvailableSizes = (product) => {
    if (!product.size || product.size.length === 0) return 'Standard Size';
    return product.size.join(', ');
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const filteredProducts = activeCategory === 'all'
    ? products.filter(product => product.isActive !== false)
    : products.filter(product => 
        product.isActive !== false && 
        product.category?.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-[#F8F1E9] to-[#F0E6D2] relative">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h2 className="text-4xl font-extrabold text-[#105140] m-0 p-0 leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Latest Collection
            </h2>
            <p className="text-sm text-[#105140]/70 m-0 mt-1"
               style={{ fontFamily: "'Lora', serif" }}>
              Curated elegance for the modern wardrobe
            </p>
          </div>
          <Link 
            href="/collections"
            className="mt-4 sm:mt-0 px-6 py-2 bg-[#105140] text-white text-sm font-semibold rounded-full hover:bg-[#0C3F32] transition-all duration-300"
            style={{ fontFamily: "'Lora', serif" }}
          >
            View All
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-[#105140] text-white'
                : 'bg-white/80 text-[#105140] hover:bg-[#105140]/10'
            }`}
            style={{ fontFamily: "'Lora', serif" }}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('women')}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeCategory === 'women'
                ? 'bg-[#105140] text-white'
                : 'bg-white/80 text-[#105140] hover:bg-[#105140]/10'
            }`}
            style={{ fontFamily: "'Lora', serif" }}
          >
            Women
          </button>
          <button
            onClick={() => setActiveCategory('men')}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              activeCategory === 'men'
                ? 'bg-[#105140] text-white'
                : 'bg-white/80 text-[#105140] hover:bg-[#105140]/10'
            }`}
            style={{ fontFamily: "'Lora', serif" }}
          >
            Men
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#105140]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <span>{error}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-600 px-4 py-3 rounded-lg">
            <span>No products available in this category.</span>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={scrollLeft}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#105140]/80 text-white p-2 rounded-full hover:bg-[#105140] transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth gap-4 pb-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="flex-none w-60 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-[#105140] text-white text-xs font-semibold px-2 py-1 rounded">
                        {calculateDiscount(product.originalPrice, product.discountedPrice)}
                      </div>
                    )}
                    <button 
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                    >
                      <svg 
                        className={`w-4 h-4 ${wishlist.includes(product._id) ? 'text-[#105140] fill-current' : 'text-gray-600'}`}
                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={wishlist.includes(product._id) ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <Link 
                      href={`/products/${product._id}`}
                      className="absolute bottom-2 left-2 right-2 bg-[#105140]/90 text-white text-center py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm"
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      Quick View
                    </Link>
                  </div>
                  <div className="p-3">
                    <h3 className="text-base font-semibold text-[#105140] truncate"
                        style={{ fontFamily: "'Playfair Display', serif" }}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#105140]/70 mt-0.5"
                       style={{ fontFamily: "'Lora', serif" }}>
                      {product.category || 'Fashion'} • {getAvailableSizes(product)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {product.discountedPrice ? (
                          <>
                            <span className="text-gray-400 line-through text-xs">{formatPrice(product.originalPrice)}</span>
                            <span className="text-[#105140] font-semibold text-sm">{formatPrice(product.discountedPrice)}</span>
                          </>
                        ) : (
                          <span className="text-[#105140] font-semibold text-sm">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                        className="w-8 h-8 rounded-full bg-[#105140] text-white flex items-center justify-center hover:bg-[#0C3F32] transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    {(product.stock === 0 || product.stock < 5) && (
                      <div className={`text-xs mt-1.5 ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={scrollRight}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#105140]/80 text-white p-2 rounded-full hover:bg-[#105140] transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}