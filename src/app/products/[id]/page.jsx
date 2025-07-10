"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [direction, setDirection] = useState(0);
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.product);
        if (data.product.size?.length > 0) {
          setSelectedSize(data.product.size[0]);
        }
        if (data.product.color?.length > 0) {
          setSelectedColor(data.product.color[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const formatPrice = (price) => {
    return `Rs ${Number(price).toLocaleString()}.00`;
  };

  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    const percentage = Math.round(((original - discounted) / original) * 100);
    return percentage;
  };

  const addToCart = () => {
    if (!selectedSize && product.size?.length > 0) {
      alert('Please select a size');
      return;
    }
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.discountedPrice || product.originalPrice,
      image: product.images?.[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart = [...cart, cartItem];
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to Cart successfully!');
    router.push('/cart');
  };

  const handleImageChange = (index) => {
    setDirection(index > selectedImage ? 1 : -1);
    setSelectedImage(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(240,230,210)] flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">Product Not Found</h1>
            <Link href="/collections" className="text-gray-900 font-light hover:text-amber-600 text-lg transition-colors duration-300">
              Back to Collections
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    })
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 text-sm font-light text-gray-600 mb-10"
        >
          <Link href="/" className="hover:text-amber-600 transition-colors duration-300">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-amber-600 transition-colors duration-300">Collections</Link>
          <span>/</span>
          <span className="text-gray-900 font-light">{product.name}</span>
        </motion.nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="aspect-w-3 aspect-h-4 bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.images?.length > 0 ? (
                <AnimatePresence custom={direction} mode="wait">
                  <motion.img
                    key={selectedImage}
                    custom={direction}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    src={product.images[selectedImage]}
                    alt={`${product.name} - Image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                  </svg>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="grid grid-cols-5 gap-3"
              >
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 ${selectedImage === index ? 'border-gray-800 shadow-md' : 'border-gray-200'} hover:border-gray-800 hover:shadow-md transition-all duration-300`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <div className="flex justify-between items-center">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl font-light text-gray-900 tracking-tight leading-tight"
                >
                  {product.name || 'Belted Shearling Coat'}
                </motion.h1>
                {product.isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="inline-block bg-gray-800 text-center text-white text-xs font-light uppercase px-4 py-2 rounded-full tracking-widest"
                  >
                    New Arrival
                  </motion.span>
                )}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-gray-600 uppercase tracking-widest mt-3"
              >
                {product.category?.name || 'Outerwear'} • {product.gender || 'Women'}'s
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center space-x-2 mt-3"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(4.9) ? 'text-amber-600' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-light">4.9 (Based on reviews)</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-3">
                {product.discountedPrice ? (
                  <>
                    <span className="text-3xl font-light text-gray-900 tracking-tight">
                      {formatPrice(product.discountedPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through font-light">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-amber-600 text-white text-xs font-light text-center uppercase px-4 py-2 rounded-full tracking-widest">
                      {calculateDiscount(product.originalPrice, product.discountedPrice)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-light text-gray-900 tracking-tight">
                    {formatPrice(product.originalPrice || 1400)}
                  </span>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-emerald-600' : product.stock > 0 ? 'bg-amber-600' : 'bg-red-600'}`}></div>
              <span className="text-sm font-light text-gray-700 tracking-wide">
                {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </motion.div>
            {product.color?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-4"
              >
                <label className="text-sm font-light text-gray-900 tracking-wide">Color</label>
                <div className="flex gap-2">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-gray-400 ring-1 ring-gray-400' : 'border-gray-300'} hover:cursor-pointer`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </motion.div>
            )}
            {allSizes && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-light text-gray-900 tracking-wide">Size</label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-gray-600 font-light hover:text-amber-600 hover:cursor-pointer transition-colors duration-300 tracking-wide"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => product.size.includes(size) && setSelectedSize(size)}
                      disabled={!product.size.includes(size)}
                      className={`flex items-center justify-center h-10 sm:h-12 px-2 sm:px-4 border-2 rounded-md text-xs sm:text-sm font-light transition-all duration-300 ${
                        !product.size.includes(size)
                          ? 'line-through text-gray-400 cursor-not-allowed bg-gray-200'
                          : selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-4"
            >
              <label className="text-sm font-light text-gray-900 tracking-wide">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-light text-gray-900 text-lg tracking-wide">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all duration-300"
                  disabled={quantity >= product.stock}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-4"
            >
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="w-full bg-black text-white py-3 rounded-full font-light text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 font-light tracking-wide">All Over Pakistan Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700 font-light tracking-wide">Hassle-Free Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-gray-700 font-light tracking-wide">Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01" />
                  </svg>
                  <span className="text-gray-700 font-light tracking-wide">Premium Quality</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-16 border-t pt-8"
        >
          <div className="flex overflow-x-auto space-x-8 border-b border-gray-200">
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`whitespace-nowrap pb-4 text-sm font-light uppercase tracking-widest transition-all duration-300 ${selectedTab === tab.id
                  ? 'border-gray-800 text-gray-900 border-b-2'
                  : 'border-transparent text-gray-600 hover:text-amber-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-8"
          >
            {selectedTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm font-light tracking-wide">
                  {product.description ||
                    'Crafted from the finest shearling and wool, this belted coat combines timeless elegance with modern sophistication. Its lightweight yet warm construction, tonal fabric details, and ruched accents make it a luxurious addition to your winter wardrobe. Perfect for fall and winter, this coat offers both style and comfort.'}
                </p>
              </div>
            )}
            {selectedTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-light text-gray-900 text-lg mb-4 tracking-tight">Product Information</h3>
                  <dl className="space-y-3">
                    <div className="flex">
                      <dt className="w-24 text-sm text-gray-600 font-light tracking-wide">Category:</dt>
                      <dd className="text-sm text-gray-700 capitalize font-light">{product.category?.name || 'Outerwear'}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-sm text-gray-600 font-light tracking-wide">Gender:</dt>
                      <dd className="text-sm text-gray-700 capitalize font-light">{product.gender || 'Women'}</dd>
                    </div>
                    {product.size?.length > 0 && (
                      <div className="flex">
                        <dt className="w-24 text-sm text-gray-600 font-light tracking-wide">Sizes:</dt>
                        <dd className="text-sm text-gray-700 font-light">{product.size.join(', ')}</dd>
                      </div>
                    )}
                    {product.color?.length > 0 && (
                      <div className="flex">
                        <dt className="w-24 text-sm text-gray-600 font-light tracking-wide">Colors:</dt>
                        <dd className="text-sm text-gray-700 capitalize font-light">{product.color.join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h3 className="font-light text-gray-900 text-lg mb-4 tracking-tight">Care Instructions</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-light">
                    <li>• Dry clean only</li>
                    <li>• Store in a cool, dry place</li>
                    <li>• Avoid prolonged exposure to direct sunlight</li>
                    <li>• Use a soft brush to remove surface dirt</li>
                  </ul>
                </div>
              </div>
            )}
            {selectedTab === 'shipping' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-light text-gray-900 text-lg mb-4 tracking-tight">Shipping Information</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-light">
                    <li>• Complimentary shipping on all orders</li>
                    <li>• Express shipping available for Rs 5000</li>
                    <li>• Standard delivery: 5-7 business days</li>
                    <li>• Express delivery: 1-3 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-light text-gray-900 text-lg mb-4 tracking-tight">Returns & Exchanges</h3>
                  <ul className="text-sm text-gray-700 space-y-2 font-light">
                    <li>• 30-day return policy</li>
                    <li>• Items must be unworn and in original packaging</li>
                    <li>• Complimentary returns on all orders</li>
                    <li>• Exchanges available for different sizes/colors, subject to availability</li>
                  </ul>
                </div>
              </div>
            )}
            {selectedTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-700 text-sm mb-6 font-light tracking-wide">
                  Rated 4.9 stars by our customers. Share your experience!
                </p>
                <button
                  className="w-full max-w-xs bg-black text-white py-3 rounded-full font-light text-sm uppercase tracking-widest hover:bg-gray-800 transition-all duration-300"
                >
                  Write a Review
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      {showSizeGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-transparent rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6 bg-white rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-900 tracking-tight">Size Guide</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-600 hover:text-amber-600 hover:cursor-pointer transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 text-gray-900 font-light tracking-wide">Size</th>
                      <th className="text-left py-3 px-4 text-gray-900 font-light tracking-wide">Chest (in)</th>
                      <th className="text-left py-3 px-4 text-gray-900 font-light tracking-wide">Waist (in)</th>
                      <th className="text-left py-3 px-4 text-gray-900 font-light tracking-wide">Hip (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700 font-light">Small</td>
                      <td className="py-3 px-4 text-gray-700 font-light">34-36</td>
                      <td className="py-3 px-4 text-gray-700 font-light">28-30</td>
                      <td className="py-3 px-4 text-gray-700 font-light">36-38</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700 font-light">Medium</td>
                      <td className="py-3 px-4 text-gray-700 font-light">36-38</td>
                      <td className="py-3 px-4 text-gray-700 font-light">30-32</td>
                      <td className="py-3 px-4 text-gray-700 font-light">38-40</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700 font-light">Large</td>
                      <td className="py-3 px-4 text-gray-700 font-light">38-40</td>
                      <td className="py-3 px-4 text-gray-700 font-light">32-34</td>
                      <td className="py-3 px-4 text-gray-700 font-light">40-42</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-700 font-light">Extra-Large</td>
                      <td className="py-3 px-4 text-gray-700 font-light">40-42</td>
                      <td className="py-3 px-4 text-gray-700 font-light">34-36</td>
                      <td className="py-3 px-4 text-gray-700 font-light">42-44</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700 font-light">Extra-Extra-Large</td>
                      <td className="py-3 px-4 text-gray-700 font-light">42-44</td>
                      <td className="py-3 px-4 text-gray-700 font-light">36-38</td>
                      <td className="py-3 px-4 text-gray-700 font-light">44-46</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}