"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';
import { X } from 'lucide-react';

// Create context for banner visibility
const BannerContext = createContext();

export const useBannerVisibility = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error('useBannerVisibility must be used within a BannerProvider');
  }
  return context;
};

export const BannerProvider = ({ children }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BannerContext.Provider value={{ 
      isBannerVisible, 
      setIsBannerVisible, 
      isScrolled,
      showBanner: isBannerVisible && !isScrolled // Banner only shows when not scrolled
    }}>
      {children}
    </BannerContext.Provider>
  );
};

const TopDiscountBanner = () => {
  const { showBanner, setIsBannerVisible } = useBannerVisibility();
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

  const headings = [
    "🔥 50% OFF Summer Collection - Limited Time Only!",
    "✨ Free Shipping on Orders Over $75 - Shop Now!",
    "🎉 New Arrivals: Trendy Styles Just Dropped!"
  ];

  useEffect(() => {
    if (!showBanner) return;

    const interval = setInterval(() => {
      setCurrentHeadingIndex((prevIndex) => 
        (prevIndex + 1) % headings.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [showBanner, headings.length]);

  if (!showBanner) return null;

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBannerVisible(false);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-[9999] bg-black text-white text-center overflow-hidden" style={{ height: '48px' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50"></div>
      
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex-1 transition-all duration-500 ease-in-out">
          <p className="text-sm md:text-base font-medium tracking-wide">
            {headings[currentHeadingIndex]}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="ml-4 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200 group flex-shrink-0"
          aria-label="Close banner"
          type="button"
        >
          <X 
            size={18} 
            className="text-gray-300 group-hover:text-white transition-colors duration-200" 
          />
        </button>
      </div>

      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {headings.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentHeadingIndex 
                ? 'bg-white' 
                : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopDiscountBanner;