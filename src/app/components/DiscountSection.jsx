"use client"

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TopDiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [nextHeadingIndex, setNextHeadingIndex] = useState(1);
  const [isFirstTextActive, setIsFirstTextActive] = useState(true);

  const headings = [
    "Free Shipping on Orders Over 5000Rs",
    "Get 20% Off on Your First Purchase",
    "Summer Collection Now Available"
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setNextHeadingIndex((currentHeadingIndex + 1) % headings.length);
      
      setIsFirstTextActive(!isFirstTextActive);
      
      setTimeout(() => {
        setCurrentHeadingIndex((currentHeadingIndex + 1) % headings.length);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, currentHeadingIndex, isFirstTextActive, headings.length]);

  if (!isVisible) return null;

  return (
    <div className="z-[9999] bg-black text-white text-center relative">
      <div className="relative flex items-center justify-center h-12 px-4">
        <div className="flex-1 overflow-hidden">
          <div className="h-12 flex items-center justify-center relative">
            <p 
              className={`text-sm md:text-base font-medium whitespace-nowrap absolute transition-all duration-500 ${
                isFirstTextActive 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-full'
              }`}
            >
              {headings[currentHeadingIndex]}
            </p>
            
            <p 
              className={`text-sm md:text-base font-medium whitespace-nowrap absolute transition-all duration-500 ${
                !isFirstTextActive 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-full'
              }`}
            >
              {headings[nextHeadingIndex]}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200"
          aria-label="Close banner"
        >
          <X size={18} className="text-gray-300 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TopDiscountBanner;