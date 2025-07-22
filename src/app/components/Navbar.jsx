'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../stores/cartStores';
import Cart from './Cart';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCartStore();

  const navigationItems = [
    { label: 'Collections', path: '/collections' },
    { label: 'Men', path: '/collections/men' },
    { label: 'Women', path: '/collections/women' },
    { label: 'Kids', path: '/collections/kids' },
    { label: 'Customize', path: '/collections/customizable' }
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } },
  };

  const mobileMenuVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } },
  };

  return (
    <>
      <nav className={`w-full z-50 pt-5 pb-5 border-b transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between text-black items-center">
            <div className="w-1/3 flex justify-start items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-black mr-6 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="w-7 h-7" />
              </button>
              
              <div className="hidden lg:flex items-center space-x-6">
                <a 
                  href="https://www.facebook.com/share/16sn62HPUK/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black transition-all duration-300 hover:text-gray-600 cursor-pointer transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <div className="h-6 w-px bg-gray-300"></div>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black transition-all duration-300 hover:text-gray-600 cursor-pointer transform hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="w-1/3 flex justify-center">
              <Link href="/" className="group">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
                  className="font-['Playfair_Display'] text-black text-2xl xs:text-3xl sm:text-4xl font-bold tracking-widest relative"
                >
                  <span className="bg-gradient-to-r from-black to-black bg-[length:0%_2px] bg-no-repeat bg-bottom pb-2 transition-all duration-700">
                    ShahBazar
                  </span>
                </motion.span>
              </Link>
            </div>
            
            <div className="w-1/3 flex justify-end items-center space-x-4 sm:space-x-8">
              <button 
                className="text-black hover:text-gray-600 transition-all duration-300 transform hover:scale-110 cursor-pointer" 
                aria-label="Search"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-black hover:text-gray-600 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                {mounted && totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs sm:text-sm w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center mt-4">
            <ul className="flex items-center space-x-8 xl:space-x-16">
              {navigationItems.map((item, index) => (
                <motion.li 
                  key={item.label}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.15 }}
                >
                  <Link
                    href={item.path}
                    className="text-sm uppercase tracking-widest font-medium text-black hover:text-gray-500 transition-all duration-500 relative group cursor-pointer"
                  >
                    <span className="relative inline-block overflow-hidden py-2">
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute left-0 bottom-0 h-[2px] w-full bg-black origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="w-12">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-black hover:text-gray-600 transition-all duration-300 cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 sm:w-8 sm:h-8" />
                  </button>
                </div>
                <div className="flex-1 text-center">
                  <span className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold tracking-widest text-black">
                    ShahBazar
                  </span>
                </div>
                <div className="w-12">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 text-black cursor-pointer" />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto bg-gray-50">
                <ul className="divide-y divide-gray-200">
                  {navigationItems.map((item, index) => (
                    <motion.li 
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex justify-between items-center py-4 sm:py-6 px-6 sm:px-8 hover:bg-gray-100 transition-all duration-300 cursor-pointer group"
                      >
                        <span className="text-lg sm:text-xl font-medium tracking-wide text-black">{item.label}</span>
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="text-black transform transition-transform duration-300 group-hover:translate-x-2"
                        >
                          <path d="M9 18L15 12L9 6" />
                        </svg>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto p-6 sm:p-8 border-t border-gray-200 flex justify-center space-x-8 sm:space-x-10 items-center bg-white">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black hover:text-gray-600 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <div className="h-8 w-px bg-gray-300"></div>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-black hover:text-gray-600 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;