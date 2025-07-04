'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useBannerVisibility } from './DiscountSection';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { showBanner } = useBannerVisibility();

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

  // Calculate top position - always 0 when scrolled (since banner disappears)
  const getNavbarTop = () => {
    if (scrolled) {
      return '0px'; // Always top when scrolled (banner is hidden)
    }
    return showBanner ? '48px' : '0px'; // Below banner when not scrolled and banner visible
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 transition-all duration-700 ${
          isMenuOpen ? 'z-30 lg:z-50' : 'z-50'
        } ${
          isMenuOpen ? 'lg:block hidden' : 'block'
        } ${
          scrolled
            ? 'bg-gradient-to-r from-black/20 via-slate-900/15 to-black/20 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] py-3'
            : 'bg-transparent py-6'
        }`}
        style={{ top: getNavbarTop() }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className={`text-2xl font-bold tracking-wide  ${
                scrolled ? 'scale-95' : ''
              }`}
            >
              <span 
                style={{ 
                  fontFamily: "Garamond, 'Times New Roman', serif", 
                  color: 'rgb(240, 230, 210)',
                  letterSpacing: '0.08em',
                  fontSize: '28px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                ShahBazar
              </span>
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
                  className="text-sm tracking-widest uppercase font-bold relative group transition-all duration-500"
                  style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(240, 230, 210)' }}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-500 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              <div className="hidden sm:block group">
                <Search className="w-5 h-5 cursor-pointer" style={{ color: 'rgb(240, 230, 210)' }} />
              </div>
              <div className="hidden sm:block group">
                <User className="w-5 h-5 cursor-pointer" style={{ color: 'rgb(240, 230, 210)' }} />
              </div>
              <div className="hidden sm:block group">
                <Heart className="w-5 h-5 cursor-pointer" style={{ color: 'rgb(240, 230, 210)' }} />
              </div>
              <div className="relative group">
                <ShoppingBag className="w-5 h-5 cursor-pointer" style={{ color: 'rgb(240, 230, 210)' }} />
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  3
                </span>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 transition-all duration-300"
                style={{ color: 'rgb(240, 230, 210)' }}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div 
        className={`lg:hidden fixed left-0 right-0 z-50 transition-all duration-500 transform ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ top: scrolled ? '80px' : (showBanner ? '128px' : '80px') }}
      >
        <div className="bg-emerald-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
            >
              <span 
                style={{ 
                  fontFamily: "Garamond, 'Times New Roman', serif", 
                  color: 'rgb(240, 230, 210)',
                  letterSpacing: '0.08em',
                  fontSize: '22px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                ShahBazar
              </span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 transition-all duration-300"
              style={{ color: 'rgb(240, 230, 210)' }}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtle Divider */}
          <div className="h-[1px] bg-emerald-700"></div>

          {/* Mobile Navigation Links */}
          <div className="px-6 py-3 space-y-1">
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
                className="block transition-all duration-300 font-bold uppercase tracking-wider px-3 py-3 text-sm relative group"
                onClick={() => setIsMenuOpen(false)}
                style={{ fontFamily: "'Montserrat', sans-serif", color: 'rgb(240, 230, 210)' }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-3 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-[calc(100%-24px)]"></span>
              </Link>
            ))}
          </div>
          
          {/* Subtle Divider */}
          <div className="h-[1px] bg-emerald-700"></div>
          
          {/* Mobile Icons */}
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex flex-col items-center">
              <Search className="w-5 h-5 cursor-pointer transition-all duration-300" style={{ color: 'rgb(240, 230, 210)' }} />
              <span className="text-xs mt-1" style={{ color: 'rgb(240, 230, 210, 0.8)' }}>Search</span>
            </div>
            <div className="flex flex-col items-center">
              <User className="w-5 h-5 cursor-pointer transition-all duration-300" style={{ color: 'rgb(240, 230, 210)' }} />
              <span className="text-xs mt-1" style={{ color: 'rgb(240, 230, 210, 0.8)' }}>Account</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5 cursor-pointer transition-all duration-300" style={{ color: 'rgb(240, 230, 210)' }} />
              <span className="text-xs mt-1" style={{ color: 'rgb(240, 230, 210, 0.8)' }}>Wishlist</span>
            </div>
            <div className="flex flex-col items-center relative">
              <ShoppingBag className="w-5 h-5 cursor-pointer transition-all duration-300" style={{ color: 'rgb(240, 230, 210)' }} />
              <span className="absolute -top-2 -right-1 bg-emerald-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
              <span className="text-xs mt-1" style={{ color: 'rgb(240, 230, 210, 0.8)' }}>Bag</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          style={{ top: scrolled ? '80px' : (showBanner ? '128px' : '80px') }}
        />
      )}
    </>
  );
}