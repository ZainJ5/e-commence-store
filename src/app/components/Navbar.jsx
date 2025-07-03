'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-gradient-to-r from-black/20 via-slate-900/15 to-black/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className={`text-2xl font-bold text-white italic tracking-wide transition-all duration-500 hover:scale-105 ${
                scrolled ? 'scale-95' : ''
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ShahBazar
            </Link>

           {/* Desktop Navigation */}
<div className="hidden lg:flex space-x-12">
  {[
    { href: '/new', label: 'New & Featured' },
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
    { href: '/kids', label: 'Kids' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/sales', label: 'Sales' },
  ].map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="text-white text-sm tracking-widest uppercase font-semibold relative group transition-all duration-500 hover:scale-105"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {link.label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 group-hover:w-full"></span>
    </Link>
  ))}
</div>


            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:block group">
                <Search className="w-5 h-5 text-white  cursor-pointer" />
              </div>
              <div className="hidden sm:block group">
                <User className="w-5 h-5 text-white  cursor-pointer" />
              </div>
              <div className="hidden sm:block group">
                <Heart className="w-5 h-5 text-white  cursor-pointer" />
              </div>
              <div className="relative group">
                <ShoppingBag className="w-5 h-5 text-white cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  3
                </span>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-emerald-300 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu - Updated with premium white design */}
      <div 
        className={`lg:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-500 transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-800 italic tracking-wide transition-all"
              style={{ fontFamily: "'Playfair Display', serif" }}
              onClick={() => setIsMenuOpen(false)}
            >
              ShahBazar
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-emerald-600 transition-all duration-300"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-[1px] bg-gray-100"></div>

          {/* Mobile Navigation Links */}
          <div className="px-6 py-3 space-y-1">
            <Link 
              href="/new" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              New & Featured
            </Link>
            <Link 
              href="/men" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Men
            </Link>
            <Link 
              href="/women" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Women
            </Link>
            <Link 
              href="/kids" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Kids
            </Link>
            <Link 
              href="/accessories" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Accessories
            </Link>
            <Link 
              href="/sales" 
              className="block text-gray-700 hover:text-emerald-600 transition-all duration-300 font-medium uppercase tracking-wider px-3 py-3 text-sm"
              onClick={() => setIsMenuOpen(false)}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Sales
            </Link>
          </div>
          
          {/* Subtle Divider */}
          <div className="h-[1px] bg-gray-100"></div>
          
          {/* Mobile Icons */}
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex flex-col items-center">
              <Search className="w-5 h-5 text-gray-600 hover:text-emerald-600 cursor-pointer transition-all duration-300" />
              <span className="text-xs text-gray-500 mt-1">Search</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-5 h-5 text-gray-600 hover:text-emerald-600 cursor-pointer transition-all duration-300" />
              <span className="text-xs text-gray-500 mt-1">Account</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5 text-gray-600 hover:text-emerald-600 cursor-pointer transition-all duration-300" />
              <span className="text-xs text-gray-500 mt-1">Wishlist</span>
            </div>
            <div className="flex flex-col items-center relative">
              <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-emerald-600 cursor-pointer transition-all duration-300" />
              <span className="absolute -top-2 -right-1 bg-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
              <span className="text-xs text-gray-500 mt-1">Bag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - More subtle */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}