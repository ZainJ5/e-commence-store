'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const mobileMenuVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  return (
    <>
<nav className="w-full z-50 py-4 border-b border-gray-300 bg-[rgb(236,226,206)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="w-1/3 flex justify-start items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-black mr-4"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="hidden lg:flex items-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300">
                  <svg className="w-5 h-5" fill="black" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <div className="h-4 w-px bg-gray-400 mx-4"></div>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300">
                  <svg className="w-5 h-5" fill="black" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="w-1/3 flex justify-center">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#000',
                    fontSize: 'clamp(22px, 5vw, 30px)',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    display: 'inline-block',
                    textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
                >
                  ShahBazar
                </motion.span>
              </Link>
            </div>
            
            <div className="w-1/3 flex justify-end items-center space-x-6">
              <Search className="w-5 h-5 cursor-pointer text-black" />
              <ShoppingCart className="w-5 h-5 cursor-pointer text-black" />
            </div>
          </div>
          
          <div className="hidden lg:flex justify-center mt-4">
            <ul className="flex items-center space-x-10">
              {['Men', 'Women', 'Kids', 'Customize'].map((label) => (
                <li key={label}>
                  <Link
                    href={`/${label.toLowerCase()}`}
                    className="uppercase text-sm font-medium text-black hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[rgb(240,230,210)]"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="w-8">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 text-black"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 text-center">
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: '#000',
                      fontWeight: 900,
                      fontSize: '22px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    ShahBazar
                  </span>
                </div>
                <div className="w-8">
                  <Search className="w-5 h-5 text-black" />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <ul className="divide-y divide-gray-100">
                  {['Men', 'Women', 'Kids', 'Customize'].map((label) => (
                    <li key={label}>
                      <Link
                        href={`/${label.toLowerCase()}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex justify-between items-center p-4 text-black"
                      >
                        <span>{label}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto p-6 border-t flex justify-center space-x-4 items-center">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300">
                  <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <div className="h-4 w-px bg-gray-400"></div>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-colors duration-300">
                  <svg className="w-6 h-6" fill="black" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;