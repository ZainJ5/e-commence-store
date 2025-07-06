'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import GallerySection from './GallerySection';

export default function HeroSection() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <>
      <div className="relative w-full overflow-hidden" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
        <Navbar />

        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/hero-section-mobile.jpg" 
            alt="Fashion Store Hero Background"
            className="w-full h-full object-cover md:hidden"
            style={{ objectPosition: 'center top' }}
          />
          <img 
            src="/hero-section-2.jpg" 
            alt="Fashion Store Hero Background"
            className="w-full h-full object-cover hidden md:block"
            style={{ objectPosition: 'center top' }}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative w-full h-full flex flex-col justify-center items-center text-center px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 mb-6 font-light">
              Couture Collection
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-thin leading-[0.9] mb-8 tracking-tight" style={{ color: 'rgb(240, 230, 210)' }}>
              Timeless
              <br />
              <span className="font-extralight italic">Elegance</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-light leading-relaxed" style={{ color: 'rgba(240, 230, 210, 0.9)' }}>
              Where sophistication meets artistry
            </p>
            <button className="bg-transparent border border-emerald-400/30 px-12 py-4 font-light text-lg tracking-wider uppercase hover:bg-emerald-700 transition-all duration-500 backdrop-blur-sm" style={{ color: 'rgb(240, 230, 210)' }}>
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      {/* <GallerySection/> */}
    </>
  );
}