'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants for nav links
  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeInOut' } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  return (
    <>
      {/* Navbar */}
      <nav className="w-full z-50 py-4 sm:py-6 shadow-sm border-b border-gray-200 bg-gradient-to-b from-[#fffcf7] to-[#f5f0e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {[
              { href: '/customized', label: 'Customize' },
              { href: '/men', label: 'Men' },
              { href: '/women', label: 'Women' },
              { href: '/kids', label: 'Kids' },
            ].map((link, index) => (
              <motion.div
                key={link.href}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-sm uppercase font-semibold relative py-2 px-4 tracking-widest transition-colors duration-300"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    color: '#000',
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4af37] to-[#e6c469] transition-all duration-500 group-hover:w-full shadow-[0_0_8px_rgba(212,175,55,0.3)]"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Search className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-[#d4af37]" style={{ color: '#000' }} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ShoppingBag className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-[#d4af37]" style={{ color: '#000' }} />
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-black/5 transition-colors duration-200"
            >
              <Menu className="w-6 h-6" style={{ color: '#000' }} />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#f5f0e6] overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex flex-col justify-between h-full px-6 py-8">
              {/* Top */}
              <div className="flex justify-between items-center">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(24px, 6vw, 28px)',
                    color: '#000',
                    fontWeight: 900,
                    letterSpacing: '0.15em',
                  }}
                >
                  ShahBazar
                </motion.span>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6" style={{ color: '#000' }} />
                </motion.button>
              </div>

              {/* Links */}
              <div className="flex flex-col items-center justify-center space-y-8 mt-10">
                {[
                  { href: '/customized', label: 'Customize' },
                  { href: '/men', label: 'Men' },
                  { href: '/women', label: 'Women' },
                  { href: '/kids', label: 'Kids' },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-semibold uppercase tracking-widest transition-colors duration-300 relative"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: '#000',
                      }}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="block h-0.5 w-0 bg-gradient-to-r from-[#d4af37] to-[#e6c469] mt-1 transition-all duration-500 group-hover:w-full shadow-[0_0_6px_rgba(212,175,55,0.3)]"></span>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center space-x-8 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-[#d4af37]"
                >
                  <svg className="w-6 h-6" fill="currentColor" style={{ color: '#000' }} viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-[#d4af37]"
                >
                  <svg className="w-6 h-6" fill="currentColor" style={{ color: '#000' }} viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;