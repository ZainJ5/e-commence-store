"use client"



import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TopDiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

  const headings = [
    "🔥 50% OFF Summer Collection - Limited Time Only!",
    "✨ Free Shipping on Orders Over $75 - Shop Now!",
    "🎉 New Arrivals: Trendy Styles Just Dropped!"
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentHeadingIndex((prevIndex) => 
        (prevIndex + 1) % headings.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, headings.length]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative bg-black text-white py-2 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-[40px]">
        <div className="flex-1 transition-all duration-500 ease-in-out">
          <p className="text-sm md:text-base font-medium tracking-wide">
            {headings[currentHeadingIndex]}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="ml-4 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200 group"
          aria-label="Close banner"
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