import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  // Safely handle product data
  if (!product) return null;

  // Extract properties with fallbacks
  const {
    _id,
    name = 'Product Name',
    images = [],
    originalPrice = 0,
    discountedPrice = 0,
    size = [],
    stock = 0
  } = product;

  // Calculate discount percentage
  const discountPercentage = discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden w-[320px] h-[520px] mx-auto border border-gray-100 transition-shadow duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      {/* Image Container with Link */}
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent z-10" />
          
          {images[0] && (
            <motion.img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
          
          {isHovered && images[1] && (
            <motion.img
              src={images[1]}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col h-[200px]">
        {/* Product Name with Link */}
        <Link href={`/products/${_id}`}>
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2 hover:text-gray-700 transition-colors duration-200">
            {name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              PKR {discountedPrice || originalPrice}
            </span>
            {discountedPrice > 0 && (
              <span className="line-through text-gray-400 text-base ml-3">
                PKR {originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full mt-2 inline-block">
              Save {discountPercentage}%
            </span>
          )}
        </div>

        {/* Size Options */}
        {size.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Size:</div>
            <div className="flex flex-wrap gap-2">
              {size.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(s)}
                  className={`text-sm font-medium py-2 px-4 rounded-full transition-all duration-200 ${
                    selectedSize === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Indicator */}
        <div className="text-sm font-medium mb-4">
          {stock > 0 ? (
            <span className="text-green-600">
              In Stock • {stock} available
            </span>
          ) : (
            <span className="text-red-600">
              Out of Stock
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          <motion.button
            whileHover={{ 
              backgroundColor: "#111827",
              color: "#ffffff"
            }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2.5 px-4 rounded-full font-medium text-sm tracking-wide border-2 border-gray-900 text-gray-900 bg-transparent flex items-center justify-center gap-2 transition-colors duration-300"
            disabled={stock === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {stock > 0 ? 'Add to Bag' : 'Notify Me'}
          </motion.button>
          
          <Link href={`/ THROUGHproducts/${_id}`} className="flex-1">
            <motion.button
              whileHover={{ 
                backgroundColor: "#111827",
                color: "#ffffff"
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 px-4 rounded-full font-medium text-sm tracking-wide border-2 border-gray-900 text-gray-900 bg-transparent flex items-center justify-center transition-colors duration-300"
            >
              View Product
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full z-20 shadow-md">
          {discountPercentage}% OFF
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;