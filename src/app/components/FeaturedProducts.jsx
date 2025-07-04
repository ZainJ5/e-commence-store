'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PremiumCarousel() {
  const products = [
    { 
      id: 1, 
      src: '/f-1.jpg',
      title: "Cashmere Knit Sweater",
      price: "₨ 138,600",
      collection: "Fall Collection" 
    },
    { 
      id: 2, 
      src: '/f-2.jpg',
      title: "Tailored Wool Coat",
      price: "₨ 361,200",
      collection: "Winter Essentials" 
    },
    { 
      id: 3, 
      src: '/f-3.jpg',
      title: "Silk Pleated Dress",
      price: "₨ 249,200",
      collection: "Evening Wear" 
    },
    { 
      id: 4, 
      src: '/f-4.jpg',
      title: "Structured Blazer",
      price: "₨ 222,600",
      collection: "Business Collection" 
    },
    { 
      id: 5, 
      src: '/f-5.jpg',
      title: "Leather Statement Jacket",
      price: "₨ 501,200",
      collection: "Signature Series" 
    },
    { 
      id: 6, 
      src: '/f-6.jpg',
      title: "Draped Evening Gown",
      price: "₨ 418,600",
      collection: "Exclusive Line" 
    },
    { 
      id: 7, 
      src: '/f-7.jpg',
      title: "Linen Summer Ensemble",
      price: "₨ 250,600",
      collection: "Resort Collection" 
    },
  ];
  
  const [activeIndex, setActiveIndex] = useState(3);
  const [autoplay, setAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for previous, 1 for next, 0 for initial
  const timerRef = useRef(null);
  
  const nextSlide = () => {
    if (isTransitioning) return;
    setDirection(1);
    setIsTransitioning(true);
    setActiveIndex(prev => (prev + 1) % products.length);
    setTimeout(() => setIsTransitioning(false), 700);
  };
  
  const prevSlide = () => {
    if (isTransitioning) return;
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
  
  // Autoplay with smooth restart on interaction
  useEffect(() => {
    if (!autoplay || isHovered) {
      clearTimeout(timerRef.current);
      return;
    }
    
    timerRef.current = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timerRef.current);
  }, [autoplay, isHovered, activeIndex]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4" 
         style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: 'rgb(240, 230, 210)' }}>
      <div className="relative w-full max-w-7xl">
        {/* Navigation buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-emerald-100 flex items-center justify-center text-emerald-800 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-500 ease-out group"
          aria-label="Previous product"
          disabled={isTransitioning}
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
          <span className="sr-only">Previous</span>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-emerald-100 flex items-center justify-center text-emerald-800 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-500 ease-out group"
          aria-label="Next product"
          disabled={isTransitioning}
        >
          <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          <span className="sr-only">Next</span>
        </button>
        
        {/* Carousel container - maintaining full height across all devices */}
        <motion.div 
          className="relative h-[700px] overflow-hidden rounded-3xl"
          style={{ background: 'linear-gradient(to bottom, rgb(240, 230, 210), rgb(220, 210, 190))' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Added transition animation for carousel background */}
          <motion.div
            className="absolute inset-0"
            key={`bg-${activeIndex}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ 
              backgroundImage: `radial-gradient(circle at ${50 + direction * 10}% 50%, rgba(240,230,210,0.2), rgba(220,210,190,0.4))`,
            }}
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
              
              // Calculate positioning - Adjust for responsive without changing height
              let translateX = 0;
              let translateZ = 0;
              let scale = 1;
              let opacity = 1;
              let blur = 0;
              
              // Adjust positioning based on screen width
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
              const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
              
              if (position === 0) {
                // Center image
                translateX = 0;
                translateZ = 0;
                scale = 1;
                opacity = 1;
                blur = 0;
              } else if (position === 1) {
                // Right side - adjust position for smaller screens
                translateX = isMobile ? 260 : isTablet ? 300 : 350;
                translateZ = -180;
                scale = isMobile ? 0.85 : 0.8;
                opacity = 0.6;
                blur = 1;
              } else if (position === products.length - 1) {
                // Left side - adjust position for smaller screens
                translateX = isMobile ? -260 : isTablet ? -300 : -350;
                translateZ = -180;
                scale = isMobile ? 0.85 : 0.8;
                opacity = 0.6;
                blur = 1;
              } else if (position === 2) {
                // Far right - move further or hide on mobile
                translateX = isMobile ? 450 : isTablet ? 520 : 600;
                translateZ = -300;
                scale = isMobile ? 0.7 : 0.6;
                opacity = isMobile ? 0.15 : 0.3;
                blur = 2;
              } else if (position === products.length - 2) {
                // Far left - move further or hide on mobile
                translateX = isMobile ? -450 : isTablet ? -520 : -600;
                translateZ = -300;
                scale = isMobile ? 0.7 : 0.6;
                opacity = isMobile ? 0.15 : 0.3;
                blur = 2;
              } else {
                // Hidden images
                translateX = position > products.length / 2 ? -800 : 800;
                translateZ = -400;
                scale = 0.4;
                opacity = 0;
                blur = 3;
              }
              
              return (
                <motion.div
                  key={product.id}
                  className="absolute w-[90%] sm:w-80 md:w-88 lg:w-96 h-[540px] cursor-pointer transform-gpu"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: isActive ? 20 : 10 - Math.abs(position),
                    maxWidth: isMobile ? "260px" : isTablet ? "300px" : "384px", // Prevent cards from being too wide on mobile
                  }}
                  onClick={() => goToSlide(index)}
                  whileHover={isActive ? { scale: 1.02 } : {}}
                  transition={{
                    duration: 0.7,
                    ease: [0.23, 1, 0.32, 1], // Custom cubic bezier for premium feel
                  }}
                  // Added animation for smoother transitions when changing slides
                  animate={{
                    x: translateX,
                    z: translateZ,
                    scale,
                    opacity,
                    filter: `blur(${blur}px)`,
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_15px_50px_-15px_rgba(0,0,0,0.2)]">
                    {/* Image container with aspect ratio */}
                    <div className="relative w-full h-full">
                      <img
                        src={product.src}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading={isActive ? "eager" : "lazy"}
                      />
                      
                      {/* Gradient overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-transparent to-transparent opacity-80" />
                      
                      {/* Product info - only show on active slide with improved layout */}
                      {isActive && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          key={`info-${product.id}`}
                        >
                          <div className="text-xs sm:text-sm font-light tracking-wider uppercase mb-1 text-white/80 line-clamp-1">
                            {product.collection}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold tracking-wide mb-2 line-clamp-2">{product.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                            <motion.p 
                              className="text-lg sm:text-xl"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.4 }}
                            >
                              {product.price}
                            </motion.p>
                            <div className="flex space-x-2 sm:space-x-4">
                              <motion.button 
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 backdrop-blur-md flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add to wishlist logic
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Heart size={isMobile ? 14 : 16} className="text-white" />
                              </motion.button>
                              <motion.button 
                                className="py-1.5 sm:py-2 px-4 sm:px-6 rounded-full bg-white text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-center hover:bg-emerald-50 transition-all duration-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowQuickView(true);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                              >
                                <span>View Details</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Overlay for non-active images */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/30 transition-opacity duration-500" />
                      )}
                      
                      {/* Active image styling */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl ring-1 ring-emerald-400/40 ring-offset-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
      </div>
      
      {/* Quick view modal - improved for mobile */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-emerald-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickView(false)}
          >
            <motion.div 
              className="bg-[rgb(240,230,210)] rounded-xl p-4 sm:p-6 max-w-5xl w-full max-h-[90vh] overflow-auto flex flex-col md:flex-row"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] bg-emerald-50">
                  <motion.img 
                    src={products[activeIndex].src} 
                    alt={products[activeIndex].title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0.8, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 md:pl-6 lg:pl-10 pt-6 md:pt-0 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-xs uppercase tracking-widest text-emerald-700 mb-2">
                    {products[activeIndex].collection}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-emerald-900">{products[activeIndex].title}</h2>
                  <div className="text-xl md:text-2xl mb-6 text-emerald-800">{products[activeIndex].price}</div>
                </motion.div>
                
                <motion.div 
                  className="mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-emerald-800">Description</h3>
                  <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                    Crafted from the finest materials and designed with meticulous attention to detail. 
                    This piece embodies the essence of luxury and timeless elegance that defines our brand.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="mb-6 sm:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-3 text-emerald-800">Size</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {["XS", "S", "M", "L", "XL"].map((size, i) => (
                      <motion.button 
                        key={size} 
                        className="w-10 h-10 sm:w-12 sm:h-12 border border-emerald-300 rounded-full flex items-center justify-center hover:border-emerald-700 transition-all text-emerald-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="mt-auto space-y-3 sm:space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.button 
                    className="w-full py-3 sm:py-4 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </motion.button>
                  
                  <motion.button 
                    className="w-full py-3 sm:py-4 border border-emerald-300 rounded-full hover:border-emerald-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base font-bold text-emerald-800"
                    whileHover={{ scale: 1.02, borderColor: "rgb(16, 81, 64)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={18} />
                    <span>Save to Wishlist</span>
                  </motion.button>
                </motion.div>
                
                <motion.button 
                  className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-all text-emerald-800"
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