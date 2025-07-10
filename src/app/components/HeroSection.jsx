'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const HeroSection = () => {
  const initialHeightSet = useRef(false);

  useEffect(() => {
    const setVH = () => {
      // Only set the height on initial load and genuine resize events, not during scroll
      if (!initialHeightSet.current || window.innerWidth !== window.lastWidth) {
        window.lastWidth = window.innerWidth;
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        initialHeightSet.current = true;
      }
    };

    setVH();
    
    // Use passive event listeners to improve performance
    window.addEventListener('resize', setVH, { passive: true });
    window.addEventListener('orientationchange', setVH, { passive: true });

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-24 lg:pt-20 xl:pt-16" 
         style={{
           height: 'calc(var(--vh, 1vh) * 100 - 6rem)',
           willChange: 'auto', // Optimization for mobile rendering
         }}
    >
      {/* Image container */}
      <div className="absolute inset-0 w-full h-full">
        {/* Mobile image */}
        <div className="relative w-full h-full md:hidden">
          <Image
            src="/hero-section-mobile.jpg"
            alt="Fashion store elegant clothing collection - mobile view"
            fill
            priority
            sizes="100vw"
            className="object-cover" 
            style={{ objectPosition: 'center top' }}
            quality={95}
          />
        </div>
        
        {/* Desktop image */}
        <div className="relative hidden w-full h-full md:block">
          <Image
            src="/hero-section-2.jpg"
            alt="Fashion store elegant clothing collection - desktop view"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center top' }}
            quality={95}
          />
        </div>
        
        {/* Enhanced overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>
      
      {/* Content container with height adjustments based on screen size */}
      <div className="relative w-full h-full flex flex-col justify-center items-center text-center px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-emerald-300 mb-6 md:mb-8 font-light animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            Couture Collection
          </p>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-thin leading-[0.9] mb-8 md:mb-10 tracking-tight animate-fadeIn" style={{ color: 'rgb(240, 230, 210)', animationDelay: '0.6s' }}>
            Timeless
            <br />
            <span className="font-extralight italic">Elegance</span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 md:mb-12 lg:mb-16 font-light leading-relaxed animate-fadeIn" style={{ color: 'rgba(240, 230, 210, 0.9)', animationDelay: '0.9s' }}>
            Where sophistication meets artistry
          </p>
          
          <div className="animate-fadeIn" style={{ animationDelay: '1.2s' }}>
            <button className="bg-transparent border border-emerald-400/30 px-8 sm:px-12 py-3 sm:py-4 font-light text-base sm:text-lg tracking-wider uppercase hover:bg-emerald-700/30 transition-all duration-500 backdrop-blur-sm" style={{ color: 'rgb(240, 230, 210)' }}>
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;