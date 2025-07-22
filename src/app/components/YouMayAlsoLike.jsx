'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function YouMayAlsoLike({ currentProductId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?category=${category}&exclude=${currentProductId}&limit=8`);
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const data = await response.json();
        setRelatedProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProductId && category) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category]);

  const formatPrice = (price) => {
    return `Rs ${Number(price).toLocaleString()}.00`;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  return (
    <div className="mt-24 pt-12 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-medium font-['Playfair_Display'] tracking-tight text-gray-900">
            You May Also Like
          </h2>
          
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Previous products"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Next products"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 gap-5 scrollbar-hide scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="min-w-[240px] w-[240px] flex-shrink-0 snap-start">
                  <div className="aspect-[3/4] bg-gray-100 mb-3 animate-pulse rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : relatedProducts.length > 0 ? (
              relatedProducts.map(product => (
                <div key={product._id} className="min-w-[240px] w-[240px] flex-shrink-0 snap-start">
                  <Link href={`/products/${product._id}`} className="block h-full">
                    <motion.div 
                      className="group h-full"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-4 relative">
                        {product.images && product.images[0] ? (
                          <>
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/40 to-transparent">
                          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Quick View
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 px-1">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                          {product.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-900">
                          {product.discountedPrice ? (
                            <span className="flex items-center">
                              <span className="text-gray-900">{formatPrice(product.discountedPrice)}</span>
                              <span className="ml-2 text-xs line-through text-gray-500">
                                {formatPrice(product.originalPrice)}
                              </span>
                            </span>
                          ) : (
                            formatPrice(product.originalPrice)
                          )}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))
            ) : (
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="min-w-[240px] w-[240px] flex-shrink-0 snap-start">
                  <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-1 px-1">
                    <h3 className="text-sm font-medium text-gray-900">Product Name</h3>
                    <p className="text-sm font-medium text-gray-900">Rs 1,200.00</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}