"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useOrderStore from '../../stores/orderStore';
import { Check, ChevronRight, ArrowRight, Mail, Phone, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import Head from 'next/head';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { currentOrder, clearCurrentOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (!currentOrder && mounted) {
      setRedirecting(true);
      router.push('/');
      return;
    }
    
    if (currentOrder && mounted) {
      const triggerConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      };
      
      setTimeout(triggerConfetti, 500);
    }
    
    return () => {
      if (currentOrder) {
        setTimeout(() => {
          clearCurrentOrder();
        }, 2000);
      }
    };
  }, [currentOrder, router, clearCurrentOrder, mounted]);
  
  if (!mounted) {
    return null;
  }
  
  if (redirecting || !currentOrder) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">No order data found. Redirecting...</p>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Order Confirmation - Fashion Store</title>
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center"
        >
          <button 
            onClick={() => router.push('/')}
            className="mr-4 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="Go home"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl text-gray-900">Checkout</h1>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative flex items-center">
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="mt-2 text-sm font-inter">Shipping</span>
            </div>
            <div className="w-16 sm:w-24 h-[1px] mx-1 sm:mx-3 bg-gray-200"></div>
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Check className="w-4 h-4" />
              </div>
              <span className="mt-2 text-sm font-inter">Payment</span>
            </div>
            <div className="w-16 sm:w-24 h-[1px] mx-1 sm:mx-3 bg-gray-200"></div>
            <div className="flex flex-col items-center text-gray-900">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white">
                3
              </div>
              <span className="mt-2 text-sm font-inter">Confirmation</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-6"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-3xl sm:text-4xl text-gray-900 mb-3"
            >
              Thank You For Your Order!
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 font-inter text-lg"
            >
              Your order has been received and is being processed.
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-10"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <motion.div variants={itemVariants} className="flex justify-between items-center">
                <h2 className="font-serif text-xl text-gray-900">Order Summary</h2>
                <span className="text-sm font-medium bg-gray-900 text-white px-3 py-1 rounded-full">
                  {currentOrder.status}
                </span>
              </motion.div>
            </div>
            
            <div className="px-6 py-5">
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                  <div className="text-sm text-gray-600 font-inter mb-1">Order Number</div>
                  <div className="font-medium font-inter">{currentOrder.orderId}</div>
                </div>
                <div className="mb-4 sm:mb-0">
                  <div className="text-sm text-gray-600 font-inter mb-1">Date Placed</div>
                  <div className="font-medium font-inter">{formatDate(currentOrder.orderDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-inter mb-1">Estimated Delivery</div>
                  <div className="font-medium font-inter">{formatDate(currentOrder.estimatedDeliveryDate)}</div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="border-t border-gray-200 py-5">
                <h3 className="font-serif text-lg text-gray-900 mb-4">Items in your order</h3>
                <ul className="divide-y divide-gray-200">
                  {currentOrder.items.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md border border-gray-200 overflow-hidden relative">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                            sizes="64px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1 font-inter">{item.name}</h4>
                            <p className="text-sm font-medium text-gray-900 ml-1">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 font-inter">
                            {item.size && `Size: ${item.size}`} 
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 font-inter">Qty: {item.quantity}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={itemVariants} className="border-t border-gray-200 py-5">
                <div className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 font-inter">Subtotal</span>
                    <span className="text-sm font-medium font-inter">{formatPrice(currentOrder.payment.subtotal)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 font-inter">Shipping</span>
                    <span className="text-sm font-medium font-inter">{formatPrice(currentOrder.payment.shipping)}</span>
                  </div>
                  {currentOrder.payment.discount > 0 && (
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 font-inter">Discount</span>
                      <span className="text-sm font-medium font-inter">-{formatPrice(currentOrder.payment.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
                    <span className="text-base font-medium text-gray-900 font-serif">Total</span>
                    <span className="text-base font-medium text-gray-900 font-serif">{formatPrice(currentOrder.payment.total)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-10"
          >
            <div className="px-6 py-5">
              <motion.h3 variants={itemVariants} className="font-serif text-lg text-gray-900 mb-4">Shipping Details</motion.h3>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 mb-4 sm:mb-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Delivery Address</h4>
                  <address className="not-italic text-sm text-gray-600 font-inter">
                    {currentOrder.customer.firstName} {currentOrder.customer.lastName}<br />
                    {currentOrder.shipping.address.street}
                    {currentOrder.shipping.address.apartment && <><br />{currentOrder.shipping.address.apartment}</>}
                    <br />
                    {currentOrder.shipping.address.city}, {currentOrder.shipping.address.zipCode}<br />
                    {currentOrder.shipping.address.country}
                  </address>
                </div>
                <div className="sm:w-1/2">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Shipping Method</h4>
                  <p className="text-sm text-gray-600 font-inter">
                    {currentOrder.shipping.method === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
                  </p>
                  <p className="text-sm text-gray-600 font-inter mt-1">
                    Estimated delivery: {formatDate(currentOrder.estimatedDeliveryDate)}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-10"
          >
            <div className="px-6 py-5">
              <motion.h3 variants={itemVariants} className="font-serif text-lg text-gray-900 mb-4">Need Help?</motion.h3>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row">
                <div className="sm:w-1/2 mb-4 sm:mb-0">
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 mr-2 text-gray-900" />
                    <h4 className="text-sm font-medium text-gray-900 font-inter">Email Us</h4>
                  </div>
                  <p className="text-sm text-gray-600 font-inter">
                    <a href="mailto:support@fashionstore.com" className="text-gray-900 hover:underline">
                      support@fashionstore.com
                    </a>
                  </p>
                </div>
                <div className="sm:w-1/2">
                  <div className="flex items-center mb-2">
                    <Phone className="w-4 h-4 mr-2 text-gray-900" />
                    <h4 className="text-sm font-medium text-gray-900 font-inter">Call Us</h4>
                  </div>
                  <p className="text-sm text-gray-600 font-inter">
                    <a href="tel:+923001234567" className="text-gray-900 hover:underline">
                      +92 300 123 4567
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 font-inter mt-1">
                    Mon-Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push('/orders')}
              className="px-6 py-3 bg-white border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors font-inter flex items-center justify-center"
            >
              View Order History
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black rounded-md text-white hover:bg-gray-800 transition-colors font-inter flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}