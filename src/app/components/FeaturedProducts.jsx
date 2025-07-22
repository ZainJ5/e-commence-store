'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStores';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

export default function PremiumCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef(null);
  const router = useRouter();
  
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  
  const { addItem: addToCart, getItem: getCartItem } = useCartStore();
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/featured?limit=7');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  useEffect(() => {
    if (products.length > 0) {
      setActiveIndex(0);
    }
  }, [products.length]);
  
  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };
  
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.discountedPrice || product.originalPrice,
      image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
      quantity: 1,
      customizable: product.customizable || false
    };
    
    addToCart(cartItem);
    toast.success('Added to cart');
  };
  
  const getPrice = (product) => {
    if (product.discountedPrice && product.discountedPrice < product.originalPrice) {
      return product.discountedPrice;
    }
    return product.originalPrice;
  };
  
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Price unavailable';
    return `₨ ${Number(price).toLocaleString()}`;
  };
  
  const getProductImage = (product) => {
    if (product.coverImage) return product.coverImage;
    if (product.images && product.images.length > 0) return product.images[0];
    return '/placeholder-product.jpg';
  };
  
  const nextSlide = () => {
    if (isTransitioning || products.length === 0) return;
    setDirection(1);
    setIsTransitioning(true);
    setActiveIndex(prev => (prev + 1) % products.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };
  
  const prevSlide = () => {
    if (isTransitioning || products.length === 0) return;
    setDirection(-1);
    setIsTransitioning(true);
    setActiveIndex(prev => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };
  
  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };
  
  const navigateToProduct = (e, productId) => {
    e.stopPropagation();
    router.push(`/products/${productId}`);
  };
  
  useEffect(() => {
    if (!autoplay || isHovered || products.length === 0) {
      clearTimeout(timerRef.current);
      return;
    }
    
    timerRef.current = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timerRef.current);
  }, [autoplay, isHovered, activeIndex, products.length]);

  if (loading) {
    return (
      <div className="w-full pt-12 lg:pt-16 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="w-64 h-10 bg-gray-200 rounded mb-4 mx-auto lg:mx-0"></div>
            <div className="w-48 h-5 bg-gray-100 rounded mb-12 mx-auto lg:mx-0"></div>
            
            <div className="flex justify-center items-center h-[600px]">
              <div className="relative">
                <div className="w-80 h-[500px] bg-gray-200 rounded-xl"></div>
                <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-60 h-[400px] bg-gray-100 rounded-xl opacity-50"></div>
                <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-60 h-[400px] bg-gray-100 rounded-xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-12 lg:pt-16 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-[700px]">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-light mb-2">Unable to Load Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full pt-12 lg:pt-16 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-[700px]">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-light mb-2">No Featured Products Available</h2>
            <p className="text-gray-600 mb-6">Please check back later for our new collection.</p>
            <Link 
              href="/"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all"
            >
              Explore Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-12 lg:pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white">
      <Toaster 
  position="top-center"
  toastOptions={{
    duration: 2000,
    style: {
      background: '#000',
      color: '#fff',
      fontWeight: 400,
      padding: '10px 20px',
      borderRadius: '9999px', 
      fontSize: '0.875rem',
      maxWidth: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    success: {
      icon: (
        <svg 
          className="w-5 h-5 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      ),
    },
  }}
/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-gray-900 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Featured Collection
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-light tracking-wide max-w-xl">
            Discover our carefully curated selection of premium pieces designed with exceptional craftsmanship and timeless elegance.
          </p>
        </div>

        <div className="relative w-full mb-10">
          <button 
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all duration-500 ease-out group focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Previous product"
            disabled={isTransitioning}
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
            <span className="sr-only">Previous</span>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all duration-500 ease-out group focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Next product"
            disabled={isTransitioning}
          >
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            <span className="sr-only">Next</span>
          </button>
          
          <motion.div 
            className="relative h-[660px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-gray-100 to-transparent opacity-50"></div>
            
            <motion.div
              className="absolute inset-0"
              key={`bg-${activeIndex}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`active-product-${activeIndex}`}
                  className="absolute z-30"
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300, 
                    damping: 30,
                    duration: 0.5 
                  }}
                >
                </motion.div>
              </AnimatePresence>
              
              {products.map((product, index) => {
                const position = (index - activeIndex + products.length) % products.length;
                const isActive = position === 0;
                
                let translateX = 0;
                let translateZ = 0;
                let scale = 1;
                let opacity = 1;
                let blur = 0;
                
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
                
                if (position === 0) {
                  translateX = 0;
                  translateZ = 0;
                  scale = 1;
                  opacity = 1;
                  blur = 0;
                } else if (position === 1) {
                  translateX = isMobile ? 260 : isTablet ? 300 : 380;
                  translateZ = -180;
                  scale = isMobile ? 0.85 : 0.78;
                  opacity = 0.6;
                  blur = 1;
                } else if (position === products.length - 1) {
                  translateX = isMobile ? -260 : isTablet ? -300 : -380;
                  translateZ = -180;
                  scale = isMobile ? 0.85 : 0.78;
                  opacity = 0.6;
                  blur = 1;
                } else if (position === 2) {
                  translateX = isMobile ? 450 : isTablet ? 520 : 650;
                  translateZ = -300;
                  scale = isMobile ? 0.7 : 0.58;
                  opacity = isMobile ? 0.15 : 0.3;
                  blur = 2;
                } else if (position === products.length - 2) {
                  translateX = isMobile ? -450 : isTablet ? -520 : -650;
                  translateZ = -300;
                  scale = isMobile ? 0.7 : 0.58;
                  opacity = isMobile ? 0.15 : 0.3;
                  blur = 2;
                } else {
                  translateX = position > products.length / 2 ? -800 : 800;
                  translateZ = -400;
                  scale = 0.4;
                  opacity = 0;
                  blur = 3;
                }
                
                const productImage = getProductImage(product);
                
                const formattedPrice = formatPrice(getPrice(product));
                
                const hasDiscount = product.discountedPrice && product.discountedPrice < product.originalPrice;
                
                const collection = product.category?.name || product.type?.name || "Premium Collection";
                
                const inWishlist = isInWishlist(product._id);
                
                return (
                  <motion.div
                    key={product._id || index}
                    className="absolute w-[90%] sm:w-80 md:w-88 lg:w-96 h-[560px] cursor-pointer transform-gpu"
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                      opacity,
                      filter: `blur(${blur}px)`,
                      zIndex: isActive ? 20 : 10 - Math.abs(position),
                      maxWidth: isMobile ? "280px" : isTablet ? "320px" : "400px", 
                    }}
                    onClick={() => goToSlide(index)}
                    transition={{
                      duration: 0.7,
                      ease: [0.23, 1, 0.32, 1], 
                    }}
                    animate={{
                      x: translateX,
                      z: translateZ,
                      scale,
                      opacity,
                      filter: `blur(${blur}px)`,
                    }}
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] group">
                      <div className="relative w-full h-full bg-gray-100">
                        <img
                          src={productImage}
                          alt={product.name || 'Product image'}
                          className="w-full h-full object-cover object-center transition-transform duration-700"
                          loading={isActive ? "eager" : "lazy"}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
                        
                        {hasDiscount && (
                          <div className="absolute top-5 left-5 bg-white text-black px-3 py-1.5 text-xs font-medium tracking-wider rounded-md shadow-md">
                            {Math.round((1 - product.discountedPrice / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                        
                        <motion.button 
                          className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                            inWishlist 
                              ? 'bg-rose-500 text-white shadow-md' 
                              : 'bg-white/80 backdrop-blur-md text-gray-700 shadow-md hover:bg-white'
                          }`}
                          onClick={(e) => toggleWishlist(e, product)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart 
                            size={18} 
                            fill={inWishlist ? "white" : "transparent"} 
                            className={inWishlist ? "animate-heartbeat" : ""}
                          />
                        </motion.button>
                        
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                          {isActive && (
                            <motion.div 
                              className="space-y-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              key={`info-${product._id || index}`}
                            >
                              <div>
                                <span className="inline-block text-xs sm:text-sm tracking-wider uppercase text-white/70 mb-1.5 font-light">
                                  {collection}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-medium text-white tracking-wide leading-tight mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                  {product.name}
                                </h3>
                                <div className="flex items-end gap-3 mb-4">
                                  <span className="text-xl font-light text-white">
                                    {formattedPrice}
                                  </span>
                                  
                                  {hasDiscount && (
                                    <span className="text-sm text-white/60 line-through mb-0.5 font-light">
                                      ₨ {product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex gap-3">
                                <motion.button 
                                  className="flex-1 py-3 px-5 bg-white text-gray-900 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 text-sm font-medium flex items-center justify-center"
                                  onClick={(e) => navigateToProduct(e, product._id)}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  View Details
                                </motion.button>
                                
                                <motion.button 
                                  className="py-3 px-4 rounded-lg bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-all duration-300 flex items-center justify-center"
                                  onClick={(e) => handleAddToCart(e, product)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ShoppingCart size={18} />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/30 transition-opacity duration-500" />
                        )}
                        
                        {isActive && (
                          <motion.div 
                            className="absolute -bottom-1 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Link
            href="/collections/featured"
            className="inline-flex items-center px-6 py-2 bg-white text-black text-sm font-medium tracking-wide rounded hover:bg-black hover:text-white border transition-all duration-300 group shadow-md"
          >
            View All Collection
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
      
      <AnimatePresence>
        {showQuickView && products.length > 0 && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickView(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col md:flex-row border border-gray-100 shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="md:w-1/2 bg-gray-50">
                <div className="h-[350px] sm:h-[450px] md:h-full">
                  <motion.img 
                    src={getProductImage(products[activeIndex])}
                    alt={products[activeIndex].name || 'Product image'}
                    className="w-full h-full object-cover object-center"
                    initial={{ opacity: 0.8, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 md:max-h-[700px] overflow-y-auto p-6 sm:p-8 md:p-10 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                        {products[activeIndex].category?.name || 
                         products[activeIndex].type?.name || 
                         "Premium Collection"}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-medium mb-3 text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {products[activeIndex].name}
                      </h2>
                    </div>
                    
                    <motion.button 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isInWishlist(products[activeIndex]._id) 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={(e) => toggleWishlist(e, products[activeIndex])}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart 
                        size={18} 
                        fill={isInWishlist(products[activeIndex]._id) ? "white" : "transparent"}
                      />
                    </motion.button>
                  </div>
                  
                  <div className="mb-8">
                    {products[activeIndex].discountedPrice && 
                     products[activeIndex].discountedPrice < products[activeIndex].originalPrice ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-medium text-gray-900">
                          {formatPrice(products[activeIndex].discountedPrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(products[activeIndex].originalPrice)}
                        </span>
                        <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded font-medium">
                          {Math.round((1 - products[activeIndex].discountedPrice / products[activeIndex].originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-medium text-gray-900">
                        {formatPrice(products[activeIndex].originalPrice)}
                      </div>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-sm font-medium uppercase tracking-wide mb-3 text-gray-700">Description</h3>
                  <div className="prose prose-sm text-gray-600">
                    {products[activeIndex].description ? (
                      <p>{products[activeIndex].description}</p>
                    ) : (
                      <p>Crafted from the finest materials and designed with meticulous attention to detail. This piece embodies the essence of luxury and timeless elegance that defines our brand.</p>
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-sm font-medium uppercase tracking-wide mb-3 text-gray-700">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {(products[activeIndex].sizes && Array.isArray(products[activeIndex].sizes) && products[activeIndex].sizes.length > 0) ? 
                      products[activeIndex].sizes.map((size, i) => (
                        <motion.button 
                          key={size} 
                          className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 hover:bg-gray-100 transition-all text-gray-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {size}
                        </motion.button>
                      )) : 
                      ["XS", "S", "M", "L", "XL"].map((size, i) => (
                        <motion.button 
                          key={size} 
                          className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 hover:bg-gray-100 transition-all text-gray-800"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {size}
                        </motion.button>
                      ))
                    }
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-auto space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.button 
                    className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center space-x-3 text-sm font-medium"
                    onClick={(e) => handleAddToCart(e, products[activeIndex])}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full py-4 border border-gray-200 text-gray-800 rounded-xl hover:border-gray-800 transition-all flex items-center justify-center text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (products[activeIndex] && products[activeIndex]._id) {
                        router.push(`/products/${products[activeIndex]._id}`);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Full Details
                  </motion.button>
                </motion.div>
                
                <motion.button 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all text-gray-800"
                  onClick={() => setShowQuickView(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}