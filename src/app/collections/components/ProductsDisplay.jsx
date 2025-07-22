import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { ChevronDown, Filter, SortAsc, X, Loader } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const ProductsDisplay = ({ products = [], title = "", description= "", hasMore = false, loadMore = () => {} }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    priceRange: null,
    onSale: false,
  });
  const [sortOption, setSortOption] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const safeProducts = Array.isArray(products) ? products : [];
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          const categoryNames = data.map(cat => 
            typeof cat.name === 'string' ? cat.name : ''
          ).filter(Boolean);
          setCategories(categoryNames);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredProducts(safeProducts);
  }, [safeProducts]);

  const priceRanges = [
    { id: 'price-1', label: 'Under PKR 2,000', min: 0, max: 2000 },
    { id: 'price-2', label: 'PKR 2,000 - 5,000', min: 2000, max: 5000 },
    { id: 'price-3', label: 'PKR 5,000 - 10,000', min: 5000, max: 10000 },
    { id: 'price-4', label: 'Over PKR 10,000', min: 10000, max: Infinity }
  ];

  const notificationVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 }},
    exit: { y: -100, opacity: 0, transition: { duration: 0.3 }}
  };

  const showCartNotification = (text) => {
    setNotificationText(text);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    let result = [...safeProducts];
    
    if (activeFilters.category && activeFilters.category.length > 0) {
      result = result.filter(product => {
        if (!product.category) return false;
        
        // Handle if category is either a string or object with name property
        const productCategory = typeof product.category === 'object' && product.category.name 
          ? product.category.name 
          : String(product.category);
          
        // Case-insensitive match
        return activeFilters.category.some(cat => 
          productCategory.toLowerCase() === cat.toLowerCase()
        );
      });
    }
    
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      result = result.filter(p => {
        const price = p.discountedPrice || p.originalPrice || 0;
        return price >= min && price <= max;
      });
    }
    
    if (activeFilters.onSale) {
      result = result.filter(p => p.discountedPrice && p.discountedPrice < p.originalPrice);
    }
    
    result = sortProducts(result, sortOption);
    
    setFilteredProducts(result);
  }, [safeProducts, activeFilters, sortOption]);

  const sortProducts = (productsToSort, option) => {
    switch (option) {
      case 'price-asc':
        return [...productsToSort].sort((a, b) => 
          (a.discountedPrice || a.originalPrice || 0) - (b.discountedPrice || b.originalPrice || 0)
        );
      case 'price-desc':
        return [...productsToSort].sort((a, b) => 
          (b.discountedPrice || b.originalPrice || 0) - (a.discountedPrice || a.originalPrice || 0)
        );
      case 'newest':
        return [...productsToSort].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case 'featured':
      default:
        return productsToSort;
    }
  };

  const toggleFilter = (type, value) => {
    setActiveFilters(prev => {
      if (type === 'priceRange') {
        return {
          ...prev,
          priceRange: prev.priceRange && prev.priceRange.id === value.id ? null : value
        };
      }
      
      if (type === 'onSale') {
        return { ...prev, onSale: !prev.onSale };
      }
      
      const currentValues = Array.isArray(prev[type]) ? prev[type] : [];
      return {
        ...prev,
        [type]: currentValues.includes(value) 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      priceRange: null,
      onSale: false,
    });
    setSortOption('featured');
  };

  const activeFilterCount = 
    (activeFilters.category ? activeFilters.category.length : 0) + 
    (activeFilters.priceRange ? 1 : 0) + 
    (activeFilters.onSale ? 1 : 0);

  const FilterSection = ({ title, items, activeItems = [], type }) => (
    <div className="mb-8">
      <h3 className="text-sm font-medium tracking-wide uppercase mb-3 border-b pb-2">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <label key={`${type}-${index}-${item}`} className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={Array.isArray(activeItems) && activeItems.includes(item)}
              onChange={() => toggleFilter(type, item)}
              className="w-4 h-4 border-gray-300 rounded text-black focus:ring-transparent"
            />
            <span className="ml-2 text-sm group-hover:text-gray-600 transition-colors">
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      loadMore();
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };
    
    const observer = new IntersectionObserver(handleObserver, options);
    const target = document.getElementById('infinite-scroll-trigger');
    
    if (target) observer.observe(target);
    
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoadingMore]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#000',
            color: '#fff',
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
          }
        }}
      />
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{notificationText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start py-8 sm:py-16 border-b">
          <h1 className="md:text-5xl text-4xl font-light tracking-wider text-black mb-4 font-['serif']">{title}</h1>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light mb-8">
            {description}
          </p>
          
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center text-sm text-gray-700 space-x-1 md:hidden"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              <div className="relative group">
                <button className="flex items-center text-sm text-gray-700 space-x-1">
                  <SortAsc className="w-4 h-4" />
                  <span>Sort</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                <div className="absolute right-0 top-full mt-2 bg-white shadow-lg z-30 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'newest', label: 'Newest First' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortOption(option.value)}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                        sortOption === option.value ? 'font-medium' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-8 py-10">
          <div className="hidden md:block md:col-span-3 lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Filters</h2>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="mb-8">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFilters.onSale === true}
                    onChange={() => toggleFilter('onSale')}
                    className="w-4 h-4 border-gray-300 rounded text-black focus:ring-transparent"
                  />
                  <span className="ml-2 text-sm group-hover:text-gray-600 transition-colors">
                    On Sale
                  </span>
                </label>
              </div>
              
              {categories.length > 0 && (
                <FilterSection 
                  title="Category" 
                  items={categories}
                  activeItems={activeFilters.category || []}
                  type="category"
                />
              )}
              
              <div className="mb-8">
                <h3 className="text-sm font-medium tracking-wide uppercase mb-3 border-b pb-2">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.priceRange && activeFilters.priceRange.id === range.id}
                        onChange={() => toggleFilter('priceRange', range)}
                        className="w-4 h-4 border-gray-300 rounded text-black focus:ring-transparent"
                      />
                      <span className="ml-2 text-sm group-hover:text-gray-600 transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try changing your filters to find products.</p>
                <button 
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-black text-white text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div 
  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-6 sm:gap-y-12"
  layout
>
  {filteredProducts.map((product) => (
    <motion.div 
      key={product._id ? String(product._id) : `product-${Math.random()}`}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ProductCard 
        product={product} 
        showNotification={(text) => showCartNotification(text)}
      />
    </motion.div>
  ))}
</motion.div>
            )}
            
            {hasMore && (
              <div 
                id="infinite-scroll-trigger"
                className="w-full h-10 flex justify-center items-center my-8"
              >
                {isLoadingMore && <Loader className="w-8 h-8 text-black animate-spin" />}
              </div>
            )}
            
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center mt-12 mb-8">
                <p className="text-gray-500">You've reached the end of the collection</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-xl overflow-y-auto"
            >
              <div className="p-5 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                <div className="mb-6">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.onSale === true}
                      onChange={() => toggleFilter('onSale')}
                      className="w-4 h-4 border-gray-300 rounded text-black focus:ring-transparent"
                    />
                    <span className="ml-2 text-sm group-hover:text-gray-600 transition-colors">
                      On Sale
                    </span>
                  </label>
                </div>
                
                {categories.length > 0 && (
                  <FilterSection 
                    title="Category" 
                    items={categories}
                    activeItems={activeFilters.category || []}
                    type="category"
                  />
                )}
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium tracking-wide uppercase mb-3 border-b pb-2">Price</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.id} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.priceRange && activeFilters.priceRange.id === range.id}
                          onChange={() => toggleFilter('priceRange', range)}
                          className="w-4 h-4 border-gray-300 rounded text-black focus:ring-transparent"
                        />
                        <span className="ml-2 text-sm group-hover:text-gray-600 transition-colors">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-5 border-t mt-auto">
                <div className="flex space-x-4">
                  <button
                    onClick={clearAllFilters}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 text-sm"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-3 bg-black text-white text-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsDisplay;