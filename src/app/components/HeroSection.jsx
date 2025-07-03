'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import GallerySection from './GallerySection';

export default function HeroSection() {
  return (
    <>
    {/* Combined hero section with wave transition */}
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh + 120px)' }}>
      <Navbar />

      {/* Background image for entire section */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/hero-section-mobile.jpg" 
          alt="Fashion Store Hero Background"
          className="w-full h-full object-cover md:hidden"
        />
        <img 
          src="/hero-section-2.jpg" 
          alt="Fashion Store Hero Background"
          className="w-full h-full object-cover hidden md:block"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero content */}
      <div className="relative h-screen flex flex-col justify-center items-center text-center pt-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-6 font-light">
            Couture Collection
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-thin leading-[0.9] text-white mb-8 tracking-tight">
            Timeless
            <br />
            <span className="font-extralight italic">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Where sophistication meets artistry
          </p>
          <button className="bg-transparent border border-white/30 text-white px-12 py-4 font-light text-lg tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm">
            Explore Collection
          </button>
        </div>
      </div>

      {/* Wave SVG mask at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] -mb-px">
        <svg 
          viewBox="0 0 1360 120" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
          preserveAspectRatio="none"
        >
          <defs>
            <mask id="waveMask">
              <rect width="1360" height="120" fill="white"/>
              <path d="M0,0 L1360,0 L1360,40 C1020,80 680,100 340,80 C170,70 85,50 0,50 Z" fill="black"/>
            </mask>
          </defs>
          <rect width="1360" height="120" fill="white" mask="url(#waveMask)"/>
        </svg>
      </div>
    </div>

    <GallerySection/>

    <svg viewBox="0 0 1360 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,70 C85,70 170,50 340,40 C680,20 1020,40 1360,80 L1360,120 L0,120 Z" fill="rgb(16, 81, 64)"/>
    </svg>
    </>
  );
}