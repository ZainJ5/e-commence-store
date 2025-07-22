import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function YouMayAlsoLike({ currentProductId, category }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?category=${category}&exclude=${currentProductId}&limit=4`);
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const data = await response.json();
        setRelatedProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProductId && category) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category]);

  const formatPrice = (price) => {
    return `Rs ${Number(price).toLocaleString()}.00`;
  };

  return (
    <div className="mt-20 pt-10 border-t border-gray-100">
      <h2 className="text-3xl font-medium font-['Playfair_Display'] mb-8 text-center">You May Also Like</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-w-1 aspect-h-1 bg-gray-50 overflow-hidden mb-3">
                <div className="w-full h-full bg-gray-100 animate-pulse"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))
        ) : relatedProducts.length > 0 ? (
          relatedProducts.map(product => (
            <Link key={product._id} href={`/products/${product._id}`}>
              <motion.div 
                className="group cursor-pointer hover:opacity-95 transition-opacity duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-50 overflow-hidden mb-3">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium group-hover:underline">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.discountedPrice ? (
                      <span>
                        {formatPrice(product.discountedPrice)}
                        <span className="ml-2 text-xs line-through text-gray-400">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </span>
                    ) : (
                      formatPrice(product.originalPrice)
                    )}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="aspect-w-1 aspect-h-1 bg-gray-50 overflow-hidden mb-3">
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M12 12h.01" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Product Name</h3>
                <p className="text-sm text-gray-600">Rs 1,200.00</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}