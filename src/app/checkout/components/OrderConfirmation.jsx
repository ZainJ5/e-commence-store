import { motion } from 'framer-motion';
import { Check, ChevronRight, ShoppingBag, MessageCircle, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { WhatsappIcon, WhatsappShareButton } from 'react-share';

export default function OrderConfirmation({ currentOrder, containerVariants, itemVariants, router }) {
  if (!currentOrder) return null;

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const createWhatsAppMessage = () => {
    return `Hello! I just placed order #${currentOrder.orderId} and need to discuss customization details for my order. Please assist me with the customization process.`;
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="font-['serif'] text-3xl font-bold text-gray-900 mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-600">
            We've received your order and will begin processing it right away.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200"
        >
          <h2 className="font-['serif'] text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-medium">{currentOrder.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(currentOrder.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">
                {currentOrder.payment.method === 'cod' ? 'Cash on Delivery' : 
                 currentOrder.payment.method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium">{formatDate(currentOrder.estimatedDeliveryDate)}</p>
            </div>
          </div>
        </motion.div>

        {/* Items purchased section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="font-['serif'] text-xl font-bold text-gray-900 mb-4">
            Items Ordered
          </h2>
          <div className="space-y-4">
            {currentOrder.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center border-b border-gray-200 pb-4"
              >
                {item.image ? (
                  <div className="h-16 w-16 rounded-md overflow-hidden mr-4 relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>
                      Quantity: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                      {item.customizable === true && ` • Customizable`}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                Subtotal ({currentOrder.items.length} items)
              </div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(currentOrder.payment.subtotal)}
              </div>
            </div>
            
            {currentOrder.payment.promoCode && currentOrder.payment.promoCode.code && (
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500 flex items-center">
                  <Tag size={14} className="mr-1" />
                  <span>Promo Code ({currentOrder.payment.promoCode.code})</span>
                </div>
                <div className="text-sm font-medium text-green-600">
                  -{formatPrice(currentOrder.payment.discount)}
                </div>
              </div>
            )}
            
            {!currentOrder.payment.promoCode && currentOrder.payment.discount > 0 && (
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">Discount</div>
                <div className="text-sm font-medium text-green-600">
                  -{formatPrice(currentOrder.payment.discount)}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">Shipping</div>
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(currentOrder.payment.shipping)}
              </div>
            </div>
            
            {currentOrder.payment.tax > 0 && (
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">Tax</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(currentOrder.payment.tax)}
                </div>
              </div>
            )}
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            <div className="flex justify-between items-center">
              <div className="text-base font-semibold text-gray-900">Total</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(currentOrder.payment.total)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp section with react-share implementation - ENLARGED BUTTON */}
        <motion.div 
          variants={itemVariants} 
          className="mb-8 p-5 border border-green-100 bg-green-50 rounded-lg"
        >
          <h2 className="font-['serif'] text-xl font-bold text-gray-900 mb-3">
            Customization & Support
          </h2>
          
          <p className="text-gray-700 mb-4">
            Need help with your order or want to discuss customization options? Contact us via WhatsApp for quick assistance with any special requirements or questions about your purchase.
          </p>
          
          <div className="mb-4">
            <ul className="list-disc ml-5 text-sm text-gray-700">
              <li className="mb-1">Please mention your order number when contacting</li>
              <li className="mb-1">Describe any customization requirements in detail</li>
              <li className="mb-1">Feel free to send reference images if needed</li>
              <li>Our team will assist you promptly with your requests</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <WhatsappShareButton
              url="https://wa.me/923334928431"
              title={createWhatsAppMessage()}
              separator=" "
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md"
            >
              <div className="flex items-center justify-center p-2 shadow">
                <WhatsappIcon size={36} round className="mr-3" />
                <span>Contact Us on WhatsApp</span>
              </div>
            </WhatsappShareButton>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-all duration-500 shadow-sm"
          >
            Continue Shopping
            <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}