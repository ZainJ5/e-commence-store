'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function GallerySection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const galleryItems = [
    {
      id: 1,
      image: "/1.jpg",
      alt: "Men's luxury fashion collection",
      title: "Men's Collection",
      category: "GENTLEMEN'S COUTURE",
      description: "Refined tailoring with impeccable attention to detail"
    },
    {
      id: 2,
      image: "/2.jpg", 
      alt: "Women's luxury fashion collection",
      title: "Women's Collection",
      category: "LADIES' HAUTE COUTURE",
      description: "Sophisticated designs that celebrate feminine grace"
    },
    {
      id: 3,
      image: "/3.jpg",
      alt: "Customized luxury fashion pieces",
      title: "Customized",
      category: "BESPOKE ATELIER",
      description: "Personalized creations crafted to your vision"
    }
  ];

  return (
    <div className="relative w-full bg-gradient-to-b from-[rgb(240,230,210)] via-[rgb(245,235,215)] to-[rgb(250,240,220)] py-24 lg:py-32">
      {/* Luxury Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.5em] text-emerald-600 font-light mb-4 block">
              Curated Collections
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-thin text-slate-800 mb-6 tracking-tight leading-none">
              Discover
              <span className="font-extralight italic text-emerald-700 ml-4">Luxury</span>
            </h2>
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full mx-4"></div>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
            </div>
            <p className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
              Each piece tells a story of craftsmanship, elegance, and timeless sophistication
            </p>
          </motion.div>
        </div>
      </div>

      {/* Premium Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Luxury Card Container */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 group-hover:-translate-y-3">
                {/* Premium Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.div
                    animate={{ 
                      scale: hoveredIndex === index ? 1.08 : 1
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <img 
                      src={item.image} 
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  {/* Sophisticated Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Luxury Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-emerald-900/95 via-emerald-800/70 to-emerald-700/30 flex flex-col justify-end p-8"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: hoveredIndex === index ? 0 : 20,
                        opacity: hoveredIndex === index ? 1 : 0
                      }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <span className="text-xs text-emerald-200 uppercase tracking-[0.3em] font-light mb-3 block">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-thin text-white mb-3 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-emerald-100 font-light text-sm leading-relaxed mb-6">
                        {item.description}
                      </p>
                      <motion.button 
                        className="inline-flex items-center text-white text-sm uppercase tracking-wide font-light border-b border-emerald-200/60 pb-1 hover:border-emerald-200 transition-all duration-300 group"
                        whileHover={{ x: 5 }}
                      >
                        Explore Collection
                        <svg className="w-4 h-4 ml-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {/* Premium Corner Accent */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>

                {/* Elegant Content Section */}
                <div className="p-8">
                  <div className="text-center">
                    <span className="text-xs text-emerald-600 uppercase tracking-[0.3em] font-light mb-4 block">
                      {item.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-thin text-slate-800 mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-slate-600 font-light text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                    
                    {/* Ornate Divider */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-8 h-px bg-emerald-300"></div>
                      <div className="w-1 h-1 bg-emerald-400 rounded-full mx-3"></div>
                      <div className="w-8 h-px bg-emerald-300"></div>
                    </div>

                    <motion.button 
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 text-sm uppercase tracking-wider font-light rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all duration-500 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Collection
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Premium Shadow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-100/40 to-emerald-200/30 -z-10 transform translate-y-4 group-hover:translate-y-6 transition-transform duration-700"></div>
              
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 -z-20 transform translate-y-2 group-hover:translate-y-3 transition-transform duration-700 blur-sm"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Call-to-Action */}
      <div className="max-w-4xl mx-auto px-6 mt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-slate-600 font-light mb-8 leading-relaxed">
            Experience the pinnacle of fashion excellence with our exclusive collections
          </p>
          <motion.button 
            className="bg-transparent border-2 border-emerald-600 text-emerald-700 px-12 py-4 text-sm uppercase tracking-wider font-light rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse All Collections
          </motion.button>
        </motion.div>
      </div>

      {/* Elegant Wave Transition */}
      <div className="relative mt-24 lg:mt-32">
        <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
          <svg 
            viewBox="0 0 1440 80" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="elegantWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(6, 78, 59)" />
                <stop offset="50%" stopColor="rgb(16, 81, 64)" />
                <stop offset="100%" stopColor="rgb(4, 46, 35)" />
              </linearGradient>
            </defs>
            <path 
              d="M0,25 C360,45 720,5 1080,25 C1260,35 1350,40 1440,25 L1440,80 L0,80 Z" 
              fill="url(#elegantWaveGradient)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}