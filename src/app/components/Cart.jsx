'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { X, Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ChevronRight, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import useCartStore from '../stores/cartStores';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Cart = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const router = useRouter();
  const cartRef = useRef(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerShadow = useTransform(scrollY, [0, 100], [0, 10]);
  
  const tax = 0;
  const freeShippingThreshold = 5000;
  const shipping = totalPrice > freeShippingThreshold ? 0 : 250;
  const freeShippingProgress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
  const amountToFreeShipping = Math.max(freeShippingThreshold - totalPrice, 0);
  const finalTotal = totalPrice - discount + tax + shipping;

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'discount20') {
        const discountAmount = totalPrice * 0.2;
        setDiscount(parseFloat(discountAmount.toFixed(2)));
      } else if (couponCode.toLowerCase() === 'save50') {
        setDiscount(50);
      } else {
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const handleItemRemove = (id) => {
    setSelectedItemId(id);
    setTimeout(() => {
      removeItem(id);
      setSelectedItemId(null);
    }, 300);
  };
  
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  if (!mounted) {
    return null;
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      } 
    },
    exit: { 
      opacity: 0, 
      transition: { 
        duration: 0.4,
        when: "afterChildren",
      } 
    },
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    removed: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.7 } 
    }
  };
  
  const progressSteps = [
    { id: 1, name: 'Cart', current: true },
    { id: 2, name: 'Checkout', current: false },
    { id: 3, name: 'Payment', current: false }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#f8f3e8] to-[#f3eada] overflow-y-auto"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      ref={cartRef}
    >
      <motion.header 
        className="sticky top-0 z-10 bg-gradient-to-r from-[#efe0c3] to-[#e9dabb] backdrop-blur-md border-b border-[#e5d6b1]"
        style={{
          opacity: headerOpacity,
          boxShadow: `0px 0px ${headerShadow}px rgba(0,0,0,0.08)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-6 pb-2 flex justify-between items-center">
            <motion.div 
              className="flex items-center" 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <button
                onClick={onClose}
                className="mr-4 p-1.5 rounded-full hover:bg-[#e2cfa6] transition-all duration-300"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-black" />
              </button>
              <h1 className="text-2xl font-light sm:text-3xl text-black tracking-wide">Your Shopping Cart</h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm text-black"
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </motion.div>
              <button 
                onClick={onClose}
                className="hidden sm:flex items-center text-sm font-medium text-black hover:text-[#222] transition-colors duration-300"
              >
                <span>Continue shopping</span>
              </button>
            </div>
          </div>
          
          <motion.div 
            className="py-3 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-1">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${
                      step.current 
                        ? 'bg-[#333] text-white shadow-lg' 
                        : 'bg-[#e0d0b2] text-black'
                    } transition-all duration-300`}
                  >
                    {step.id}
                  </div>
                  <div 
                    className={`ml-2 text-sm ${
                      step.current 
                        ? 'text-black font-medium' 
                        : 'text-[#5f5544]'
                    }`}
                  >
                    {step.name}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className="mx-3 text-[#a69881]">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div 
              className="lg:col-span-8 mb-8 lg:mb-0"
              variants={containerVariants}
            >
              {totalPrice < freeShippingThreshold && (
                <motion.div 
                  className="bg-gradient-to-r from-[#f0e5cf] to-[#e9dbbb] p-5 rounded-lg shadow-md mb-6 border border-[#e5d6b1]"
                  variants={fadeInVariants}
                >
                  <div>
                    <p className="text-sm text-black mb-2">
                      Add <span className="font-medium">{formatPrice(amountToFreeShipping)}</span> more to get <span className="text-[#3c7c45] font-medium">Free Shipping</span>
                    </p>
                    <div className="w-full bg-[#e0d0b2] rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-[#7aac83] to-[#5f9969] h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeShippingProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="bg-gradient-to-r from-[#f5ead3] to-[#eee2c5] rounded-lg shadow-lg p-6 mb-6 border border-[#e5d6b1]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-black">Cart Items</h2>
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm text-[#5f5544] hover:text-[#b24a3c] flex items-center transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                </div>
                
                <AnimatePresence>
                  {showClearConfirm && (
                    <motion.div 
                      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div 
                        className="bg-[#f7eeda] rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-[#e5d6b1]"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <h3 className="text-lg font-medium mb-2 text-black">Clear your cart?</h3>
                        <p className="text-[#3f3a30] mb-6">Are you sure you want to remove all items from your cart?</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 py-2.5 border border-[#d4c4a8] rounded-md text-black hover:bg-[#eee2c5] transition-all duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              clearCart();
                              setShowClearConfirm(false);
                            }}
                            className="flex-1 py-2.5 bg-gradient-to-r from-[#b24a3c] to-[#c25a4c] text-white rounded-md hover:from-[#a4443a] hover:to-[#b55245] transition-all duration-300 shadow-md"
                          >
                            Clear Cart
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <ul className="divide-y divide-[#e0d0b2]">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li 
                        key={item.id} 
                        className="py-6 first:pt-0 last:pb-0"
                        variants={itemVariants}
                        initial="hidden"
                        animate={selectedItemId === item.id ? "removed" : "visible"}
                        exit="removed"
                        layout
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <motion.div 
                            className="bg-white rounded-lg overflow-hidden h-32 w-32 flex-shrink-0 mx-auto sm:mx-0 relative border border-[#e5d6b1] group shadow-md"
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative h-full w-full">
                              {imageErrors[item.id] ? (
                                <div className="h-full w-full flex items-center justify-center bg-[#f7f3ea]">
                                  <div className="text-[#a69881] flex flex-col items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                                    </svg>
                                    <span className="text-xs mt-1">No image</span>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover object-center transition-opacity duration-300"
                                  onError={() => handleImageError(item.id)}
                                />
                              )}
                            </div>
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300" />
                          </motion.div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col h-full">
                              <div>
                                <div className="flex justify-between">
                                  <h3 className="text-lg font-medium text-black">{item.name}</h3>
                                  <div className="flex flex-col items-end">
                                    <div className="text-lg font-medium text-black">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                    {item.originalPrice && item.originalPrice > item.price && (
                                      <div className="text-sm text-[#847a69] line-through">
                                        {formatPrice(item.originalPrice * item.quantity)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="mt-1 text-sm text-[#3f3a30] line-clamp-2">
                                  {item.description || `Premium quality ${item.name.toLowerCase()} with attention to detail`}
                                </p>
                                
                                <div className="mt-2 flex items-center gap-x-4 flex-wrap">
                                  {item.size && (
                                    <p className="text-sm text-black">
                                      Size: <span className="font-medium">{item.size}</span>
                                    </p>
                                  )}
                                  
                                  {item.color && (
                                    <>
                                      <span className="hidden sm:block h-4 w-px bg-[#e0d0b2]"></span>
                                      <div className="flex items-center">
                                        <p className="text-sm text-black mr-1">
                                          Color:
                                        </p>
                                        <div 
                                          className="w-4 h-4 rounded-full border border-[#e0d0b2]"
                                          style={{ 
                                            backgroundColor: item.color.startsWith('#') 
                                              ? item.color 
                                              : item.color
                                          }}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <div className="inline-flex items-center rounded-full border border-[#e0d0b2] bg-white shadow-sm">
                                    <motion.button
                                      whileHover={{ backgroundColor: "rgba(224, 208, 178, 0.2)" }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        item.quantity <= 1 ? 'text-[#ccc0a9] cursor-not-allowed' : 'text-black'
                                      } transition-all duration-300`}
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="w-3 h-3" />
                                    </motion.button>
                                    <span className="mx-3 text-sm font-medium text-black w-5 text-center">
                                      {item.quantity}
                                    </span>
                                    <motion.button
                                      whileHover={{ backgroundColor: "rgba(224, 208, 178, 0.2)" }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full text-black transition-all duration-300"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ color: "#b24a3c" }}
                                    transition={{ duration: 0.3 }}
                                    type="button"
                                    onClick={() => handleItemRemove(item.id)}
                                    className="flex items-center text-sm text-[#5f5544] hover:text-[#b24a3c] transition-colors duration-300"
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-[#f5ead3] to-[#eee2c5] rounded-lg shadow-lg p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-[#e5d6b1]"
                variants={fadeInVariants}
              >
                <div className="flex items-center justify-center sm:justify-start">
                  <ShieldCheck className="h-5 w-5 text-black mr-2" />
                  <span className="text-sm text-black">Secure Payment</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <Truck className="h-5 w-5 text-black mr-2" />
                  <span className="text-sm text-black">Fast Shipping</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <PackageCheck className="h-5 w-5 text-black mr-2" />
                  <span className="text-sm text-black">30-Day Returns</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="lg:col-span-4"
              variants={containerVariants}
            >
              <div className="sticky top-[150px]">
                <motion.div 
                  className="bg-gradient-to-br from-[#f3e8cd] to-[#ede0bd] rounded-lg shadow-lg p-6 mb-4 border border-[#e5d6b1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <h3 className="text-xl font-medium text-black mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-black">Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-black">{formatPrice(totalPrice)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-[#3c7c45]">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-black">Tax</span>
                      <span className="text-black">{formatPrice(tax)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-black">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-[#3c7c45] font-medium">Free</span>
                      ) : (
                        <span className="text-black">{formatPrice(shipping)}</span>
                      )}
                    </div>
                    
                    <div className="border-t border-[#e0d0b2] pt-3 flex justify-between items-center">
                      <span className="text-lg font-medium text-black">Total</span>
                      <span className="text-lg font-medium text-black">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm font-medium text-black mb-2">Have a Coupon?</p>
                    <div className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 rounded-l-md border border-r-0 border-[#e0d0b2] bg-white py-2.5 px-3 text-sm focus:border-[#d1bc90] focus:ring-0 text-black placeholder-[#aba088]"
                      />
                      <motion.button
                        whileHover={{ backgroundColor: "#e5d6b1" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={applyCoupon}
                        disabled={!couponCode || isApplyingCoupon}
                        className={`rounded-r-md bg-[#f0e5cf] py-2.5 px-4 text-sm font-medium border border-[#e0d0b2] ${
                          !couponCode || isApplyingCoupon
                            ? 'text-[#bbb19d] cursor-not-allowed'
                            : 'text-black hover:bg-[#e5d6b1]'
                        } transition-all duration-300`}
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm text-center text-black">
                    <p>Estimated Delivery by <span className="font-medium">July 20, 2025</span></p>
                  </div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ boxShadow: "0 6px 15px rgba(51, 51, 51, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-[#333] to-[#222] text-white rounded-md shadow-md transition-all duration-300 text-sm font-medium tracking-wide hover:from-[#222] hover:to-[#111]"
                  >
                    Proceed to Checkout
                  </motion.button>
                </motion.div>
                
                <div className="bg-gradient-to-r from-[#f5ead3] to-[#eee2c5] rounded-lg p-4 flex flex-col items-center border border-[#e5d6b1] shadow-md">
                  <p className="text-xs text-center text-black mb-3">We Accept</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="h-6 opacity-90">
                      <svg viewBox="0 0 38 24" width="38" height="24" className="h-full w-auto">
                        <title>Visa</title>
                        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                        <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
                      </svg>
                    </div>
                    <div className="h-6 opacity-90">
                      <svg viewBox="0 0 38 24" width="38" height="24" className="h-full w-auto">
                        <title>Mastercard</title>
                        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                        <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
                        <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
                        <path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path>
                      </svg>
                    </div>
                    <div className="h-6 opacity-90">
                      <div className="flex items-center justify-center h-full bg-[#f0f8f2] px-3 rounded text-xs font-medium text-[#3c7c45] shadow-sm">
                        EasyPaisa
                      </div>
                    </div>
                    <div className="h-6 opacity-90">
                      <div className="flex items-center justify-center h-full bg-[#fbf0ed] px-3 rounded text-xs font-medium text-[#b24a3c] shadow-sm">
                        JazzCash
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EmptyCart = ({ onClose }) => {
  const router = useRouter();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <motion.div 
      className="max-w-2xl mx-auto py-12 flex flex-col items-center text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-40 h-40 bg-gradient-to-br from-[#f5ead3] to-[#eee2c5] rounded-full flex items-center justify-center mb-6 shadow-md border border-[#e5d6b1]"
        variants={itemVariants}
      >
        <motion.div
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ 
            rotate: 0, 
            scale: 1, 
            transition: { 
              type: 'spring', 
              stiffness: 200,
              delay: 0.3,
            }
          }}
        >
          <ShoppingBag className="w-16 h-16 text-[#8a7d67]" />
        </motion.div>
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-light text-black mb-4 tracking-wide"
        variants={itemVariants}
      >
        Your cart is empty
      </motion.h2>
      
      <motion.p 
        className="text-[#3f3a30] max-w-md mb-8"
        variants={itemVariants}
      >
        Looks like you haven't added anything to your cart yet. 
        Explore our collections to find something you'll love.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        variants={itemVariants}
      >
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 6px 15px rgba(51, 51, 51, 0.2)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/collections')}
          className="px-8 py-3 bg-gradient-to-r from-[#333] to-[#222] text-white rounded-md shadow-md transition-all duration-300 hover:from-[#222] hover:to-[#111]"
        >
          Browse Collections
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="px-8 py-3 border border-[#e0d0b2] rounded-md bg-white hover:bg-[#fbf7ec] transition-all duration-300 text-black shadow-sm"
        >
          Return to Home
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8"
        variants={itemVariants}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f5ead3] to-[#eee2c5] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#e5d6b1]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-medium text-sm mb-1 text-black">Fast Delivery</h3>
          <p className="text-xs text-[#3f3a30]">Free on orders over Rs 5,000</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f5ead3] to-[#eee2c5] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#e5d6b1]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-medium text-sm mb-1 text-black">Secure Payments</h3>
          <p className="text-xs text-[#3f3a30]">100% protected payments</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f5ead3] to-[#eee2c5] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#e5d6b1]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="font-medium text-sm mb-1 text-black">Easy Returns</h3>
          <p className="text-xs text-[#3f3a30]">30 day return policy</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f5ead3] to-[#eee2c5] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#e5d6b1]">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-medium text-sm mb-1 text-black">24/7 Support</h3>
          <p className="text-xs text-[#3f3a30]">Dedicated support team</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Cart;