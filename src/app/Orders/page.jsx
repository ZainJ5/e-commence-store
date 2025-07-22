"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import useOrderStore from '../stores/orderStore';
import { Package, ChevronRight, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Image from 'next/image';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { orders, setCurrentOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };
  
  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  const handleViewOrderDetails = (order) => {
    setCurrentOrder(order.orderId);
    router.push(`/orders/${order.orderId}`);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="font-serif text-3xl text-gray-900 mb-4">Your Orders</h1>
          <p className="text-gray-600 font-inter">
            View and manage your order history
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders by order number or status..."
              className="pl-10 block w-full border border-gray-300 rounded-md py-3 text-sm font-inter focus:outline-none focus:ring-0 focus:border-gray-900"
            />
          </div>
        </motion.div>
        
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-50 rounded-lg p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="font-serif text-xl text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 font-inter mb-6">
              Once you place an order, it will appear here.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-inter"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredOrders.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h2 className="font-serif text-xl text-gray-900 mb-2">No matching orders</h2>
                <p className="text-gray-600 font-inter">
                  Try a different search term or clear your search.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <motion.div
                    key={order.orderId}
                    variants={itemVariants}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleOrderDetails(order.orderId)}
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 font-serif mr-3">{order.orderId}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-inter mt-1">
                          Ordered on {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-lg font-medium text-gray-900 mr-4">
                          {formatPrice(order.payment.total)}
                        </p>
                        {expandedOrderId === order.orderId ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedOrderId === order.orderId && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 font-inter mb-2">
                            Order Items ({order.items.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center p-2 bg-white rounded border border-gray-100">
                                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover object-center"
                                      sizes="48px"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
                                      <span className="text-xs">No img</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3 flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h5>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div className="mb-4 sm:mb-0">
                            <h4 className="text-sm font-medium text-gray-900 font-inter mb-2">Shipping Address</h4>
                            <p className="text-sm text-gray-600 font-inter">
                              {order.shipping.address.street}, {order.shipping.address.city}<br />
                              {order.shipping.address.zipCode}, {order.shipping.address.country}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 font-inter mb-2">Payment Method</h4>
                            <p className="text-sm text-gray-600 font-inter capitalize">
                              {order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleViewOrderDetails(order)}
                          className="w-full sm:w-auto flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          View Complete Details
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}