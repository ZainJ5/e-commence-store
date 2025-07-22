"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import useOrderStore from '../stores/orderStore';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { orders, getOrderById, setCurrentOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    setMounted(true);
    
    const orderId = params?.orderId;
    
    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
        setCurrentOrder(orderId);
      } else {
        router.push('/orders');
      }
    }
  }, [params, getOrderById, router, setCurrentOrder]);
  
  if (!mounted || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading order details...</p>
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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center"
        >
          <button 
            onClick={() => router.push('/orders')}
            className="mr-4 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900">Order Details</h1>
            <p className="text-gray-600 font-inter text-sm mt-1">Order #{order.orderId}</p>
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <h2 className="font-serif text-xl text-gray-900">Order Status</h2>
              <span className="text-sm font-medium bg-gray-900 text-white px-3 py-1 rounded-full">
                {order.status}
              </span>
            </motion.div>
          </div>
          
          <div className="px-6 py-5">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <div className="text-sm text-gray-600 font-inter mb-1">Date Placed</div>
                <div className="font-medium font-inter">{formatDate(order.orderDate)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-inter mb-1">Estimated Delivery</div>
                <div className="font-medium font-inter">{formatDate(order.estimatedDeliveryDate)}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <motion.h3 variants={itemVariants} className="font-serif text-xl text-gray-900">Items</motion.h3>
          </div>
          
          <div className="px-6 py-5">
            <motion.div variants={itemVariants}>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
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
                          <h4 className="text-sm font-medium text-gray-900 font-inter">{item.name}</h4>
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
            
            <motion.div variants={itemVariants} className="border-t border-gray-200 pt-5 mt-5">
              <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 font-inter">Subtotal</span>
                  <span className="text-sm font-medium font-inter">{formatPrice(order.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 font-inter">Shipping</span>
                  <span className="text-sm font-medium font-inter">{formatPrice(order.payment.shipping)}</span>
                </div>
                {order.payment.discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 font-inter">Discount</span>
                    <span className="text-sm font-medium font-inter">-{formatPrice(order.payment.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
                  <span className="text-base font-medium text-gray-900 font-serif">Total</span>
                  <span className="text-base font-medium text-gray-900 font-serif">{formatPrice(order.payment.total)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <motion.h3 variants={itemVariants} className="font-serif text-xl text-gray-900">Shipping</motion.h3>
            </div>
            
            <div className="px-6 py-5">
              <motion.div variants={itemVariants}>
                <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Delivery Address</h4>
                <address className="not-italic text-sm text-gray-600 font-inter mb-4">
                  {order.customer.firstName} {order.customer.lastName}<br />
                  {order.shipping.address.street}
                  {order.shipping.address.apartment && <><br />{order.shipping.address.apartment}</>}
                  <br />
                  {order.shipping.address.city}, {order.shipping.address.zipCode}<br />
                  {order.shipping.address.country}
                </address>
                
                <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Shipping Method</h4>
                <p className="text-sm text-gray-600 font-inter">
                  {order.shipping.method === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
                </p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
          >
            <div className="px-6 py-5 border-b border-gray-200">
              <motion.h3 variants={itemVariants} className="font-serif text-xl text-gray-900">Payment</motion.h3>
            </div>
            
            <div className="px-6 py-5">
              <motion.div variants={itemVariants}>
                <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Payment Method</h4>
                <p className="text-sm text-gray-600 font-inter mb-4 capitalize">
                  {order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method}
                </p>
                
                {order.payment.method !== 'cod' && order.payment.receiptImage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Payment Receipt</h4>
                    <div className="mt-2 rounded-md border border-gray-200 overflow-hidden">
                      <img 
                        src={order.payment.receiptImage} 
                        alt="Payment receipt" 
                        className="w-full object-contain"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-8"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <motion.h3 variants={itemVariants} className="font-serif text-xl text-gray-900">Customer Information</motion.h3>
          </div>
          
          <div className="px-6 py-5">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row">
              <div className="sm:w-1/2 mb-4 sm:mb-0">
                <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Contact Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 font-inter">
                    <span className="font-medium">Name:</span> {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-sm text-gray-600 font-inter">
                    <span className="font-medium">Email:</span> {order.customer.email}
                  </p>
                  <p className="text-sm text-gray-600 font-inter">
                    <span className="font-medium">Phone:</span> {order.customer.phone}
                  </p>
                </div>
              </div>
              
              <div className="sm:w-1/2">
                <h4 className="text-sm font-medium text-gray-900 mb-2 font-inter">Need Help?</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-900" />
                    <a href="mailto:support@fashionstore.com" className="text-sm text-gray-900 hover:underline font-inter">
                      support@fashionstore.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-900" />
                    <a href="tel:+923001234567" className="text-sm text-gray-900 hover:underline font-inter">
                      +92 300 123 4567
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-inter"
          >
            Back to Orders
          </button>
        </motion.div>
      </div>
    </div>
  );
}