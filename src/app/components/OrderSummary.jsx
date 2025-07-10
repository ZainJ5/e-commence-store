'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import useCartStore from '../stores/cartStores';

const OrderSummary = ({ showCoupon = true, isCheckoutPage = false }) => {
  const { items, totalItems, totalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Calculate tax (0% for this example)
  const tax = 0;
  // Shipping is free above $100
  const shipping = totalPrice > 100 ? 0 : 15;
  // Calculate final total
  const finalTotal = totalPrice - discount + tax + shipping;
  
  const applyCoupon = () => {
    // Example coupon logic - you'd replace with actual validation
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
  
  return (
    <motion.div 
      className="bg-white rounded-lg p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Sub Total ({totalItems} items)</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="text-orange-500 font-medium">Free</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-3 flex justify-between">
          <span className="font-medium text-gray-900">Total</span>
          <span className="font-medium text-gray-900">${finalTotal.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Coupon Code */}
      {showCoupon && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-900 mb-2">Have a Coupon?</p>
          <div className="flex">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon Code"
              className="flex-1 rounded-l-md border border-r-0 border-gray-300 py-2 px-3 text-sm focus:border-black focus:ring-0"
            />
            <button
              onClick={applyCoupon}
              disabled={!couponCode || isApplyingCoupon}
              className={`rounded-r-md bg-gray-100 py-2 px-4 text-sm font-medium ${
                !couponCode || isApplyingCoupon
                  ? 'text-gray-400'
                  : 'text-orange-600 hover:bg-gray-200'
              }`}
            >
              {isApplyingCoupon ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      )}
      
      {/* Estimated Delivery */}
      <div className="mt-6 text-sm text-center text-gray-500">
        <p>Estimated Delivery by <span className="font-medium">25 April, 2025</span></p>
      </div>
      
      {/* Checkout button - only show if not on checkout page */}
      {!isCheckoutPage && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/checkout'}
          className="mt-6 w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide"
        >
          Proceed to Checkout
        </motion.button>
      )}
    </motion.div>
  );
};

export default OrderSummary;