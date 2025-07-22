'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,_rgba(255,255,255,0.05)_0%,_transparent_50%)]"></div>
      </div>
      
      <div className="absolute top-20 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gray-600 to-transparent opacity-30"></div>
      <div className="absolute bottom-32 right-1/3 w-px h-24 bg-gradient-to-b from-transparent via-gray-600 to-transparent opacity-30"></div>
      
      <div className="relative z-10 pb-10 pt-16 px-8">
        <div className="container mx-auto max-w-8xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-24">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl mb-8 font-light tracking-[0.05em] text-white font-serif">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    ShahBazar
                  </span>
                </h2>
                
                <div className="w-16 h-px bg-gradient-to-r from-gray-400 to-transparent mb-8"></div>
                
                <p className="text-base leading-relaxed mb-14 max-w-md text-gray-300 font-light tracking-wide">
                  Crafting exceptional shopping experiences with timeless elegance and modern innovation. Where luxury meets accessibility.
                </p>
                
                <div className="flex gap-5">
                  {[
                    { name: 'facebook', href: 'https://facebook.com' },
                    { name: 'twitter', href: 'https://twitter.com' },
                    { name: 'instagram', href: 'https://instagram.com' },
                  ].map((platform, index) => (
                    <motion.a 
                      key={platform.name}
                      href={platform.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform.name}
                      className="group relative w-14 h-14 rounded-full border border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-500 hover:border-gray-400 flex items-center justify-center"
                      whileHover={{ y: -4, scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="text-gray-300 group-hover:text-white transition-colors duration-500">
                        <SocialIcon platform={platform.name} />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <h3 className="text-sm uppercase mb-10 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-gray-400 to-gray-600"></div>
                  Shop
                </h3>
                <ul className="space-y-6">
                  {['Men', 'Women', 'Accessories', 'New Arrivals'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-white transition-all duration-400 text-base tracking-wide hover:translate-x-2 inline-block text-gray-400 font-light"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <h3 className="text-sm uppercase tracking-[0.3em] mb-10 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-gray-400 to-gray-600"></div>
                  Company
                </h3>
                <ul className="space-y-6">
                  {['About', 'Careers', 'Press', 'Sustainability'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-white transition-all duration-400 text-base tracking-wide hover:translate-x-2 inline-block text-gray-400 font-light"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <h3 className="text-sm uppercase tracking-[0.3em] mb-10 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-px bg-gradient-to-r from-gray-400 to-gray-600"></div>
                  Support
                </h3>
                <ul className="space-y-6">
                  {['FAQ', 'Shipping', 'Returns', 'Contact'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-white transition-all duration-400 text-base tracking-wide hover:translate-x-2 inline-block text-gray-400 font-light"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
          
          {/* Premium Divider */}
          <motion.div 
            className="mt-28 pt-12 border-t border-gray-700/50"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-sm tracking-wide text-gray-300 font-light">
                © 2025 ShahBazar. All rights reserved.
              </div>
              
              <div className="flex gap-16 text-sm">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="hover:text-white transition-all duration-400 tracking-wide text-gray-300 font-light relative group"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {item}
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-white to-transparent group-hover:w-full transition-all duration-400"></div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <motion.div 
              className="mt-16 pt-12 border-t border-gray-800/50 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              </div>
              
              <div className="text-base text-gray-400 font-light tracking-wide">
                Designed and developed by{' '}
                <motion.a 
                  href="https://www.zettabytesolutions.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 transition-all duration-400 font-medium relative group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  ZettaByte Solutions
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-white to-transparent group-hover:w-full transition-all duration-400"></div>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute top-32 left-12 w-40 h-40 border border-gray-700/30 rounded-full opacity-40"></div>
      <div className="absolute bottom-24 right-20 w-56 h-56 border border-gray-700/20 rounded-full opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-20 h-20 border border-gray-700/25 rounded-full opacity-20"></div>
      
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl opacity-50"></div>
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/3 rounded-full blur-xl opacity-40"></div>
    </footer>
  );
}

function SocialIcon({ platform }) {
  const iconSize = 22;
  
  switch (platform) {
    case 'facebook':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    default:
      return null;
  }
}