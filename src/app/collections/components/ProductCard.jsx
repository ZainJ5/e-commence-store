import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import useCartStore from '../../stores/cartStores';
import useWishlistStore from '../../stores/wishlistStore';

const ProductCard = ({ product, showNotification }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  
  const addItem = useCartStore(state => state.addItem);
  
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!product) return null;

  const {
    _id = '',
    images = [],
    originalPrice = 0,
    discountedPrice = 0,
    size = [],
    stock = 0,
  } = product;

  const name = typeof product.name === 'string' ? product.name : 'Product Name';
  
  const category = typeof product.category === 'string' ? product.category : '';
  
  const discountPercentage = discountedPrice 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  const safeSize = Array.isArray(size) ? size.map(s => String(s)) : [];
  
  const price = discountedPrice > 0 ? discountedPrice : originalPrice;
  
  useEffect(() => {
    setIsFavorite(isInWishlist(_id));
  }, [_id, isInWishlist]);
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (isFavorite) {
      removeFromWishlist(_id);
      showNotification && showNotification('Removed from wishlist');
    } else {
      addToWishlist(product);
      showNotification && showNotification('Added to wishlist');
    }
    
    setIsFavorite(!isFavorite);
  };
  
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${_id}`);
  };
  
  const handleAddToCart = () => {
    const cartItem = {
      id: `${_id}-${selectedSize || ''}`,
      productId: _id,
      name: name,
      price: price,
      image: images[0] || '',
      size: selectedSize || (safeSize.length > 0 ? safeSize[0] : ''),
      quantity: 1,
      maxQuantity: stock,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice
    };
    
    addItem(cartItem);
    
    if (showNotification) {
      showNotification('Added to cart');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-none overflow-hidden w-full max-w-[360px] mx-auto transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4]">
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 z-10 transition-opacity duration-300" />
          
          {images[0] && (
            <motion.img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.04 : 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.5 }}
            />
          )}

          <div className="absolute bottom-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 p-4 flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-800'}`} 
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewDetails}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            >
              <Eye className="w-5 h-5 text-gray-800" />
            </motion.button>
          </div>
        </div>
      </Link>

      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-3 py-1.5 z-20">
          {discountPercentage}% OFF
        </div>
      )}

      <div className="p-5 flex flex-col space-y-3">
        <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
          {category}
        </div>
        
        <Link href={`/products/${_id}`}>
          <h3 className="font-light text-base text-black tracking-wide hover:text-gray-600 transition-colors duration-200 line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline space-x-2">
          <span className={`text-sm font-medium ${discountedPrice > 0 ? 'text-red-700' : 'text-black'}`}>
            PKR {discountedPrice || originalPrice}
          </span>
          {discountedPrice > 0 && (
            <span className="line-through text-gray-400 text-xs">
              PKR {originalPrice}
            </span>
          )}
        </div>

        {safeSize.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {safeSize.map((s, index) => (
              <button
                key={`size-${index}-${s}`}
                onClick={() => setSelectedSize(s)}
                className={`px-2 py-1 text-xs border ${
                  selectedSize === s 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 hover:border-gray-400'
                } transition-colors`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="text-xs font-medium">
          {stock > 0 ? (
            <span className="text-green-700">
              In Stock
            </span>
          ) : (
            <span className="text-red-700">
              Out of Stock
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 w-full py-3 bg-black cursor-pointer text-white text-sm tracking-wide font-light flex items-center justify-center space-x-2 transition-all duration-300"
          disabled={stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{stock > 0 ? 'Add to Cart' : 'Notify Me'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;