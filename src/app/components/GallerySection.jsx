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
      title: "Casual Collection",
      category: "SUMMER ESSENTIALS"
    },
    {
      id: 2,
      image: "/2.jpg",
      alt: "Fashion model in patterned outfit",
      title: "Pattern Series",
      category: "NEW ARRIVALS"
    },
    {
      id: 3,
      image: "/3.jpg",
      alt: "Fashion model in red coat",
      title: "Statement Pieces",
      category: "AUTUMN COLLECTION"
    },
    {
      id: 4,
      image: "/4.jpg",
      alt: "Fashion model in denim jacket",
      title: "Urban Classics",
      category: "SIGNATURE STYLE"
    },
  ];

  return (
    <div className="relative w-full">
      {/* Gallery Grid */}
      <div className="w-full -mt-2">
        <div className="max-w-7xl mx-auto px-6">
          {/* Responsive grid - 2 columns on mobile, 4 on larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="aspect-square overflow-hidden rounded-2xl relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ 
                    scale: hoveredIndex === index ? 1.05 : 1
                  }}
                  transition={{ duration: 0.4 }}
                  className="h-full w-full"
                >
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Hover Text Overlay */}
                <motion.div
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs text-emerald-300 uppercase tracking-widest mb-2 font-light">
                    {item.category}
                  </span>
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-thin mb-3">
                    {item.title}
                  </h3>
                  <div className="w-8 h-px bg-emerald-300/50 mb-3"></div>
                  <button className="text-white text-xs uppercase tracking-wider hover:text-emerald-200 border-b border-transparent hover:border-emerald-200 pb-px transition-all duration-300">
                    View Collection
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}