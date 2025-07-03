'use client';
import { useState } from 'react';

export default function LatestArrivalsSection() {
  // Set initial state to null so no button is active by default
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = ['Shirts', 'Shorts', 'Jackets', 'Hoodies', 'Trousers'];
  
  // Mid-range devices show 4 categories
  const midRangeCategories = ['Shirts', 'Shorts', 'Jackets', 'Hoodies'];
  
  // Small devices show 3 categories
  const smallCategories = ['Shirts', 'Jackets', 'Trousers'];

  return (
    <section className="relative w-full md:w-[98%] overflow-hidden rounded-l-none sm:rounded-l-3xl ml-0 sm:ml-auto">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-top z-0 rounded-l-none sm:rounded-l-3xl"
        style={{ backgroundImage: "url('/latest-arrival-image.jpg')" }}
      ></div>

      {/* Enhanced Grain Effect */}
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-overlay rounded-l-none sm:rounded-l-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      {/* Dark Overlay for text visibility */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-[40vh] xs:min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh] w-full px-4 sm:px-6 py-6 sm:py-10 md:py-16">
        {/* Heading */}
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-10 sm:mb-14 text-center drop-shadow-2xl">
          Latest Arrivals
        </h2>

        {/* Small devices (mobile) */}
        <div className="w-full sm:hidden flex justify-center gap-6">
          {smallCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-base font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCategory === category
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mid-range devices */}
        <div className="w-full hidden sm:flex md:hidden justify-center gap-8">
          {midRangeCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCategory === category
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex justify-center gap-12 lg:gap-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xl lg:text-2xl font-serif tracking-wide transition-all duration-300 relative pb-1 ${
                activeCategory === category
                  ? 'text-white font-medium after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-white'
                  : 'text-white/90 hover:text-white hover:after:content-[""] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-white/60'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}