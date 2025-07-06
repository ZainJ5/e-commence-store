'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X, Facebook, Instagram } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50; // Increased threshold for better UX
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-700 ${
          isMenuOpen ? 'z-30 lg:z-50' : 'z-50'
        } ${
          isMenuOpen ? 'lg:block hidden' : 'block'
        } ${
          scrolled
            ? 'py-2'
            : 'py-6'
        }`}
        style={{
          background: scrolled 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(16,24,40,0.9) 30%, rgba(0,0,0,0.85) 100%)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled 
            ? '0 20px 60px rgba(0,0,0,0.6), 0 8px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
            : 'none',
          borderBottom: scrolled 
            ? '1px solid rgba(255,255,255,0.25)' 
            : 'none'
        }}
      >
        {/* Premium gradient overlay - only when scrolled */}
        {scrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-emerald-900/10 pointer-events-none"></div>
        )}
        
        {/* Elegant top accent line - only when scrolled */}
        {scrolled && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
        )}
        
        {/* Complete thin line with elegant color - only when scrolled */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between h-16 lg:hidden">
            {/* Logo - Left on mobile */}
            <Link 
              href="/" 
              className="text-2xl font-bold tracking-wide transition-all duration-500"
            >
              <span 
                style={{ 
                  fontFamily: "Playfair Display, Garamond, 'Times New Roman', serif", 
                  color: 'rgb(250, 245, 235)',
                  letterSpacing: '0.15em',
                  fontSize: 'clamp(26px, 6vw, 32px)',
                  fontWeight: '800',
                  textShadow: scrolled 
                    ? '0 6px 20px rgba(0,0,0,0.8), 0 3px 8px rgba(0,0,0,0.6), 0 0 30px rgba(240,230,210,0.3)'
                    : '0 8px 32px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(240,230,210,0.4)',
                  background: 'linear-gradient(135deg, #f0e6d2 0%, #e8dcc0 30%, #d4c5a0 70%, #c8b891 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4)) drop-shadow(0 0 10px rgba(240,230,210,0.2))'
                }}
              >
                ShahBazar
              </span>
            </Link>

            {/* Right Side Icons - Mobile */}
            <div className="flex items-center space-x-2">
              <div className="group cursor-pointer transition-all duration-300 p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg">
                <Search className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
                  style={{ 
                    color: 'rgb(250, 245, 235)', 
                    filter: scrolled 
                      ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                  }} 
                />
              </div>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 transition-all duration-300 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105"
                style={{ 
                  color: 'rgb(250, 245, 235)', 
                  filter: scrolled 
                    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                }}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Logo - Left on desktop */}
            <Link 
              href="/" 
              className="text-2xl font-bold tracking-wide transition-all duration-500 hover:scale-105"
            >
              <span 
                style={{ 
                  fontFamily: "Playfair Display, Garamond, 'Times New Roman', serif", 
                  color: 'rgb(250, 245, 235)',
                  letterSpacing: '0.12em',
                  fontSize: '36px',
                  fontWeight: '700',
                  textShadow: scrolled 
                    ? '0 6px 20px rgba(0,0,0,0.8), 0 3px 8px rgba(0,0,0,0.6), 0 0 30px rgba(240,230,210,0.3)'
                    : '0 8px 32px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7), 0 0 40px rgba(240,230,210,0.4)',
                  background: 'linear-gradient(135deg, #f0e6d2 0%, #e8dcc0 30%, #d4c5a0 70%, #c8b891 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4)) drop-shadow(0 0 10px rgba(240,230,210,0.2))'
                }}
              >
                ShahBazar
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex space-x-16">
              {[
                { href: '/customized', label: 'Customize' },
                { href: '/men', label: 'Men' },
                { href: '/women', label: 'Women' },
                { href: '/kids', label: 'Kids' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-[0.15em] uppercase font-semibold relative group transition-all duration-500  py-2 px-4"
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    color: 'rgb(250, 245, 235)',
                    textShadow: scrolled 
                      ? '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
                  }}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-500 group-hover:w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Icons - Desktop */}
            <div className="flex items-center space-x-8">
              {/* Social Media Icons */}
              <div className="flex items-center space-x-5">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group transition-all duration-300 p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-110"
                >
                  <svg className="w-5 h-5 cursor-pointer transition-all duration-300" 
                    style={{ 
                      color: 'rgb(250, 245, 235)', 
                      filter: scrolled 
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                    }} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group transition-all duration-300 p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-110"
                >
                  <svg className="w-5 h-5 cursor-pointer transition-all duration-300" 
                    style={{ 
                      color: 'rgb(250, 245, 235)', 
                      filter: scrolled 
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                    }} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
              </div>

              {/* Elegant Divider - only when scrolled */}
              {scrolled && (
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent shadow-sm"></div>
              )}

              {/* Action Icons */}
              <div className="flex items-center space-x-6">
                <div className="group cursor-pointer transition-all duration-300 p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-110">
                  <Search className="w-5 h-5 transition-all duration-300" 
                    style={{ 
                      color: 'rgb(250, 245, 235)', 
                      filter: scrolled 
                        ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                    }} 
                  />
                </div>
              </div>

              <div className="relative group cursor-pointer transition-all duration-300 p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg hover:scale-110">
                <ShoppingBag className="w-5 h-5 transition-all duration-300" 
                  style={{ 
                    color: 'rgb(250, 245, 235)', 
                    filter: scrolled 
                      ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                  }} 
                />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.4)] font-semibold border border-white/20">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - Keep the same styling */}
      <div 
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-emerald-900/95 via-emerald-800/90 to-emerald-900/95 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl border-b border-emerald-700/40"
          style={{
            background: 'linear-gradient(145deg, rgba(6,78,59,0.95) 0%, rgba(16,81,64,0.92) 30%, rgba(4,60,47,0.95) 100%)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none"></div>
          
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-6 relative">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="transition-all duration-300 hover:scale-105"
            >
              <span 
                style={{ 
                  fontFamily: "Playfair Display, Garamond, 'Times New Roman', serif", 
                  color: 'rgb(250, 245, 235)',
                  letterSpacing: '0.12em',
                  fontSize: '26px',
                  fontWeight: '800',
                  textShadow: '0 6px 20px rgba(0,0,0,0.8), 0 3px 8px rgba(0,0,0,0.6), 0 0 30px rgba(240,230,210,0.3)',
                  background: 'linear-gradient(135deg, #f0e6d2 0%, #e8dcc0 30%, #d4c5a0 70%, #c8b891 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4)) drop-shadow(0 0 10px rgba(240,230,210,0.2))'
                }}
              >
                ShahBazar
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-3 transition-all duration-300 rounded-full hover:bg-white/15 hover:backdrop-blur-sm hover:shadow-lg"
              style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Elegant Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent mx-6 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>

          {/* Mobile Navigation Links */}
          <div className="px-6 py-6 space-y-2">
            {[
              { href: '/new', label: 'New & Featured' },
              { href: '/men', label: 'Men' },
              { href: '/women', label: 'Women' },
              { href: '/kids', label: 'Kids' },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="block transition-all duration-300 font-semibold uppercase tracking-wider px-4 py-4 text-sm relative group hover:bg-white/10 hover:backdrop-blur-sm rounded-lg hover:shadow-lg"
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  fontFamily: "'Montserrat', sans-serif", 
                  color: 'rgb(250, 245, 235)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {link.label}
                <span className="absolute bottom-2 left-4 w-0 h-0.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-[calc(100%-32px)] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              </Link>
            ))}
          </div>
          
          {/* Elegant Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent mx-6 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          
          {/* Mobile Icons & Social Media */}
          <div className="px-8 py-6">
            {/* Action Icons */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center group">
                <div className="p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-110">
                  <Search className="w-6 h-6 cursor-pointer transition-all duration-300" 
                    style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'rgb(250, 245, 235, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Search</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-110">
                  <User className="w-6 h-6 cursor-pointer transition-all duration-300" 
                    style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'rgb(250, 245, 235, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Account</span>
              </div>
              <div className="flex flex-col items-center relative group">
                <div className="p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-110">
                  <ShoppingBag className="w-6 h-6 cursor-pointer transition-all duration-300" 
                    style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold shadow-[0_4px_15px_rgba(16,185,129,0.4)] border border-white/20">
                    3
                  </span>
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'rgb(250, 245, 235, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Bag</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex justify-center space-x-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center group transition-all duration-300"
              >
                <div className="p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-110">
                  <svg className="w-6 h-6 cursor-pointer transition-all duration-300" 
                    style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'rgb(250, 245, 235, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Facebook</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center group transition-all duration-300"
              >
                <div className="p-3 rounded-full hover:bg-white/15 hover:backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-110">
                  <svg className="w-6 h-6 cursor-pointer transition-all duration-300" 
                    style={{ color: 'rgb(250, 245, 235)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'rgb(250, 245, 235, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}