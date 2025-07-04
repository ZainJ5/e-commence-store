'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900 opacity-50"></div>
      
      <div className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span style={{ color: 'rgb(240, 230, 210)' }}>Shah</span>
                  <span className="font-bold bg-gradient-to-r from-[rgb(240,230,210)] to-[rgb(220,210,190)] bg-clip-text text-transparent">Bazar</span>
                </h2>
                
                <p className="text-sm leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(240, 230, 210, 0.7)', fontFamily: "'Montserrat', sans-serif" }}>
                  Crafting exceptional shopping experiences with timeless elegance and modern innovation.
                </p>
                
                <div className="flex gap-6">
                  {[
                    { name: 'facebook', href: '#' },
                    { name: 'twitter', href: '#' },
                    { name: 'instagram', href: '#' },
                  ].map((platform, index) => (
                    <motion.a 
                      key={platform.name}
                      href={platform.href} 
                      aria-label={platform.name}
                      className="group relative p-3 rounded-full border border-gray-800 bg-gray-900/50 hover:bg-gray-800/80 transition-all duration-300"
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div style={{ color: 'rgba(240, 230, 210, 0.7)' }} className="group-hover:text-[rgb(240,230,210)] transition-colors duration-300">
                        <SocialIcon platform={platform.name} />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Navigation Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2" 
                    style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(240, 230, 210)' }}>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Shop
                </h3>
                <ul className="space-y-5">
                  {['Men', 'Women', 'Accessories', 'New Arrivals'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-[rgb(240,230,210)] transition-all duration-300 text-sm tracking-wide hover:translate-x-1 inline-block"
                        style={{ color: 'rgba(240, 230, 210, 0.7)', fontFamily: "'Montserrat', sans-serif" }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "tween", duration: 0.2 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(240, 230, 210)' }}>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Company
                </h3>
                <ul className="space-y-5">
                  {['About', 'Careers', 'Press', 'Sustainability'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-[rgb(240,230,210)] transition-all duration-300 text-sm tracking-wide hover:translate-x-1 inline-block"
                        style={{ color: 'rgba(240, 230, 210, 0.7)', fontFamily: "'Montserrat', sans-serif" }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "tween", duration: 0.2 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xs uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-2"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(240, 230, 210)' }}>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Support
                </h3>
                <ul className="space-y-5">
                  {['FAQ', 'Shipping', 'Returns', 'Contact'].map((item, index) => (
                    <li key={item}>
                      <motion.a 
                        href="#" 
                        className="hover:text-[rgb(240,230,210)] transition-all duration-300 text-sm tracking-wide hover:translate-x-1 inline-block"
                        style={{ color: 'rgba(240, 230, 210, 0.7)', fontFamily: "'Montserrat', sans-serif" }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "tween", duration: 0.2 }}
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
          
          {/* Bottom Section - Divider + Copyright */}
          <motion.div 
            className="mt-20 pt-8 border-t border-gray-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xs tracking-wide" style={{ color: 'rgba(240, 230, 210, 0.5)', fontFamily: "'Montserrat', sans-serif" }}>
                © 2025 ShahBazar. All rights reserved.
              </div>
              
              <div className="flex gap-8 text-xs">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="hover:text-[rgb(240,230,210)] transition-colors duration-300 tracking-wide"
                    style={{ color: 'rgba(240, 230, 210, 0.5)', fontFamily: "'Montserrat', sans-serif" }}
                    whileHover={{ y: -1 }}
                    transition={{ type: "tween", duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ platform }) {
  const iconSize = 20;
  
  switch (platform) {
    case 'facebook':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
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
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      );
    default:
      return null;
  }
}