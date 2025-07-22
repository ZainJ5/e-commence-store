"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, AlertCircle, X, Check } from 'lucide-react'; 
import confetti from 'canvas-confetti';
import Head from 'next/head';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import ShippingForm from './components/ShippingForm';
import PaymentForm from './components/PaymentForm';
import OrderConfirmation from './components/OrderConfirmation';
import OrderSummary from './components/OrderSummary';
import CheckoutProgress from './components/CheckoutProgress';

import useCartStore from '../stores/cartStores';
import useOrderStore from '../stores/orderStore';
import { useCheckoutForm } from './hooks/useCheckoutForm';

export default function CheckoutPage() {
  const router = useRouter();
  
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  
  const addOrder = useOrderStore((state) => state.addOrder);
  
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [promoCodeDetails, setPromoCodeDetails] = useState(null);

  const {
    shippingInfo,
    errors,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    uploadedImage,
    setUploadedImage,
    uploadPreview,
    setUploadPreview,
    couponCode,
    setCouponCode,
    discount,
    isApplyingCoupon,
    setIsApplyingCoupon,
    handleInputChange,
    handleUploadClick,
    handleFileChange,
    validateShippingForm,
    validatePaymentForm,
    getShippingCost,
    setDiscount,
  } = useCheckoutForm();

  const shipping = getShippingCost(totalPrice);
  const tax = 0;
  const finalTotal = totalPrice + shipping - discount + tax;

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const generateOrderId = () => {
    const prefix = 'ORD';
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().getTime().toString().slice(-4);
    return `${prefix}-${randomNum}-${timestamp}`;
  };

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleMobileFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileUploadClick = () => {
    document.getElementById('payment-receipt-mobile').click();
  };

  const handleCouponApply = async () => {
    if (!couponCode) return;
    
    setCouponError(null);
    setIsApplyingCoupon(true);
    
    try {
      const response = await fetch(`/api/promocode/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: totalPrice
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid promo code');
      }
      
      setDiscount((totalPrice * data.promoCode.discountPercentage / 100).toFixed(2));
      setAppliedPromoCode(data.promoCode.code);
      setPromoCodeDetails(data.promoCode);
      
    } catch (error) {
      console.error("Promo code error:", error);
      setCouponError(error.message);
      setDiscount(0);
      setAppliedPromoCode(null);
      setPromoCodeDetails(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setActiveStep('payment');
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    if (validatePaymentForm()) {
      setIsProcessing(true);
      
      try {
        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        
        const orderItems = items.map(item => ({
          ...item,
          customizable: item.customizable === true
        }));
        
        const order = {
          orderId: generateOrderId(),
          orderDate: currentDate.toISOString(),
          estimatedDeliveryDate: deliveryDate.toISOString(),
          customer: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            fullAddress: `${shippingInfo.address}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}, ${shippingInfo.city}, ${shippingInfo.state || ''} ${shippingInfo.zipCode}, ${shippingInfo.country}`
          },
          items: orderItems,
          payment: {
            method: paymentMethod,
            receiptImage: paymentMethod !== 'cod' && uploadPreview ? uploadPreview : null,
            subtotal: totalPrice,
            shipping: shipping,
            discount: discount,
            tax: tax,
            total: finalTotal,
            promoCode: appliedPromoCode ? {
              code: appliedPromoCode,
              discountPercentage: promoCodeDetails?.discountPercentage || null,
              promoCodeId: promoCodeDetails?._id || null
            } : null
          },
          shipping: {
            method: shippingMethod,
            address: {
              street: shippingInfo.address,
              apartment: shippingInfo.apartment,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
              country: shippingInfo.country
            }
          },
          status: 'confirmed'
        };
        
        console.log("Order being created:", order);
        
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to place order');
        }
        
        console.log("Order created successfully:", data.order);
        
        addOrder(data.order);
        setCurrentOrder(data.order);
        setActiveStep('confirmation');
        clearCart();
        setTimeout(triggerConfetti, 300);
      } catch (error) {
        console.error("Error adding order:", error);
      } finally {
        setIsProcessing(false);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (activeStep === 'payment') {
      setActiveStep('shipping');
      window.scrollTo(0, 0);
    } else if (activeStep === 'shipping') {
      router.push('/');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
        ease: [0.25, 0.8, 0.25, 1],
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30
      }
    }
  };

  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    if (items.length === 0 && activeStep !== 'confirmation') {
      return (
        <div className="max-w-4xl mx-auto px-4 text-black sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-6">Your Bag is Empty</h1>
            <p className="text-gray-600 mb-8 tracking-wide">Add some items to your bag before checking out.</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-black text-white rounded-md transition-all duration-500 hover:bg-gray-800 uppercase tracking-widest text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-black py-10 sm:py-12">
        {activeStep !== 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            className="mb-8 flex items-center"
          >
            <button 
              onClick={handleBack}
              className="mr-4 p-1.5 rounded-full hover:bg-gray-50 transition-all duration-300"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </button>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl text-gray-900">
              Checkout
            </h1>
          </motion.div>
        )}
        
        {activeStep !== 'confirmation' && <CheckoutProgress activeStep={activeStep} />}

        {activeStep !== 'confirmation' ? (
          <div>
            <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
              <div className={`lg:col-span-7`}>
                <AnimatePresence mode="wait">
                  {activeStep === 'shipping' && (
                    <ShippingForm 
                      key="shipping"
                      shippingInfo={shippingInfo}
                      handleInputChange={handleInputChange}
                      errors={errors}
                      shippingMethod={shippingMethod}
                      setShippingMethod={setShippingMethod}
                      handleContinueToPayment={handleContinueToPayment}
                      containerVariants={containerVariants}
                      itemVariants={itemVariants}
                    />
                  )}
                  
                  {activeStep === 'payment' && (
                    <PaymentForm 
                      key="payment"
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      uploadedImage={uploadedImage}
                      uploadPreview={uploadPreview}
                      handleUploadClick={handleUploadClick}
                      handleFileChange={handleFileChange}
                      handlePlaceOrder={handlePlaceOrder}
                      isProcessing={isProcessing}
                      errors={errors}
                      setUploadPreview={setUploadPreview}
                      setUploadedImage={setUploadedImage}
                      containerVariants={containerVariants}
                      itemVariants={itemVariants}
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <div className="lg:col-span-5">
                <motion.div
                  className="lg:sticky lg:top-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <OrderSummary 
                    items={items}
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    shipping={shipping}
                    discount={discount}
                    tax={tax}
                    finalTotal={finalTotal}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    handleCouponApply={handleCouponApply}
                    isApplyingCoupon={isApplyingCoupon}
                    couponError={couponError}
                    appliedPromoCode={appliedPromoCode}
                    activeStep={activeStep}
                    currentOrder={currentOrder}
                    formatPrice={formatPrice}
                    itemVariants={itemVariants}
                  />
                </motion.div>
              </div>
            </div>
            
            <div className="lg:hidden space-y-8">
              <div className="bg-gray-50 rounded-md p-6">
                <h2 className="font-['Playfair_Display'] text-xl text-gray-900 mb-6">
                  {activeStep === 'shipping' ? 'Contact Information' : 'Payment Method'}
                </h2>
                
                <AnimatePresence mode="wait">
                  {activeStep === 'shipping' && (
                    <motion.div
                      key="contact-section"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="firstName-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              First name
                            </label>
                            <input
                              type="text"
                              id="firstName-mobile"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 sm:text-sm border ${
                                errors.firstName ? 'border-red-300' : 'border-gray-300'
                              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                            />
                            {errors.firstName && (
                              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="lastName-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              Last name
                            </label>
                            <input
                              type="text"
                              id="lastName-mobile"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 sm:text-sm border ${
                                errors.lastName ? 'border-red-300' : 'border-gray-300'
                              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                            />
                            {errors.lastName && (
                              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="email-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              Email address
                            </label>
                            <input
                              type="email"
                              id="email-mobile"
                              name="email"
                              value={shippingInfo.email}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 sm:text-sm border ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                            />
                            {errors.email && (
                              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="phone-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              Phone number
                            </label>
                            <input
                              type="tel"
                              id="phone-mobile"
                              name="phone"
                              value={shippingInfo.phone}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 sm:text-sm border ${
                                errors.phone ? 'border-red-300' : 'border-gray-300'
                              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-['Playfair_Display'] text-lg text-gray-900 mb-4">Shipping Address</h3>
                        
                        <div className="space-y-5">
                          <div>
                            <label htmlFor="address-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              Street address
                            </label>
                            <input
                              type="text"
                              id="address-mobile"
                              name="address"
                              value={shippingInfo.address}
                              onChange={handleInputChange}
                              className={`block w-full px-3 py-2 sm:text-sm border ${
                                errors.address ? 'border-red-300' : 'border-gray-300'
                              } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                            />
                            {errors.address && (
                              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="apartment-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                              Apartment, suite, etc. (optional)
                            </label>
                            <input
                              type="text"
                              id="apartment-mobile"
                              name="apartment"
                              value={shippingInfo.apartment}
                              onChange={handleInputChange}
                              className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4">
                            <div>
                              <label htmlFor="city-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                                City
                              </label>
                              <input
                                type="text"
                                id="city-mobile"
                                name="city"
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                className={`block w-full px-3 py-2 sm:text-sm border ${
                                  errors.city ? 'border-red-300' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                              />
                              {errors.city && (
                                <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="zipCode-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                                ZIP / Postal
                              </label>
                              <input
                                type="text"
                                id="zipCode-mobile"
                                name="zipCode"
                                value={shippingInfo.zipCode}
                                onChange={handleInputChange}
                                className={`block w-full px-3 py-2 sm:text-sm border ${
                                  errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300`}
                              />
                              {errors.zipCode && (
                                <p className="mt-1 text-xs text-red-600">{errors.zipCode}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4">
                            <div>
                              <label htmlFor="state-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                                State / Province
                              </label>
                              <input
                                type="text"
                                id="state-mobile"
                                name="state"
                                value={shippingInfo.state}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="country-mobile" className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
                                Country
                              </label>
                              <select
                                id="country-mobile"
                                name="country"
                                value={shippingInfo.country}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-900 transition-colors duration-300"
                              >
                                <option value="Pakistan">Pakistan</option>
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {activeStep === 'payment' && (
                    <motion.div
                      key="payment-section"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-4">
                        <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'cod' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
                          <input
                            type="radio"
                            name="payment-method-mobile"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-black' : 'border border-gray-300'}`}>
                                {paymentMethod === 'cod' && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 tracking-wide">Cash on Delivery</div>
                                <div className="text-xs text-gray-500 tracking-wide">Pay when you receive your order</div>
                              </div>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'easypaisa' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
                          <input
                            type="radio"
                            name="payment-method-mobile"
                            value="easypaisa"
                            checked={paymentMethod === 'easypaisa'}
                            onChange={() => setPaymentMethod('easypaisa')}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'easypaisa' ? 'bg-black' : 'border border-gray-300'}`}>
                                {paymentMethod === 'easypaisa' && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 tracking-wide">EasyPaisa</div>
                                <div className="text-xs text-gray-500 tracking-wide">Send payment to our account</div>
                              </div>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative flex p-4 cursor-pointer border ${paymentMethod === 'jazzcash' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
                          <input
                            type="radio"
                            name="payment-method-mobile"
                            value="jazzcash"
                            checked={paymentMethod === 'jazzcash'}
                            onChange={() => setPaymentMethod('jazzcash')}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${paymentMethod === 'jazzcash' ? 'bg-black' : 'border border-gray-300'}`}>
                                {paymentMethod === 'jazzcash' && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 tracking-wide">JazzCash</div>
                                <div className="text-xs text-gray-500 tracking-wide">Send payment to our account</div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>

                      {paymentMethod !== 'cod' && (
                        <motion.div 
                          className="mt-6"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-['Playfair_Display'] text-lg text-gray-900 mb-4">
                            {paymentMethod === 'easypaisa' ? 'EasyPaisa Payment Details' : 'JazzCash Payment Details'}
                          </h3>
                          
                          <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
                            <div className="flex items-center mb-3">
                              <AlertCircle className="w-4 h-4 text-gray-900 mr-2 flex-shrink-0" />
                              <p className="text-sm text-gray-900 font-medium tracking-wide">Please send payment to the following account:</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 tracking-wide pl-6">
                              <p><span className="font-medium">Account Title:</span> Fashion Store</p>
                              <p><span className="font-medium">Phone Number:</span> 0300-1234567</p>
                              <p><span className="font-medium">Reference:</span> Your Order ID</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">
                                Upload Payment Screenshot
                              </label>
                              
                              <div 
                                onClick={handleMobileUploadClick}
                                className={`border-2 border-dashed ${errors.payment ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md px-6 pt-5 pb-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-all duration-300`}
                              >
                                <input 
                                  id="payment-receipt-mobile" 
                                  type="file" 
                                  accept="image/*" 
                                  className="sr-only" 
                                  onChange={handleMobileFileChange}
                                />
                                
                                {!uploadPreview ? (
                                  <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                      <p className="pl-1 tracking-wide">Click to upload payment screenshot</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      PNG, JPG, GIF up to 5MB
                                    </p>
                                  </div>
                                ) : (
                                  <div className="relative w-full">
                                    <img 
                                      src={uploadPreview} 
                                      alt="Payment screenshot" 
                                      className="mx-auto h-48 object-contain"
                                    />
                                    <div className="mt-2 text-center text-sm text-gray-500 tracking-wide">
                                      {uploadedImage.name}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadPreview(null);
                                        setUploadedImage(null);
                                      }}
                                      className="absolute top-0 right-0 bg-red-100 rounded-full p-1 text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-300"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              {errors.payment && (
                                <p className="mt-2 text-sm text-red-600">{errors.payment}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <OrderSummary 
                items={items}
                totalItems={totalItems}
                totalPrice={totalPrice}
                shipping={shipping}
                discount={discount}
                tax={tax}
                finalTotal={finalTotal}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                handleCouponApply={handleCouponApply}
                isApplyingCoupon={isApplyingCoupon}
                couponError={couponError}
                appliedPromoCode={appliedPromoCode}
                activeStep={activeStep}
                currentOrder={currentOrder}
                formatPrice={formatPrice}
                itemVariants={itemVariants}
              />
              
              {activeStep === 'shipping' && (
                <div className="bg-gray-50 rounded-md p-6">
                  <h2 className="font-['Playfair_Display'] text-xl text-gray-900 mb-6">Shipping Method</h2>
                  
                  <div className="space-y-4">
                    <label className={`relative flex p-4 cursor-pointer border ${shippingMethod === 'standard' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
                      <input
                        type="radio"
                        name="shipping-method"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${shippingMethod === 'standard' ? 'bg-black' : 'border border-gray-300'}`}>
                            {shippingMethod === 'standard' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 tracking-wide">Standard Shipping</div>
                            <div className="text-xs text-gray-500 tracking-wide">5-7 business days</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          Rs 250
                        </div>
                      </div>
                    </label>
                    
                    <label className={`relative flex p-4 cursor-pointer border ${shippingMethod === 'express' ? 'border-gray-900' : 'border-gray-200'} rounded-md hover:border-gray-300 transition-all duration-300`}>
                      <input
                        type="radio"
                        name="shipping-method"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${shippingMethod === 'express' ? 'bg-black' : 'border border-gray-300'}`}>
                            {shippingMethod === 'express' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 tracking-wide">Express Shipping</div>
                            <div className="text-xs text-gray-500 tracking-wide">2-3 business days</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          Rs 500
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 uppercase tracking-widest text-sm"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {activeStep === 'payment' && (
                <div className="bg-gray-50 rounded-md p-6">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`w-full py-3 ${
                      isProcessing 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-black hover:bg-gray-800'
                    } text-white rounded-md transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 uppercase tracking-widest text-sm`}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <OrderConfirmation
              key="confirmation"
              currentOrder={currentOrder}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              router={router}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col text-black bg-white">
      <Head>
        <title>
          {activeStep === 'confirmation' 
            ? 'Order Confirmation - ShahBazar' 
            : 'Checkout - ShahBazar'}
        </title>
      </Head>
      
      <Navbar />
      
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      <Footer />
    </div>
  );
}