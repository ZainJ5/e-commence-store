'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import useCartStore from '../stores/cartStores';

const Cart = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, updateItemQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const formatPrice = (price) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cartVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } },
    exit: { x: '100%', opacity: 0, transition: { type: 'tween', duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 text-black bg-black/50 z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 overflow-hidden flex flex-col"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center p-5 text-black border-b border-gray-200">
              <div className="flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                <h2 className="font-['Playfair_Display'] text-xl text-gray-900">Your Bag</h2>
                {totalItems > 0 && (
                  <span className="ml-2 text-sm text-gray-600">({totalItems})</span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="font-['Playfair_Display'] text-xl text-gray-900 mb-2">Your bag is empty</h3>
                  <p className="text-gray-600 mb-6 text-sm tracking-wide">Looks like you haven't added any items yet.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-500 uppercase tracking-widest text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="py-6 flex"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                      >
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md border border-gray-200 overflow-hidden relative">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover object-top"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-900 tracking-wide">{item.name}</h3>
                              <p className="text-sm font-medium text-gray-900 ml-2">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 tracking-wide space-y-1">
                              {item.size && <p>Size: {item.size}</p>}
                              {item.color && <p>Color: {item.color}</p>}
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                              <button
                                onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1 text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-2 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-gray-500 hover:text-black transition-colors duration-300 uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="font-['Playfair_Display'] text-base text-gray-900">Subtotal</span>
                  <span className="font-['Playfair_Display'] text-base font-medium text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4 tracking-wide">
                  Shipping and taxes will be calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-500 uppercase tracking-widest text-sm group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;