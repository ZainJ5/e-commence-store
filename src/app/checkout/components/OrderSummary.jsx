import { motion } from 'framer-motion';
import Image from 'next/image';
import { Tag, AlertCircle } from 'lucide-react';

const OrderSummary = ({ 
  items, 
  totalItems, 
  totalPrice, 
  shipping, 
  discount, 
  tax, 
  finalTotal,
  couponCode,
  setCouponCode,
  handleCouponApply,
  isApplyingCoupon,
  couponError,
  appliedPromoCode,
  activeStep,
  currentOrder,
  formatPrice,
  itemVariants
}) => {
  return (
    <motion.div>
      <motion.div 
        className="bg-gray-50 rounded-md p-6 mb-8"
        variants={itemVariants}
      >
        <h2 className="font-['serif'] text-xl text-gray-900 mb-6">Order Summary</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 tracking-wide">
              {activeStep === 'confirmation' ? `Items (${currentOrder.items.length})` : `Items (${totalItems})`}
            </span>
            <span className="text-sm text-gray-900 font-medium">
              {activeStep === 'confirmation' 
                ? formatPrice(currentOrder.payment.subtotal) 
                : formatPrice(totalPrice)}
            </span>
          </div>
          
          {((activeStep !== 'confirmation' && discount > 0) || 
            (activeStep === 'confirmation' && currentOrder?.payment.discount > 0)) && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 tracking-wide flex items-center">
                {(appliedPromoCode || (currentOrder?.payment.promoCode?.code)) ? (
                  <>
                    <Tag size={14} className="mr-1" />
                    <span>
                      Promo Code ({activeStep === 'confirmation' 
                        ? currentOrder.payment.promoCode.code 
                        : appliedPromoCode})
                      {(activeStep !== 'confirmation' && appliedPromoCode) && 
                        ` (${Math.round(discount / totalPrice * 100)}%)`}
                      {(activeStep === 'confirmation' && currentOrder?.payment.promoCode?.discountPercentage) && 
                        ` (${currentOrder.payment.promoCode.discountPercentage}%)`}
                    </span>
                  </>
                ) : (
                  "Discount"
                )}
              </span>
              <span className="text-sm text-green-600 font-medium">
                -{formatPrice(activeStep === 'confirmation' ? currentOrder.payment.discount : discount)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 tracking-wide">Shipping</span>
            {(activeStep === 'confirmation' ? currentOrder.payment.shipping : shipping) === 0 ? (
              <span className="text-sm text-gray-900 font-medium">Free</span>
            ) : (
              <span className="text-sm text-gray-900 font-medium">
                {formatPrice(activeStep === 'confirmation' ? currentOrder.payment.shipping : shipping)}
              </span>
            )}
          </div>
          
          {((activeStep !== 'confirmation' && tax > 0) || 
            (activeStep === 'confirmation' && currentOrder?.payment.tax > 0)) && (
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 tracking-wide">Tax</span>
              <span className="text-sm text-gray-900 font-medium">
                {formatPrice(activeStep === 'confirmation' ? currentOrder.payment.tax : tax)}
              </span>
            </div>
          )}
          
          <div className="h-px bg-gray-200 my-4"></div>
          
          <div className="flex justify-between">
            <span className="font-['serif'] text-base text-gray-900">Total</span>
            <span className="font-['serif'] text-base font-medium text-gray-900">
              {formatPrice(activeStep === 'confirmation' ? currentOrder.payment.total : finalTotal)}
            </span>
          </div>
        </div>
        
        {activeStep !== 'confirmation' && (
          <div className="mb-6">
            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2 tracking-wide uppercase">
              Promo code
            </label>
            <div className="flex">
              <input
                type="text"
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className={`flex-1 block w-full px-3 py-2 sm:text-sm border ${
                  couponError ? 'border-red-300' : 'border-gray-300'
                } rounded-l-md focus:outline-none focus:ring-0 focus:border-gray-900`}
                placeholder="Enter code"
              />
              <button
                onClick={handleCouponApply}
                disabled={!couponCode || isApplyingCoupon}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 transition-colors duration-300 ${
                  !couponCode || isApplyingCoupon
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-black text-white'
                } text-sm uppercase tracking-widest`}
              >
                {isApplyingCoupon ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertCircle size={14} className="mr-1" />
                <span>{couponError}</span>
              </div>
            )}
            {appliedPromoCode && discount > 0 && (
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <Tag size={14} className="mr-1" />
                <span>Promo code "{appliedPromoCode}" applied!</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
      
      <motion.div 
        className="bg-gray-50 rounded-md p-6"
        variants={itemVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-['serif'] text-base text-gray-900">Your Items</h2>
          <span className="text-sm text-gray-600 tracking-wide">
            {activeStep === 'confirmation' 
              ? `${currentOrder.items.length} ${currentOrder.items.length === 1 ? 'item' : 'items'}`
              : `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
          </span>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {activeStep === 'confirmation' 
            ? currentOrder.items.map((item) => (
                <OrderItem key={`${item.id}-${item.size}-${item.color}`} item={item} formatPrice={formatPrice} />
              ))
            : items.map((item) => (
                <OrderItem key={`${item.id}-${item.size}-${item.color}`} item={item} formatPrice={formatPrice} />
              ))
          }
        </ul>
      </motion.div>
    </motion.div>
  );
};

const OrderItem = ({ item, formatPrice }) => (
  <li className="py-4 flex">
    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md border border-gray-200 overflow-hidden relative">
      {item.image ? (
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover object-top"
          sizes="64px"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
          No image
        </div>
      )}
      <div className="hidden absolute inset-0 items-center justify-center bg-gray-50 text-gray-400">
        No image
      </div>
    </div>
    <div className="ml-4 flex-1 flex flex-col">
      <div>
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 tracking-wide">{item.name}</h3>
          <p className="text-sm font-medium text-gray-900 ml-1">{formatPrice(item.price * item.quantity)}</p>
        </div>
        <p className="mt-1 text-xs text-gray-500 tracking-wide">
          {item.size && `Size: ${item.size}`} 
          {item.size && item.color && ' • '}
          {item.color && `Color: ${item.color}`}
        </p>
      </div>
      <div className="mt-1 text-xs text-gray-500 tracking-wide">Qty: {item.quantity}</div>
    </div>
  </li>
);

export default OrderSummary;