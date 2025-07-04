'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GallerySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const galleryItems = [
    {
      id: 1,
      image: "/1.jpg",
      alt: "Fashion model in casual wear",
      caption: "SUMMER COLLECTION",
    },
    {
      id: 2,
      image: "/2.jpg",
      alt: "Fashion model in patterned outfit",
      caption: "EXCLUSIVE DESIGNS",
    },
    {
      id: 3,
      image: "/3.jpg",
      alt: "Fashion model in red coat",
      caption: "AUTUMN ESSENTIALS",
    },
    {
      id: 4,
      image: "/4.jpg",
      alt: "Fashion model in denim jacket",
      caption: "SIGNATURE PIECES",
    },
  ];

  return (
    <section className="relative w-full bg-[rgb(240,230,210)] py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-thin mb-4 tracking-tight text-emerald-900">
            <span className="font-extralight italic">Curated</span> Collection
          </h2>
          <div className="h-px w-24 bg-emerald-800/30 mx-auto mb-6"></div>
          <p className="text-lg text-emerald-800/80 font-light">
            Discover our hand-selected pieces that define modern sophistication
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {galleryItems.map((item, index) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative aspect-[3/4] sm:aspect-square md:aspect-[3/4] lg:aspect-square overflow-hidden">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: hoveredIndex === index ? 1.05 : 1,
                    filter: hoveredIndex === index ? 'brightness(0.8)' : 'brightness(1)'
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0,
                    y: hoveredIndex === index ? 0 : 20
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-6 flex flex-col items-center justify-center"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-2 font-light">
                    {item.caption}
                  </p>
                  <div className="h-px w-12 bg-emerald-300/50 mb-3"></div>
                  <button className="text-white text-sm uppercase tracking-wider font-light hover:text-emerald-200 transition-colors">
                    View Details
                  </button>
                </motion.div>
              </div>
              
              {/* Mobile caption (always visible on small devices) */}
              <div className="block sm:hidden text-center py-3">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-800 font-light">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 text-center">
          <button className="bg-emerald-900/90 hover:bg-emerald-800 text-[rgb(240,230,210)] px-8 py-3 text-sm uppercase tracking-widest font-light transition-all duration-300 border border-emerald-700">
            View All Collections
          </button>
        </div>
      </div>
    </section>
  );
}