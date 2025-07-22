'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const HeroSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const initialHeightSet = useRef(false);
  
  const banners = [
    {
      src: '/banner-1.jpg',
      alt: 'Banner 1',
    },
    {
      src: '/banner-2.jpg',
      alt: 'Banner 2',
    },
    {
      src: '/banner-3.jpg',
      alt: 'Banner 3',
    }
  ];

  useEffect(() => {
    const setVH = () => {
      if (!initialHeightSet.current || window.innerWidth !== window.lastWidth) {
        window.lastWidth = window.innerWidth;
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        initialHeightSet.current = true;
      }
    };

    setVH();
    window.addEventListener('resize', setVH, { passive: true });
    window.addEventListener('orientationchange', setVH, { passive: true });

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToPrevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: 'min(90vh, 800px)',
        minHeight: '400px',
        '--desktop-height': '95vh',
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          .hero-container {
            height: var(--desktop-height) !important;
            min-height: 900px !important;
          }
        }

        /* Maintain aspect ratio for the banners based on 4096x1568 */
        .banner-container {
          aspect-ratio: 4096/1568;
          max-height: 100vh;
        }

        @media (max-aspect-ratio: 4096/1568) {
          .banner-container {
            height: 100%;
            width: auto;
          }
        }
      `}</style>

      <div className="absolute inset-0 w-full h-full hero-container">
        {banners.map((banner, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 h-full transition-opacity duration-1000 ease-in-out banner-container ${
              currentBanner === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover"
              style={{ objectPosition: 'center center' }}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={goToPrevBanner}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 md:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={goToNextBanner}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 md:p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentBanner === index 
                ? 'bg-white w-4' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            onClick={() => setCurrentBanner(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;