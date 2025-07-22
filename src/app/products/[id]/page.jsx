"use client"

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useCartStore from '../../stores/cartStores';
import { toast, Toaster } from 'react-hot-toast';
import ReviewsSection from '../../components/ReviewsSection';
import YouMayAlsoLike from '../../components/YouMayAlsoLike';

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
  const [selectedTab, setSelectedTab] = useState('information');
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    loading: true
  });
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const { addItem } = useCartStore();
  const imageContainerRef = useRef(null);

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

    const fetchReviewSummary = async () => {
      try {
        setReviewSummary(prev => ({ ...prev, loading: true }));
        const response = await fetch(`/api/reviews/product/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setReviewSummary({
            averageRating: data.data.averageRating,
            totalReviews: data.data.totalReviews,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error fetching review summary:', error);
        setReviewSummary({
          averageRating: 0,
          totalReviews: 0,
          loading: false
        });
      }
    };

    fetchProduct();
    fetchReviewSummary();
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
      toast.error('Please select a size');
      return;
    }

    const cartItem = {
      id: `${product._id}-${selectedSize}-${selectedColor}`,
      productId: product._id,
      name: product.name,
      price: product.discountedPrice || product.originalPrice,
      image: product.images?.[0] || '',
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      maxQuantity: product.stock,
      customizable: product.customizable || false
    };

    addItem(cartItem);
    setAddedToCart(true);
    setShowNotification(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleImageChange = (index) => {
    if (index < 0) {
      index = product.images.length - 1;
    } else if (index >= product.images.length) {
      index = 0;
    }
    setSelectedImage(index);
  };

  const crossfadeVariants = {
    initial: { opacity: 0 },
    enter: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const zoomFadeVariants = {
    initial: { 
      opacity: 0,
      scale: 1.05
    },
    enter: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    added: { scale: [1, 1.05, 1], transition: { duration: 0.3 }}
  };
  
  const notificationVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 }},
    exit: { y: -100, opacity: 0, transition: { duration: 0.3 }}
  };

  const nextImage = () => {
    handleImageChange(selectedImage + 1);
  };

  const prevImage = () => {
    handleImageChange(selectedImage - 1);
  };

  const ProductSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-gray-100 rounded w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      <div className="h-12 bg-gray-100 rounded w-1/3 mt-8"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-3 mt-8">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-gray-100"></div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-3 mt-6">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
      <div className="h-14 bg-gray-100 rounded mt-8"></div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-['Playfair_Display']">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-light text-black mb-8 tracking-tight">Product Not Found</h1>
            <Link href="/collections" className="text-black hover:text-gray-600 text-lg transition-colors duration-300 border-b border-black pb-1">
              Return to Collections
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Inter'] text-black">
      <Navbar />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            maxWidth: '90vw',
            width: 'auto',
            background: '#000',
            color: '#fff',
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          },
        }}
      />
      
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={notificationVariants}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg max-w-[90vw] w-auto"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="whitespace-nowrap">Added to cart</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 text-sm text-gray-500 mb-12"
        >
          <Link href="/" className="hover:text-black transition-colors duration-300">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-black transition-colors duration-300">Collections</Link>
          <span>/</span>
          <span className="text-black">{isLoading ? 'Loading...' : product?.name}</span>
        </motion.nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div ref={imageContainerRef} className="relative aspect-w-3 aspect-h-4 bg-[#f9f9f9] rounded-lg overflow-hidden group">
              {isLoading ? (
                <div className="w-full h-full bg-gray-100 animate-pulse"></div>
              ) : product?.images?.length > 0 ? (
                <>
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                      variants={zoomFadeVariants}
                      className="w-full h-full"
                    >
                      <img
                        src={product.images[selectedImage]}
                        alt={`${product.name} - Image ${selectedImage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button 
                      onClick={prevImage}
                      className="bg-white/90 backdrop-blur-sm text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-300"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="bg-white/90 backdrop-blur-sm text-black w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-300"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                  </svg>
                </div>
              )}
            </div>
            
            {!isLoading && product?.images?.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-5 gap-4"
              >
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                    }}
                    className={`aspect-square overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 ${selectedImage === index 
                      ? 'ring-2 ring-black' 
                      : 'ring-1 ring-gray-200 hover:ring-gray-400'}`}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            {isLoading ? (
              <ProductSkeleton />
            ) : (
              <>
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <h1 className="text-4xl sm:text-5xl font-['Playfair_Display'] tracking-tight leading-tight">
                      {product.name}
                    </h1>
                    
                    {product.productTags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {product.productTags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-block bg-white border border-black text-black text-xs uppercase px-4 py-1 rounded-full tracking-wider whitespace-nowrap"
                          >
                            {tag.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    {product.category?.name || 'Apparel'} • {product.gender || 'Unisex'}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(reviewSummary.averageRating) ? 'text-black' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {reviewSummary.averageRating} ({reviewSummary.totalReviews} {reviewSummary.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center space-x-4">
                    {product.discountedPrice ? (
                      <>
                        <span className="text-3xl font-medium font-['Playfair_Display'] tracking-tight">
                          {formatPrice(product.discountedPrice)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="bg-black text-white text-center text-xs uppercase px-3 py-1 rounded-full tracking-wider">
                          {calculateDiscount(product.originalPrice, product.discountedPrice)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-medium font-['Playfair_Display'] tracking-tight">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                {product.customizable && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-black/5 border border-black/20 rounded-md p-4 my-6"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-0.5">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-black mb-1">Customizable Product</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          This item can be customized to your preferences. Place your order normally, and after placing order you will be able to connect with us via WhatsApp to discuss your customization details.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-800">
                    {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
                
                {product.color?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">COLOR</label>
                      <span className="text-sm text-gray-600">{selectedColor}</span>
                    </div>
                    <div className="flex gap-3">
                      {product.color.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer
                            ${selectedColor === color ? 'ring-2 ring-black' : 'ring-1 ring-gray-300 hover:ring-gray-400'}`}
                          style={{ backgroundColor: color }}
                          aria-label={color}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.size?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">SIZE</label>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-sm underline underline-offset-4 hover:text-gray-600 transition-colors duration-300 cursor-pointer"
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
                          className={`h-12 flex items-center justify-center border transition-all duration-300 cursor-pointer
                            ${!product.size.includes(size)
                              ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                              : selectedSize === size
                              ? 'bg-black text-white border-black'
                              : 'border-gray-300 hover:border-black'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <label className="text-sm font-medium">QUANTITY</label>
                  <div className="flex items-center border border-gray-300 w-fit divide-x">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <motion.button
                  onClick={addToCart}
                  disabled={product.stock === 0}
                  variants={buttonVariants}
                  animate={addedToCart ? "added" : "idle"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest hover:bg-gray-900 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {product.stock === 0 ? 'Out of Stock' : addedToCart ? 'Added To Cart' : 'Add To Cart'}
                </motion.button>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="text-xs text-gray-700 tracking-wide">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs text-gray-700 tracking-wide">Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-xs text-gray-700 tracking-wide">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-xs text-gray-700 tracking-wide">Easy Returns</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 border-t border-gray-100 pt-10"
        >
          <div className="flex overflow-x-auto space-x-10 border-b border-gray-100 pb-1">
            {[
              { id: 'information', label: 'Product Information' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`whitespace-nowrap pb-3 text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer ${selectedTab === tab.id
                  ? 'border-black text-black border-b-2 font-medium'
                  : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <motion.div
            key={selectedTab}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={crossfadeVariants}
            className="py-8"
          >
            {selectedTab === 'information' && !isLoading && (
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h3 className="font-['Playfair_Display'] text-lg mb-4 tracking-tight">Description</h3>
                  <p className="text-gray-700 leading-relaxed tracking-wide">
                    {product.description || 
                      'Crafted with meticulous attention to detail, this exceptional piece embodies timeless elegance with a contemporary twist. The sophisticated silhouette is enhanced by premium materials, offering both luxurious comfort and striking visual appeal. Versatile in styling, this statement piece transitions effortlessly from day to evening, making it an essential addition to your wardrobe.'}
                  </p>
                  
                  {product.customizable && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h3 className="font-medium mb-2">Customization Options</h3>
                      <p className="text-gray-700 leading-relaxed tracking-wide">
                        This product offers personalization options. After placing your order, our team will reach out via WhatsApp to discuss your specific customization requirements including preferred design modifications, special embellishments, or personalization details.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-['Playfair_Display'] text-lg mb-4 tracking-tight">Product Details</h3>
                  <div className="overflow-hidden bg-white rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50 w-1/4">Category</td>
                          <td className="px-4 py-3 text-sm text-gray-700 capitalize">{product.category?.name || 'Apparel'}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Type</td>
                          <td className="px-4 py-3 text-sm text-gray-700 capitalize">{product.type?.name || 'Standard'}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Gender</td>
                          <td className="px-4 py-3 text-sm text-gray-700 capitalize">{product.gender || 'Unisex'}</td>
                        </tr>
                        {product.fabric && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Fabric</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{product.fabric}</td>
                          </tr>
                        )}
                        {product.size?.length > 0 && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Available Sizes</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{product.size.join(', ')}</td>
                          </tr>
                        )}
                        {product.color?.length > 0 && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Available Colors</td>
                            <td className="px-4 py-3 text-sm text-gray-700 capitalize flex gap-2 items-center">
                              {product.color.map(color => (
                                <span 
                                  key={color} 
                                  className="inline-block w-4 h-4 rounded-full border border-gray-300" 
                                  style={{ backgroundColor: color }}
                                ></span>
                              ))}
                              <span>{product.color.join(', ')}</span>
                            </td>
                          </tr>
                        )}
                        {product.customizable && (
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Customizable</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-['Playfair_Display'] text-lg mb-4 tracking-tight">Care Instructions</h3>
                  <ul className="text-sm space-y-4 text-gray-700">
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Dry clean only</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Store in a cool, dry place</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Avoid prolonged exposure to direct sunlight</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Use a soft brush to remove surface dirt</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {selectedTab === 'shipping' && !isLoading && (
              <div className="space-y-10">
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg mb-6 tracking-tight">Shipping Information</h3>
                  <ul className="text-sm space-y-4 text-gray-700">
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Complimentary standard shipping on all orders within Pakistan</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Express shipping available for Rs 5000</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Standard delivery: 5-7 business days</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Express delivery: 1-3 business days</span>
                    </li>
                    {product.customizable && (
                      <li className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>Customized products may require additional processing time</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-['Playfair_Display'] text-lg mb-6 tracking-tight">Returns & Exchanges</h3>
                  <ul className="text-sm space-y-4 text-gray-700">
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>30-day return policy</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Items must be unworn and in original packaging with tags attached</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Complimentary returns on all orders</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>Exchanges available for different sizes/colors, subject to availability</span>
                    </li>
                    {product.customizable && (
                      <li className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>Customized items are non-returnable unless defective</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {selectedTab === 'reviews' && !isLoading && product && (
              <ReviewsSection productId={product._id} />
            )}
            
            {isLoading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            )}
          </motion.div>
        </motion.div>
        
        {!isLoading && product && (
          <YouMayAlsoLike 
            currentProductId={product._id} 
            category={product.category?._id} 
          />
        )}
      </div>
      
      {showSizeGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-medium font-['Playfair_Display']">Size Guide</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Size</th>
                      <th className="text-left py-3 px-4 font-medium">Chest (in)</th>
                      <th className="text-left py-3 px-4 font-medium">Waist (in)</th>
                      <th className="text-left py-3 px-4 font-medium">Hip (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">XS</td>
                      <td className="py-3 px-4">32-34</td>
                      <td className="py-3 px-4">26-28</td>
                      <td className="py-3 px-4">34-36</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">S</td>
                      <td className="py-3 px-4">34-36</td>
                      <td className="py-3 px-4">28-30</td>
                      <td className="py-3 px-4">36-38</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">M</td>
                      <td className="py-3 px-4">36-38</td>
                      <td className="py-3 px-4">30-32</td>
                      <td className="py-3 px-4">38-40</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">L</td>
                      <td className="py-3 px-4">38-40</td>
                      <td className="py-3 px-4">32-34</td>
                      <td className="py-3 px-4">40-42</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">XL</td>
                      <td className="py-3 px-4">40-42</td>
                      <td className="py-3 px-4">34-36</td>
                      <td className="py-3 px-4">42-44</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">XXL</td>
                      <td className="py-3 px-4">42-44</td>
                      <td className="py-3 px-4">36-38</td>
                      <td className="py-3 px-4">44-46</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-sm text-gray-600">
                <p>This size chart is a general guide. Fit may vary depending on the construction, materials, and manufacturer.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </div>
  );
}